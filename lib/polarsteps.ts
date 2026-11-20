/**
 * Polarsteps types + API client.
 *
 * The site never calls Polarsteps at build or request time: `npm run sync:travel`
 * (scripts/sync-travel.ts) uses the fetchers below, mirrors photos to Sanity and
 * writes content/travel.json, which the pages read via lib/travelData.ts.
 *
 * - The API is undocumented (it's what polarsteps.com itself uses) and only
 *   exposes public profiles/trips.
 * - Requests are rejected unless the `Polarsteps-Api-Version` header is sent.
 */

export const POLARSTEPS_USERNAME = 'DayanandaDowarah'
export const POLARSTEPS_PROFILE_URL = `https://www.polarsteps.com/${POLARSTEPS_USERNAME}`

const API = 'https://api.polarsteps.com'
const API_VERSION = '62'

/** Short in-process cache so repeated reads in one sync don't re-hit the API. Failures aren't cached. */
const CACHE_TTL_MS = 10 * 60 * 1000
const cache = new Map<string, { at: number; data: Promise<unknown> }>()

function get<T>(path: string): Promise<T> {
  const hit = cache.get(path)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data as Promise<T>
  const data = fetchWithRetry<T>(path)
  cache.set(path, { at: Date.now(), data })
  data.catch(() => cache.delete(path))
  return data
}

async function fetchWithRetry<T>(path: string, attempt = 0): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: {
      Accept: 'application/json',
      'Polarsteps-Api-Version': API_VERSION,
      'User-Agent': 'Mozilla/5.0 (portfolio site)',
    },
  })
  if ((res.status === 429 || res.status >= 500) && attempt < 3) {
    const retryAfter = Number(res.headers.get('retry-after'))
    const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter, 10) * 1000 : 800 * 2 ** attempt
    await new Promise((r) => setTimeout(r, wait))
    return fetchWithRetry<T>(path, attempt + 1)
  }
  if (!res.ok) throw new Error(`Polarsteps ${path} → HTTP ${res.status}`)
  return res.json() as Promise<T>
}

/** Run `fn` over `items` with at most `limit` in flight (keeps us under rate limits). */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const i = next++
      out[i] = await fn(items[i])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return out
}

/* ── Raw API shapes (only the fields we read) ─────────────────────────── */

interface RawLocation {
  lat: number
  lon: number
  name?: string | null
  locality?: string | null
  country?: string | null
  country_code?: string | null
}

interface RawMedia {
  id?: number | string
  uuid: string
  type: number
  /** On a trip's cover_photo: the id of the step media it was picked from */
  media_id?: number | string | null
  large_thumbnail_path?: string | null
  small_thumbnail_path?: string | null
  full_res_width?: number | null
  full_res_height?: number | null
}

interface RawStep {
  id: number
  name?: string | null
  display_name?: string | null
  description?: string | null
  start_time: string
  timezone_id?: string | null
  weather_condition?: string | null
  weather_temperature?: number | null
  location: RawLocation
  media?: RawMedia[] | null
}

interface RawTrip {
  id: number
  name: string
  summary?: string | null
  start_date: string
  end_date?: string | null
  total_km?: number | null
  step_count?: number | null
  timezone_id?: string | null
  cover_photo?: RawMedia | null
  cover_photo_path?: string | null
  steps?: RawStep[] | null
}

interface RawUser {
  first_name: string
  last_name?: string | null
  username: string
  description?: string | null
  profile_image_path?: string | null
  living_location?: RawLocation | null
  stats: {
    km_count: number
    trip_count: number
    step_count: number
    country_count: number
    country_codes: string[]
    time_traveled_in_seconds: number
    furthest_place_from_home_km?: number
    furthest_place_from_home_location?: string
  }
  trips: RawTrip[]
}

/* ── Slim shapes passed to pages (keeps page JSON small) ──────────────── */

export interface TravelStats {
  km: number
  trips: number
  steps: number
  countries: number
  countryCodes: string[]
  days: number
  furthest: { km: number; place: string } | null
}

export interface TripSummary {
  id: number
  slug: string
  name: string
  start: string
  end: string | null
  km: number
  stepCount: number
  timezone: string
  cover: Photo | null
  countries: string[]
  /** [lat, lon] of each step in order — for the overview map. */
  route: [number, number][]
}

export interface Photo {
  /** Polarsteps media uuid — also the Sanity asset's source id */
  id: string
  /**
   * Display URL: the Sanity CDN copy after a sync, otherwise Polarsteps' public
   * 960px image. (Polarsteps' full-resolution originals aren't publicly readable.)
   */
  src: string
  w: number | null
  h: number | null
}

export interface TravelProfile {
  name: string
  bio: string | null
  avatar: string | null
  home: string | null
  stats: TravelStats
  trips: TripSummary[]
}

export interface Step {
  id: number
  title: string
  description: string | null
  time: string
  place: string
  /** IANA time zone the step was logged in */
  tz: string
  lat: number
  lon: number
  weather: { condition: string; temp: number } | null
  photos: Photo[]
}

