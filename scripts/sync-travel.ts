/**
 * npm run sync:travel
 *
 * 1. Fetches the public Polarsteps profile + every trip.
 * 2. Mirrors each photo (Polarsteps' public 960px version) into Sanity, once —
 *    photos already uploaded are found by their Polarsteps id and skipped.
 * 3. Computes the /travel analytics.
 * 4. Writes content/travel.json — only if something actually changed, so the
 *    scheduled GitHub Action doesn't commit (and redeploy) for nothing.
 *
 * Needs SANITY_WRITE_TOKEN (Editor) in .env.local or the environment. Without
 * it the snapshot is still written, pointing at Polarsteps' own thumbnails.
 */
import fs from 'node:fs'
import path from 'node:path'
import { loadEnvConfig } from '@next/env'
import { createClient } from '@sanity/client'
import { fetchTravelProfile, fetchTrip, mapLimit, type Photo } from '../lib/polarsteps'
import { computeTravelInsights } from '../lib/travelInsights'
import type { TravelSnapshot } from '../lib/travelData'

loadEnvConfig(process.cwd())

const OUT = path.join(process.cwd(), 'content', 'travel.json')
const SOURCE = 'polarsteps'

async function main() {
  console.log('→ Fetching Polarsteps profile…')
  const profile = await fetchTravelProfile()
  console.log(`  ${profile.trips.length} trips. Fetching trip details…`)
  const trips = await mapLimit(profile.trips, 3, (t) => fetchTrip(t.id))

  // The profile endpoint's covers lack the step-photo link that fetchTrip resolves; reuse the trip's.
  profile.trips.forEach((t) => {
    const detail = trips.find((d) => d.id === t.id)
    if (detail) t.cover = detail.cover ? { ...detail.cover } : null
  })

  // Every photo object in the data (step photos + trip covers), grouped by id.
  const photos = new Map<string, Photo[]>()
  const track = (p: Photo | null) => p && photos.set(p.id, [...(photos.get(p.id) ?? []), p])
  profile.trips.forEach((t) => track(t.cover))
  trips.forEach((t) => {
    track(t.cover)
    t.steps.forEach((s) => s.photos.forEach(track))
  })
  console.log(`  ${trips.reduce((n, t) => n + t.steps.length, 0)} steps, ${photos.size} unique photos`)

  const prev = readSnapshot()
  reusePreviousUploads(photos, prev)
  await mirrorToSanity(photos)

  const next: Omit<TravelSnapshot, 'syncedAt'> = {
    profile,
    trips: trips.sort((a, b) => b.start.localeCompare(a.start)),
    insights: computeTravelInsights(trips),
  }

  if (prev && JSON.stringify(withoutSyncedAt(prev)) === JSON.stringify(next)) {
    console.log('✓ No changes — content/travel.json left as is.')
    return
  }
  const out: TravelSnapshot = { syncedAt: new Date().toISOString(), ...next }
  fs.writeFileSync(OUT, `${JSON.stringify(out, null, 1)}\n`)
  console.log(`✓ Wrote ${path.relative(process.cwd(), OUT)} (${Math.round(fs.statSync(OUT).size / 1024)} KB)`)
}

const isMirrored = (p: Photo) => p.src.startsWith('https://cdn.sanity.io/')

/**
 * Photos already in the last snapshot keep their Sanity URL. Covers the same
 * image posted twice under two Polarsteps ids (Sanity stores the bytes once,
 * under the first id), and keeps working URLs if the token is ever missing.
 */
function reusePreviousUploads(photos: Map<string, Photo[]>, prev: TravelSnapshot | null) {
  if (!prev) return
  const known = new Map<string, Photo>()
  const add = (p: Photo | null) => p && isMirrored(p) && known.set(p.id, p)
  prev.profile.trips.forEach((t) => add(t.cover))
  prev.trips.forEach((t) => {
    add(t.cover)
    t.steps.forEach((s) => s.photos.forEach(add))
  })
  photos.forEach((list, id) => {
    const k = known.get(id)
    if (k) list.forEach((p) => Object.assign(p, { src: k.src, w: k.w, h: k.h }))
  })
}

async function mirrorToSanity(photos: Map<string, Photo[]>) {
  const pending = Array.from(photos.keys()).filter((id) => !isMirrored(photos.get(id)![0]))
  if (!pending.length) {
    console.log(`→ Sanity: all ${photos.size} photos already mirrored`)
    return
  }
  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) {
    console.warn(`! SANITY_WRITE_TOKEN not set — ${pending.length} new photos will use Polarsteps' URLs until the next sync with a token.`)
    return
  }
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qw7500aq',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'projects',
    apiVersion: '2024-08-01',
    token,
    useCdn: false,
  })

  type Asset = { id: string; url: string; w: number | null; h: number | null }
  const existing = await client.fetch<Asset[]>(
    `*[_type == "sanity.imageAsset" && source.name == $source]{
      "id": source.id, url, "w": metadata.dimensions.width, "h": metadata.dimensions.height
    }`,
    { source: SOURCE },
  )
  const byId = new Map(existing.map((a) => [a.id, a]))
  const todo = pending.filter((id) => !byId.has(id))
  console.log(`→ Sanity: ${photos.size - todo.length} photos already mirrored, ${todo.length} to upload`)

  let done = 0
  let failed = 0
  await mapLimit(todo, 4, async (id) => {
    const p = photos.get(id)![0]
    const from = p.src
    try {
      const res = await fetch(from)
      if (!res.ok) throw new Error(`download HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      const asset = await client.assets.upload('image', buf, {
        filename: `polarsteps-${id}.jpg`,
        source: { name: SOURCE, id, url: from },
      })
      const dims = asset.metadata?.dimensions
      byId.set(id, { id, url: asset.url, w: dims?.width ?? null, h: dims?.height ?? null })
    } catch (err) {
      failed++
      console.warn(`  ! ${id}: ${(err as Error).message} — keeping the Polarsteps thumbnail`)
    }
    if (++done % 25 === 0 || done === todo.length) console.log(`  ${done}/${todo.length} uploaded`)
  })
  if (failed) console.warn(`  ${failed} uploads failed; they'll be retried on the next sync.`)

  pending.forEach((id) => {
    const list = photos.get(id)!
    const a = byId.get(id)
    if (!a) return
    list.forEach((p) => {
      p.src = a.url
      p.w = a.w ?? p.w
      p.h = a.h ?? p.h
    })
  })
}

function readSnapshot(): TravelSnapshot | null {
  try {
    return JSON.parse(fs.readFileSync(OUT, 'utf8')) as TravelSnapshot
  } catch {
    return null
  }
}

function withoutSyncedAt({ syncedAt: _ignored, ...rest }: TravelSnapshot) {
  return rest
}

main().catch((err) => {
  console.error('✗ Sync failed:', err)
  process.exit(1)
})
