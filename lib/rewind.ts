/**
 * "Year rewind" — a per-year summary for the Spotify-Wrapped-style story on
 * /travel. Computed by the sync from the full trip data and stored in the
 * snapshot (one small object per year).
 *
 * Trips belong to the year they started in (trip's local time). Day counts
 * follow Polarsteps' convention (calendar dates in UTC, start and end
 * inclusive) so they add up to the same total as the Polarsteps profile.
 */
import type { Outline } from './outlines'
import type { Photo, TripDetail } from './polarsteps'

/** A rewind's entry in the button row (the full story is loaded on demand). */
export interface RewindIndex {
  key: string
  kind: 'year' | 'all'
  year: number
  since: number
  trips: number
}

/** Fetch one rewind in the browser. content/rewind.json becomes its own lazy-loaded chunk. */
export async function loadRewind(key: string): Promise<YearRewind | null> {
  const all = (await import('../content/rewind.json')).default as unknown as Record<string, YearRewind>
  return all[key] ?? null
}

export interface YearRewind {
  /** "2025", "2026"… or "all" for the everything-so-far rewind. */
  key: string
  kind: 'year' | 'all'
  /** The year (for "all": the latest year). */
  year: number
  /** First year covered (same as `year` for a single year). */
  since: number
  trips: { name: string; slug: string; km: number; days: number; start: string; cover: Photo | null }[]
  km: number
  /** km as a share of Earth's equatorial circumference (%). */
  earthPct: number
  days: number
  steps: number
  photos: number
  countries: string[]
  /** Countries visited for the first time this year ("all": every country). */
  newCountries: string[]
  topTrip: { name: string; slug: string; km: number; days: number; cover: Photo | null } | null
  highest: { elev: number; place: string; trip: string; photo: Photo | null } | null
  hottest: { temp: number; place: string } | null
  coolest: { temp: number; place: string } | null
  busiestMonth: { key: string; days: number } | null
  topPlace: { name: string; steps: number } | null
  /** Up to 9 photos spread across the year. */
  collage: Photo[]
  /** Each trip's step coordinates [lat, lon] — drawn as the year's "signature". */
  routes: [number, number][][]
  /** Local dates spent travelling in `year`, as 0-based day-of-year. */
  travelDays: number[]
  /** Days spent travelling per month, keyed YYYY-MM. */
  monthDays: Record<string, number>
  /** Country borders around the routes (added by the sync; may be empty). */
  outlines?: Outline[]
  /** Step coordinates inside each country in `newCountries`. */
  countryPoints: Record<string, [number, number][]>
}

const EARTH_KM = 40075

const ymd = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso))

/** Polarsteps-style trip length: UTC calendar dates from start to end, inclusive. */
function psDays(start: string, end: string) {
  const a = Date.parse(`${start.slice(0, 10)}T00:00:00Z`)
  const b = Date.parse(`${end.slice(0, 10)}T00:00:00Z`)
  return Math.max(1, Math.round((b - a) / 86400000) + 1)
}

/** Local calendar dates (YYYY-MM-DD) the trip spans, for the busiest-month stat. */
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

/** n items spread evenly through a list. */
function spread<T>(list: T[], n: number) {
  if (list.length <= n) return list
  return Array.from({ length: n }, (_, i) => list[Math.round((i * (list.length - 1)) / (n - 1))])
}

export function computeRewinds(details: TripDetail[]): Record<string, YearRewind> {
  const trips = details.slice().sort((a, b) => a.start.localeCompare(b.start))
  const byYear = new Map<number, TripDetail[]>()
  for (const t of trips) {
    const y = Number(ymd(t.start, t.timezone).slice(0, 4))
    byYear.set(y, [...(byYear.get(y) ?? []), t])
  }
  const years = Array.from(byYear.keys()).sort((a, b) => a - b)
  if (!years.length) return {}

  const seen = new Set<string>()
  const out: Record<string, YearRewind> = {}
  for (const year of years) {
    const list = byYear.get(year)!
    const countries = Array.from(new Set(list.flatMap((t) => t.countries)))
    const fresh = countries.filter((c) => !seen.has(c))
    countries.forEach((c) => seen.add(c))
    out[year] = summarize(list, { key: String(year), kind: 'year', year, since: year, newCountries: fresh })
  }
  // "So far": everything from the first trip to today
  out.all = summarize(trips, {
    key: 'all',
    kind: 'all',
    year: years[years.length - 1],
    since: years[0],
    newCountries: Array.from(seen),
  })
  return out
}

