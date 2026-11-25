/**
 * Aggregates for the "By the numbers" section on /travel.
 *
 * Computed once by the sync script from every trip's full step list and stored
 * in the snapshot, so the page only receives this small object.
 */
import { fmtWeather } from './format'
import type { Step, TripDetail } from './polarsteps'

export interface PlaceRef {
  place: string
  trip: string
}

export interface TripBar {
  id: number
  slug: string
  name: string
  start: string
  timezone: string
  km: number
  days: number
  steps: number
  photos: number
}

export interface TravelInsights {
  photos: number
  /** Total distance as a share of Earth's equatorial circumference (%). */
  earthPct: number
  longestLeg: (PlaceRef & { km: number; from: string }) | null
  hottest: (PlaceRef & { temp: number }) | null
  coolest: (PlaceRef & { temp: number }) | null
  /** Highest step by ground elevation (m). */
  highest: (PlaceRef & { elev: number }) | null
  /** Northern-, southern-, eastern- and westernmost steps. */
  compass: { dir: 'N' | 'S' | 'E' | 'W'; place: string; coord: string }[]
  /** Chronological, oldest first. */
  trips: TripBar[]
  /** Every month from the first trip to the last, with days spent travelling. */
  months: { key: string; days: number; trips: string[] }[]
  /** Steps logged per local hour of day (0–23). */
  hours: number[]
  weather: { label: string; count: number }[]
  /** Most-logged towns (steps per locality). */
  places: { name: string; steps: number; trips: number }[]
}

const EARTH_KM = 40075

export function computeTravelInsights(details: TripDetail[]): TravelInsights {
  const trips = details.slice().sort((a, b) => a.start.localeCompare(b.start))

  let photos = 0
  let longestLeg: TravelInsights['longestLeg'] = null
  let hottest: TravelInsights['hottest'] = null
  let coolest: TravelInsights['coolest'] = null
  let highest: TravelInsights['highest'] = null
  const hours = Array<number>(24).fill(0)
  const weather = new Map<string, number>()
  const places = new Map<string, { steps: number; trips: Set<number> }>()
  const monthDays = new Map<string, { days: number; trips: Set<string> }>()
  const allSteps: (Step & { trip: string })[] = []
  const bars: TripBar[] = []

  for (const t of trips) {
    const tripPhotos = t.steps.reduce((n, s) => n + s.photos.length, 0)
    photos += tripPhotos

    // Calendar days on the road, attributed to the month they fall in.
    const days = localDays(t.start, t.end ?? t.steps.at(-1)?.time ?? t.start, t.timezone)
    for (const d of days) {
      const key = d.slice(0, 7)
      const m = monthDays.get(key) ?? { days: 0, trips: new Set() }
      m.days++
      m.trips.add(t.name)
      monthDays.set(key, m)
    }

    bars.push({
      id: t.id,
      slug: t.slug,
      name: t.name,
      start: t.start,
      timezone: t.timezone,
      km: t.km,
      days: days.length,
      steps: t.steps.length,
      photos: tripPhotos,
    })

    t.steps.forEach((s, i) => {
      allSteps.push({ ...s, trip: t.name })
      hours[localHour(s.time, s.tz)]++

      if (s.weather) {
        const label = fmtWeather(s.weather.condition)
        weather.set(label, (weather.get(label) ?? 0) + 1)
        if (!hottest || s.weather.temp > hottest.temp) hottest = { temp: s.weather.temp, place: s.place, trip: t.name }
        if (!coolest || s.weather.temp < coolest.temp) coolest = { temp: s.weather.temp, place: s.place, trip: t.name }
      }
      if (s.elev != null && (!highest || s.elev > highest.elev)) highest = { elev: s.elev, place: s.place, trip: t.name }

      const town = s.place.split(',')[0].trim()
      if (town && town !== 'Somewhere') {
        const r = places.get(town) ?? { steps: 0, trips: new Set() }
        r.steps++
        r.trips.add(t.id)
        places.set(town, r)
      }

      const prev = t.steps[i - 1]
      if (prev) {
        const km = Math.round(haversine(prev.lat, prev.lon, s.lat, s.lon))
        if (!longestLeg || km > longestLeg.km) longestLeg = { km, from: prev.place, place: s.place, trip: t.name }
      }
    })
  }

  const totalKm = trips.reduce((n, t) => n + t.km, 0)

  return {
    photos,
    earthPct: Math.round((totalKm / EARTH_KM) * 1000) / 10,
    longestLeg,
    hottest,
    coolest,
    highest,
    compass: compass(allSteps),
    trips: bars,
    months: monthRange(Array.from(monthDays.keys())).map((key) => ({
      key,
      days: monthDays.get(key)?.days ?? 0,
      trips: Array.from(monthDays.get(key)?.trips ?? []),
    })),
    hours,
    weather: Array.from(weather, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count),
    places: Array.from(places, ([name, r]) => ({ name, steps: r.steps, trips: r.trips.size })).sort(
      (a, b) => b.steps - a.steps || b.trips - a.trips,
    ),
  }
}

/* ── helpers ──────────────────────────────────────────────────────────── */

const ymd = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso))

/** Every local calendar date (YYYY-MM-DD) from start to end, inclusive. */
function localDays(start: string, end: string, tz: string) {
  const out: string[] = []
  const d = new Date(`${ymd(start, tz)}T00:00:00Z`)
  const last = new Date(`${ymd(end, tz)}T00:00:00Z`)
  while (d <= last && out.length < 400) {
    out.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return out
}

function localHour(iso: string, timeZone: string) {
  const h = Number.parseInt(
    new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', hourCycle: 'h23' }).format(new Date(iso)),
    10,
  )
  return Number.isFinite(h) ? h % 24 : 0
}

/** All YYYY-MM keys from the earliest to the latest, filling gaps. */
function monthRange(keys: string[]) {
  if (!keys.length) return []
  const sorted = keys.slice().sort()
  let [y, m] = sorted[0].split('-').map(Number)
  const [ey, em] = sorted[sorted.length - 1].split('-').map(Number)
  const out: string[] = []
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m).padStart(2, '0')}`)
    if (++m > 12) {
      m = 1
      y++
    }
  }
  return out
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const r = Math.PI / 180
  const a =
    Math.sin(((lat2 - lat1) * r) / 2) ** 2 +
    Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lon2 - lon1) * r) / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(a))
}

function compass(steps: Step[]): TravelInsights['compass'] {
  if (!steps.length) return []
  const pick = (cmp: (a: Step, b: Step) => boolean) => steps.reduce((best, s) => (cmp(s, best) ? s : best))
  const fmt = (s: Step) => `${Math.abs(s.lat).toFixed(2)}°${s.lat >= 0 ? 'N' : 'S'} ${Math.abs(s.lon).toFixed(2)}°${s.lon >= 0 ? 'E' : 'W'}`
  const n = pick((a, b) => a.lat > b.lat)
  const s = pick((a, b) => a.lat < b.lat)
  const e = pick((a, b) => a.lon > b.lon)
  const w = pick((a, b) => a.lon < b.lon)
  return [
    { dir: 'N', place: n.place, coord: fmt(n) },
    { dir: 'S', place: s.place, coord: fmt(s) },
    { dir: 'E', place: e.place, coord: fmt(e) },
    { dir: 'W', place: w.place, coord: fmt(w) },
  ]
}
