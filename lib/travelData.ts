/**
 * Read side of the travel data: the snapshot written by `npm run sync:travel`.
 *
 * Only import this from getStaticProps / getStaticPaths — Next strips those
 * (and this JSON) from the browser bundle.
 */
import snapshot from '../content/travel.json'
import type { TravelProfile, TripDetail } from './polarsteps'
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
export const travelSyncedAt = (): string => data.syncedAt