export interface TripDetail extends Omit<TripSummary, 'route'> {
  summary: string | null
  steps: Step[]
}

const clean = (s?: string | null) => (s ?? '').trim() || null

function toPhoto(m: RawMedia): Photo | null {
  const thumb = clean(m.large_thumbnail_path)
  if (Number(m.type) !== 0 || !thumb) return null
  return {
    id: m.uuid,
    src: thumb,
    w: m.full_res_width ? Math.round(Number(m.full_res_width)) : null,
    h: m.full_res_height ? Math.round(Number(m.full_res_height)) : null,
  }
}

/**
 * `<id>-<name>`. Built from the current trip name rather than Polarsteps' own
 * `slug` field, which keeps the name a trip had when it was first created.
 */
function tripSlug(t: { id: number; name: string }) {
  const base = t.name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${t.id}-${base || 'trip'}`
}

/** Extract the numeric trip id from a `/travel/<id>-<slug>` param. */
export const tripIdFromSlug = (slug: string) => {
  const id = Number.parseInt(slug, 10)
  return Number.isFinite(id) ? id : null
}

function placeName(l: RawLocation) {
  const local = (clean(l.locality) ?? clean(l.name))?.replace(/\s+Metropolitan City$/, '') ?? null
  const country = clean(l.country)
  return [local, country].filter(Boolean).join(', ') || 'Somewhere'
}

function summarizeTrip(t: RawTrip): TripSummary {
  const steps = (t.steps ?? []).slice().sort((a, b) => a.start_time.localeCompare(b.start_time))
  const countries = Array.from(
    new Set(steps.map((s) => clean(s.location?.country)).filter((c): c is string => !!c)),
  )
  return {
    id: t.id,
    slug: tripSlug(t),
    name: t.name.trim(),
    start: t.start_date,
    end: t.end_date ?? null,
    km: Math.round(t.total_km ?? 0),
    stepCount: t.step_count ?? steps.length,
    timezone: t.timezone_id ?? 'Asia/Kolkata',
    cover: t.cover_photo ? toPhoto({ ...t.cover_photo, type: 0 }) : null,
    countries,
    route: steps
      .filter((s) => s.location && Number.isFinite(s.location.lat))
      .map((s) => [round(s.location.lat), round(s.location.lon)]),
  }
}

const round = (n: number) => Math.round(n * 1e4) / 1e4

export async function fetchTravelProfile(): Promise<TravelProfile> {
  const u = await get<RawUser>(`/users/byusername/${POLARSTEPS_USERNAME}`)
  const trips = u.trips.map(summarizeTrip).sort((a, b) => b.start.localeCompare(a.start))
  return {
    name: [u.first_name, u.last_name].filter(Boolean).join(' '),
    bio: clean(u.description),
    avatar: clean(u.profile_image_path),
    home: u.living_location ? clean(u.living_location.locality) ?? clean(u.living_location.name) : null,
    stats: {
      km: Math.round(u.stats.km_count),
      trips: u.stats.trip_count,
      steps: u.stats.step_count,
      countries: u.stats.country_count,
      countryCodes: u.stats.country_codes,
      days: Math.round(u.stats.time_traveled_in_seconds / 86400),
      furthest:
        u.stats.furthest_place_from_home_km && u.stats.furthest_place_from_home_location
          ? { km: Math.round(u.stats.furthest_place_from_home_km), place: u.stats.furthest_place_from_home_location }
          : null,
    },
    trips,
  }
}

export async function fetchTrip(id: number): Promise<TripDetail> {
  const t = await get<RawTrip>(`/trips/${id}`)
  const { route: _route, ...summary } = summarizeTrip(t)
  // A cover is a copy of one of the step photos; give it that photo's id so it
  // maps to the same Sanity asset instead of looking like a new image.
  if (summary.cover && t.cover_photo?.media_id != null) {
    const source = (t.steps ?? []).flatMap((s) => s.media ?? []).find((m) => String(m.id) === String(t.cover_photo?.media_id))
    if (source) summary.cover = { ...summary.cover, id: source.uuid }
  }
  const steps: Step[] = (t.steps ?? [])
    .slice()
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
    .map((s) => ({
      id: s.id,
      title: clean(s.display_name) ?? clean(s.name) ?? placeName(s.location),
      description: clean(s.description),
      time: s.start_time,
      place: placeName(s.location),
      tz: s.timezone_id ?? t.timezone_id ?? 'Asia/Kolkata',
      lat: round(s.location.lat),
      lon: round(s.location.lon),
      weather:
        s.weather_condition && s.weather_temperature != null
          ? { condition: s.weather_condition, temp: Math.round(s.weather_temperature) }
          : null,
      photos: (s.media ?? []).map(toPhoto).filter((p): p is Photo => p !== null),
    }))
  return { ...summary, summary: clean(t.summary), steps }
}
