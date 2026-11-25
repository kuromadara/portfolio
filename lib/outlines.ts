/**
 * Country outlines behind the rewind's route "signature" (sync-only).
 *
 * Downloads Natural Earth's 1:50m admin-0 countries once per sync, then for
 * each rewind keeps just the borders around its routes: clipped to a box a
 * bit larger than what the slide can show, simplified, rounded. A few KB per
 * rewind instead of 3 MB, and the page needs no map at runtime.
 */
import type { YearRewind } from './rewind'

const SOURCE = 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_50m_admin_0_countries.geojson'

export interface Outline {
  name: string
  /** Rings clipped to the area around the routes, each "lat,lon lat,lon …" (compact in the JSON). */
  rings: string[]
  /** Label anchor [lat, lon] (Natural Earth's), if it falls in view. */
  label: [number, number] | null
}

type Ring = [number, number][] // [lon, lat]
interface Feature {
  properties: {
    NAME_EN?: string
    NAME?: string
    LABEL_X?: number
    LABEL_Y?: number
  }
  geometry: { type: 'Polygon'; coordinates: Ring[] } | { type: 'MultiPolygon'; coordinates: Ring[][] }
}

export async function loadCountries(): Promise<Feature[]> {
  const res = await fetch(SOURCE)
  if (!res.ok) throw new Error(`Natural Earth HTTP ${res.status}`)
  return ((await res.json()) as { features: Feature[] }).features
}

/** Outlines for the area around a rewind's routes. */
export function outlinesFor(r: YearRewind, countries: Feature[]): Outline[] {
  const pts = r.routes.flat()
  if (!pts.length) return []
  const lats = pts.map((p) => p[0])
  const lons = pts.map((p) => p[1])
  const span = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lons) - Math.min(...lons), 1)
  // generous margin: the slide letterboxes the routes into a portrait area
  const m = span * 0.45
  const box = {
    w: Math.min(...lons) - m,
    e: Math.max(...lons) + m,
    s: Math.min(...lats) - m,
    n: Math.max(...lats) + m,
  }
  const tol = span / 140

  const out: Outline[] = []
  for (const f of countries) {
    if (SKIP.has(f.properties.NAME_EN ?? '')) continue
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
    const rings: string[] = []
    let biggest: Ring = []
    let biggestArea = 0
    for (const poly of polys) {
      const ring = clip(poly[0], box) // outer ring only — holes don't matter at this scale
      if (ring.length < 3) continue
      const simple = simplify(ring, tol)
      if (simple.length < 3) continue
      rings.push(simple.map(([lon, lat]) => `${round(lat)},${round(lon)}`).join(' '))
      const a = Math.abs(area(simple))
      if (a > biggestArea) [biggest, biggestArea] = [simple, a]
    }
    if (!rings.length) continue
    // Natural Earth's label point when it's in view, else the middle of the visible part
    // (skipped for slivers along the edge of the box)
    const lx = f.properties.LABEL_X
    const ly = f.properties.LABEL_Y
    const inBox = (x: number, y: number) => x > box.w && x < box.e && y > box.s && y < box.n
    const c = centroid(biggest)
    const label: Outline['label'] =
      lx != null && ly != null && inBox(lx, ly)
        ? [round(ly), round(lx)]
        : biggestArea > (span * span) / 40 && c
          ? [round(c[1]), round(c[0])]
          : null
    out.push({
      name: f.properties.NAME_EN ?? f.properties.NAME ?? '',
      rings,
      label,
    })
  }
  return out
}

/** Tiny disputed-area shapes that only add noise at this scale. */
const SKIP = new Set(['Siachen Glacier'])

/** Parse a stored ring back into [lat, lon] pairs. */
export const parseRing = (ring: string) => ring.split(' ').map((p) => p.split(',').map(Number) as [number, number])

const round = (n: number) => Math.round(n * 100) / 100

/** Sutherland–Hodgman: clip a polygon ring to an axis-aligned box. */
function clip(ring: Ring, b: { w: number; e: number; s: number; n: number }): Ring {
  type Edge = {
    inside: (p: [number, number]) => boolean
    cut: (a: [number, number], c: [number, number]) => [number, number]
  }
  const atX =
    (x: number) =>
    (a: [number, number], c: [number, number]): [number, number] => [x, a[1] + ((c[1] - a[1]) * (x - a[0])) / (c[0] - a[0])]
  const atY =
    (y: number) =>
    (a: [number, number], c: [number, number]): [number, number] => [a[0] + ((c[0] - a[0]) * (y - a[1])) / (c[1] - a[1]), y]
  const edges: Edge[] = [
    { inside: (p) => p[0] >= b.w, cut: atX(b.w) },
    { inside: (p) => p[0] <= b.e, cut: atX(b.e) },
    { inside: (p) => p[1] >= b.s, cut: atY(b.s) },
    { inside: (p) => p[1] <= b.n, cut: atY(b.n) },
  ]
  let out = ring.slice()
  for (const e of edges) {
    if (!out.length) break
    const input = out
    out = []
    for (let i = 0; i < input.length; i++) {
      const cur = input[i]
      const prev = input[(i + input.length - 1) % input.length]
      if (e.inside(cur)) {
        if (!e.inside(prev)) out.push(e.cut(prev, cur))
        out.push(cur)
      } else if (e.inside(prev)) out.push(e.cut(prev, cur))
    }
  }
  return out
}

/** Signed polygon area (shoelace), in degrees². */
function area(r: Ring) {
  let a = 0
  for (let i = 0; i < r.length; i++) {
    const [x1, y1] = r[i]
    const [x2, y2] = r[(i + 1) % r.length]
    a += x1 * y2 - x2 * y1
  }
  return a / 2
}

/** Polygon centroid [lon, lat]. */
function centroid(r: Ring): [number, number] | null {
  const a = area(r)
  if (!a) return null
  let cx = 0
  let cy = 0
  for (let i = 0; i < r.length; i++) {
    const [x1, y1] = r[i]
    const [x2, y2] = r[(i + 1) % r.length]
    const f = x1 * y2 - x2 * y1
    cx += (x1 + x2) * f
    cy += (y1 + y2) * f
  }
  return [cx / (6 * a), cy / (6 * a)]
}

/** Drop points closer than `tol` to the last kept one (cheap, fine at slide size). */
function simplify(ring: Ring, tol: number): Ring {
  const out: Ring = [ring[0]]
  for (const p of ring.slice(1)) {
    const q = out[out.length - 1]
    if (Math.abs(p[0] - q[0]) > tol || Math.abs(p[1] - q[1]) > tol) out.push(p)
  }
  return out
}