function summarize(
  list: TripDetail[],
  o: { key: string; kind: 'year' | 'all'; year: number; since: number; newCountries: string[] },
): YearRewind {
  const end = (t: TripDetail) => t.end ?? t.steps.at(-1)?.time ?? t.start
  const km = list.reduce((n, t) => n + t.km, 0)
  const steps = list.flatMap((t) => t.steps.map((s) => ({ ...s, trip: t.name })))
  const photos = steps.flatMap((s) => s.photos)
  const countries = Array.from(new Set(list.flatMap((t) => t.countries)))

  const tripRows = list.map((t) => ({
    name: t.name,
    slug: t.slug,
    km: t.km,
    days: psDays(t.start, end(t)),
    start: t.start,
    cover: t.cover,
  }))
  const topTrip = tripRows.reduce<(typeof tripRows)[number] | null>((b, t) => (!b || t.km > b.km ? t : b), null)

  let highest: YearRewind['highest'] = null
  let hottest: YearRewind['hottest'] = null
  let coolest: YearRewind['coolest'] = null
  const towns = new Map<string, number>()
  for (const s of steps) {
    if (s.elev != null && (!highest || s.elev > highest.elev))
      highest = { elev: s.elev, place: s.place, trip: s.trip, photo: s.photos[0] ?? null }
    if (s.weather) {
      if (!hottest || s.weather.temp > hottest.temp) hottest = { temp: s.weather.temp, place: s.place }
      if (!coolest || s.weather.temp < coolest.temp) coolest = { temp: s.weather.temp, place: s.place }
    }
    const town = s.place.split(',')[0].trim()
    if (town && town !== 'Somewhere') towns.set(town, (towns.get(town) ?? 0) + 1)
  }
  const topTown = Array.from(towns).sort((a, b) => b[1] - a[1])[0]

  const dates = Array.from(new Set(list.flatMap((t) => localDays(t.start, end(t), t.timezone)))).sort()
  const monthDays: Record<string, number> = {}
  dates.forEach((d) => (monthDays[d.slice(0, 7)] = (monthDays[d.slice(0, 7)] ?? 0) + 1))
  const busiest = Object.entries(monthDays).sort((a, b) => b[1] - a[1])[0]

  return {
    key: o.key,
    kind: o.kind,
    year: o.year,
    since: o.since,
    trips: tripRows,
    km,
    earthPct: Math.round((km / EARTH_KM) * 1000) / 10,
    days: tripRows.reduce((n, t) => n + t.days, 0),
    steps: steps.length,
    photos: photos.length,
    countries,
    newCountries: o.newCountries,
    topTrip,
    highest,
    hottest,
    coolest,
    busiestMonth: busiest ? { key: busiest[0], days: busiest[1] } : null,
    topPlace: topTown ? { name: topTown[0], steps: topTown[1] } : null,
    collage: spread(photos, 9),
    routes: list.map((t) => t.steps.map((s) => [s.lat, s.lon] as [number, number])),
    travelDays: dates
      .filter((d) => d.startsWith(String(o.year)))
      .map((d) => Math.round((Date.parse(`${d}T00:00:00Z`) - Date.UTC(o.year, 0, 1)) / 86400000)),
    monthDays,
    countryPoints: Object.fromEntries(
      o.newCountries.map((c) => [
        c,
        steps.filter((s) => s.place.split(',').at(-1)?.trim() === c).map((s) => [s.lat, s.lon] as [number, number]),
      ]),
    ),
  }
}
