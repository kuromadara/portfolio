import type { GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import CoffeeCard from '../../Components/CoffeeCard'
import ElevationProfile from '../../Components/ElevationProfile'
import Lightbox, { type GalleryItem } from '../../Components/Lightbox'
import Reveal from '../../Components/Reveal'
import type { MapRoute } from '../../Components/TravelMap'
import { fmtDate, fmtNumber, fmtRange, fmtWeather, tripDays } from '../../lib/format'
import { img, srcSet } from '../../lib/image'
import { POLARSTEPS_PROFILE_URL, tripIdFromSlug, type TripDetail } from '../../lib/polarsteps'
import { getTravelProfile, getTrip } from '../../lib/travelData'

const TravelMap = dynamic(() => import('../../Components/TravelMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-line/40" />,
})

interface Props {
  trip: TripDetail
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getTravelProfile().trips.map((t) => ({ params: { trip: t.slug } })),
    // lets an old slug (trip renamed since) reach getStaticProps and redirect
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props, { trip: string }> = async ({ params }) => {
  const slug = params?.trip ?? ''
  const id = tripIdFromSlug(slug)
  if (id == null) return { notFound: true }

  const trip = getTrip(id)
  if (!trip) return { notFound: true }

  // keep URLs canonical if the trip gets renamed
  if (trip.slug !== slug) {
    return { redirect: { destination: `/travel/${trip.slug}`, permanent: false } }
  }
  return { props: { trip } }
}

export default function TripPage({ trip }: Props) {
  const routes = useMemo<MapRoute[]>(
    () => [{ id: trip.id, label: trip.name, points: trip.steps.map((s) => [s.lat, s.lon] as [number, number]) }],
    [trip],
  )
  const days = tripDays(trip.start, trip.end)
  const photoCount = trip.steps.reduce((n, s) => n + s.photos.length, 0)

  // one gallery for the whole trip; each step's grid opens it at its own offset
  const { gallery, offsets } = useMemo(() => {
    const gallery: GalleryItem[] = []
    const offsets: number[] = []
    trip.steps.forEach((s, i) => {
      offsets.push(gallery.length)
      s.photos.forEach((p) => gallery.push({ ...p, caption: `${i + 1}. ${s.title} · ${s.place}` }))
    })
    return { gallery, offsets }
  }, [trip])
  const [viewing, setViewing] = useState<number | null>(null)
  const maxElev = Math.max(-Infinity, ...trip.steps.map((s) => s.elev ?? -Infinity))
  // "trip in photos": the first photo of each step that has one
  const strip = trip.steps.flatMap((s, i) => (s.photos[0] ? [{ photo: s.photos[0], at: offsets[i], n: i + 1, title: s.title }] : []))

  return (
    <>
      <Head>
        <title>{`${trip.name} — Travels — Dayananda Dowarah`}</title>
        <meta
          name="description"
          content={`${trip.name}: ${fmtNumber(trip.km)} km and ${trip.steps.length} steps, ${fmtRange(trip.start, trip.end, trip.timezone)}.`}
        />
        {trip.cover && <meta property="og:image" content={img(trip.cover.src, 1200)} />}
      </Head>

      {/* ── Header ───────────────────────────────────────── */}
      <section className="relative">
        {trip.cover && (
          <div className="absolute inset-0 -z-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img(trip.cover.src, 1600)}
              srcSet={srcSet(trip.cover.src, [800, 1600, 2400])}
              sizes="100vw"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/30" />
          </div>
        )}
        <div className="container-page relative pb-12 pt-16 sm:pt-28">
          <Link href="/travel#trips" className="font-mono text-xs text-muted hover:text-accent">
            ← all trips
          </Link>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
            {trip.name}
          </h1>
          <p className="mt-4 font-mono text-sm text-muted">
            {fmtRange(trip.start, trip.end, trip.timezone)}
            {trip.countries.length > 0 && <> · {trip.countries.join(', ')}</>}
          </p>
          {trip.summary && <p className="mt-4 max-w-2xl text-lg text-muted">{trip.summary}</p>}

          <dl className="mt-10 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-5">
            <Fact k="distance" v={`${fmtNumber(trip.km)} km`} />
            <Fact k="steps" v={String(trip.steps.length)} />
            {days && <Fact k="days" v={String(days)} />}
            <Fact k="photos" v={String(photoCount)} />
            {Number.isFinite(maxElev) && <Fact k="max altitude" v={`${fmtNumber(maxElev)} m`} />}
          </dl>
        </div>
      </section>

      {/* ── Trip in photos + elevation ───────────────────── */}
      {strip.length >= 4 && (
        <section aria-label="Trip in photos" className="container-page mb-10">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-lg font-medium">Trip in photos</h2>
            <button type="button" onClick={() => setViewing(0)} className="font-mono text-[11px] text-muted hover:text-accent">
              view all {photoCount} →
            </button>
          </div>
          <ul className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:mx-0 sm:px-0">
            {strip.map(({ photo, at, n, title }) => (
              <li key={photo.id} className="snap-start">
                <button
                  type="button"
                  onClick={() => setViewing(at)}
                  aria-label={`Step ${n}: ${title}. Open photos`}
                  className="group relative block h-40 w-32 cursor-zoom-in overflow-hidden rounded-[var(--radius)] bg-line/50 sm:h-48 sm:w-36"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img(photo.src, 300)}
                    srcSet={srcSet(photo.src, [300, 450])}
                    sizes="150px"
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-6 text-left font-mono text-[10px] leading-tight text-white">
                    {n}. {title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="container-page mb-12">
        <ElevationProfile steps={trip.steps} />
      </div>

      {/* ── Map + steps ──────────────────────────────────── */}
      <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="lg:order-2">
          <div className="card h-[360px] overflow-hidden lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <TravelMap routes={routes} numbered />
          </div>
        </div>

        <ol className="relative space-y-12 border-l border-line pl-8 lg:order-1">
          {trip.steps.map((s, i) => (
            <Reveal as="li" key={s.id} className="relative scroll-mt-24">
              <span
                id={`step-${i + 1}`}
                className="absolute -left-[45px] top-0 grid h-[26px] w-[26px] place-items-center rounded-full border-2 border-bg bg-accent font-mono text-[10px] font-semibold text-accent-ink"
              >
                {i + 1}
              </span>
              <p className="font-mono text-xs text-muted">
                {fmtDate(s.time, trip.timezone, { weekday: 'short' })} · {s.place}
                {s.weather && (
                  <>
                    {' '}
                    · {fmtWeather(s.weather.condition)}, {s.weather.temp}°C
                  </>
                )}
              </p>
              <h2 className="mt-2 font-display text-2xl font-medium leading-snug">{s.title}</h2>
              {s.description && (
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink/85">{s.description}</p>
              )}
              {s.photos.length > 0 && <Photos photos={s.photos} onOpen={(j) => setViewing(offsets[i] + j)} />}
            </Reveal>
          ))}
        </ol>
      </div>

      <div className="container-page mt-20">
        <CoffeeCard compact />
      </div>

      <div className="container-page mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <Link href="/travel#trips" className="btn-ghost">
          ← All trips
        </Link>
        <a href={POLARSTEPS_PROFILE_URL} target="_blank" rel="noreferrer" className="font-mono text-xs text-muted hover:text-accent">
          view on Polarsteps ↗
        </a>
      </div>

      <Lightbox items={gallery} index={viewing} onIndex={setViewing} onClose={() => setViewing(null)} />
    </>
  )
}

function Photos({ photos, onOpen }: { photos: TripDetail['steps'][number]['photos']; onOpen: (i: number) => void }) {
  const shown = photos.slice(0, 6)
  const extra = photos.length - shown.length
  return (
    <ul className={`mt-4 grid gap-2 ${shown.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
      {shown.map((p, i) => (
        <li key={p.id} className={`relative overflow-hidden rounded-[var(--radius)] bg-line/50 ${shown.length === 1 ? 'aspect-[16/10]' : 'aspect-square'}`}>
          <button
            type="button"
            onClick={() => onOpen(i)}
            aria-label={extra > 0 && i === shown.length - 1 ? `View photo ${i + 1} and ${extra} more` : `View photo ${i + 1}`}
            className="group block h-full w-full cursor-zoom-in"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img(p.src, 600)}
              srcSet={srcSet(p.src, [400, 600, 900, 1200])}
              sizes={shown.length === 1 ? '(min-width: 1024px) 640px, 100vw' : '(min-width: 1024px) 220px, 50vw'}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
          {extra > 0 && i === shown.length - 1 && (
            <span className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/50 font-display text-xl text-bg">
              +{extra}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-surface/95 px-4 py-3">
      <dt className="eyebrow">{k}</dt>
      <dd className="mt-1 font-display text-xl font-medium">{v}</dd>
    </div>
  )
}
