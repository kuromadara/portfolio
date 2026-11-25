/**
 * Read side of the travel data: the snapshot written by `npm run sync:travel`.
 *
 * Only import this from getStaticProps / getStaticPaths — Next strips those
 * (and this JSON) from the browser bundle.
 */
import rewindData from '../content/rewind.json'
import snapshot from '../content/travel.json'
import type { TravelProfile, TripDetail } from './polarsteps'
import type { RewindIndex, YearRewind } from './rewind'
import type { TravelInsights } from './travelInsights'

export interface TravelSnapshot {
  syncedAt: string
  profile: TravelProfile
  trips: TripDetail[]
  insights: TravelInsights
}

const data = snapshot as unknown as TravelSnapshot

export const getTravelProfile = (): TravelProfile => data.profile
export const getTravelInsights = (): TravelInsights => data.insights
export const getTrip = (id: number): TripDetail | null => data.trips.find((t) => t.id === id) ?? null
/** Just enough to draw the rewind buttons; the stories load on demand (see loadRewind). */
export const getRewindIndex = (): RewindIndex[] =>
  Object.values(rewindData as unknown as Record<string, YearRewind>).map(({ key, kind, year, since, trips }) => ({
    key,
    kind,
    year,
    since,
    trips: trips.length,
  }))
export const travelSyncedAt = (): string => data.syncedAt
