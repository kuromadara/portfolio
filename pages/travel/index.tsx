import type { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import CoffeeCard from '../../Components/CoffeeCard'
import Reveal from '../../Components/Reveal'
import TravelInsights from '../../Components/TravelInsights'
import type { MapRoute } from '../../Components/TravelMap'
import { fmtNumber, fmtRange } from '../../lib/format'
import { img, srcSet } from '../../lib/image'
import { POLARSTEPS_PROFILE_URL, type TravelProfile } from '../../lib/polarsteps'
import { getTravelInsights, getTravelProfile } from '../../lib/travelData'
import type { TravelInsights as Insights } from '../../lib/travelInsights'

const TravelMap = dynamic(() => import('../../Components/TravelMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-line/40" />,
})

interface Props {
  profile: TravelProfile | null
  insights: Insights | null
}

export const getStaticProps: GetStaticProps<Props> = async () => ({
  props: { profile: getTravelProfile(), insights: getTravelInsights() },
})

export default function TravelHome({ profile, insights }: Props) {
  const [active, setActive] = useState<MapRoute['id'] | null>(null)
  const routes = useMemo<MapRoute[]>(
    () =>
      (profile?.trips ?? []).map((t) => ({
        id: t.id,
        label: `${t.name} · ${fmtNumber(t.km)} km`,
        href: `/travel/${t.slug}`,
        points: t.route,
      })),
    [profile],
  )

  return (
    <>
      <Head>
        <title>Travels — Dayananda Dowarah</title>
        <meta
          name="description"
          content="Treks, waterfalls and long roads across Northeast India, the Himalaya and Nepal — logged step by step on Polarsteps."
        />
      </Head>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="topo-bg absolute inset-0" />
        <div className="container-page relative pb-12 pt-20 sm:pt-28">
          <Reveal>
            <p className="eyebrow mb-6">The alter ego · field notes</p>
            <h1 className="max-w-4xl font-display text-5xl font-medium leading-[1.04] tracking-tight sm:text-7xl">
              Same person, <em className="text-accent">different terminal.</em>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {profile?.bio ?? 'Software engineer by day.'} When I&rsquo;m not shipping code I&rsquo;m on a bus, a
              trail or a ridge somewhere in the Northeast and the Himalaya — and logging every step.
            </p>
          </Reveal>

          {profile && (
            <Reveal delay={150} className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-5">
              <Stat value={fmtNumber(profile.stats.km)} unit="km" label="travelled" />
              <Stat value={String(profile.stats.trips)} label="trips" />
              <Stat value={String(profile.stats.steps)} label="steps logged" />
              <Stat value={String(profile.stats.days)} label="days on the road" />
              <Stat
                value={String(profile.stats.countries)}
                label={`countries ${profile.stats.countryCodes.map(flag).join(' ')}`}
                className="col-span-2 sm:col-span-1"
              />
            </Reveal>
          )}
        </div>
      </section>

      {!profile ? (
        <section className="container-page">
          <p className="card p-8 text-muted">
            Trip data is temporarily unavailable.{' '}
            <a className="text-accent underline" href={POLARSTEPS_PROFILE_URL} target="_blank" rel="noreferrer">
              See my trips on Polarsteps →
            </a>
          </p>
        </section>
      ) : (
        <>
          {/* ── Map ──────────────────────────────────────── */}
          <section id="map" className="container-page">
            <Reveal className="card relative h-[420px] overflow-hidden sm:h-[540px]">
              <TravelMap routes={routes} activeId={active} onSelect={setActive} intro />
            </Reveal>
            <p className="mt-3 font-mono text-xs text-muted">
              Every dot is a step. Hover a route, click to open the trip · ⌘/ctrl + scroll to zoom.
            </p>
          </section>

          {/* ── Analytics ────────────────────────────────── */}
          {insights && (
            <section id="numbers" className="container-page pt-20">
              <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
                <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">By the numbers</h2>
                <span className="font-mono text-xs text-muted">from {profile.stats.steps} logged steps</span>
              </Reveal>
              <TravelInsights
                data={insights}
                stats={profile.stats}
                onTripHover={setActive}
              />
            </section>
          )}

          {/* ── Trips ────────────────────────────────────── */}
          <section id="trips" className="container-page pt-20">
            <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
              <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">Trips</h2>
              <a href={POLARSTEPS_PROFILE_URL} target="_blank" rel="noreferrer" className="font-mono text-xs text-muted hover:text-accent">
                follow on Polarsteps ↗
              </a>
            </Reveal>

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {profile.trips.map((t, i) => (
                <Reveal as="li" key={t.id} delay={(i % 3) * 70}>
                  <Link
                    href={`/travel/${t.slug}`}
                    onMouseEnter={() => setActive(t.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(t.id)}
                    onBlur={() => setActive(null)}
                    className="card group block h-full overflow-hidden transition-colors hover:border-accent"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-line/50">
                      {t.cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img(t.cover.src, 800)}
                          srcSet={srcSet(t.cover.src, [480, 800, 1200])}
                          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 font-mono text-[11px] text-ink backdrop-blur">
                        {fmtRange(t.start, t.end, t.timezone)}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-xl font-medium leading-snug">{t.name}</h3>
                      <p className="mt-2 font-mono text-xs text-muted">
                        {fmtNumber(t.km)} km · {t.stepCount} steps
                        {t.countries.length > 0 && <> · {t.countries.join(', ')}</>}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </section>
        </>
      )}

      <section className="container-page pt-20">
        <CoffeeCard />
      </section>
    </>
  )
}

function Stat({ value, unit, label, className = '' }: { value: string; unit?: string; label: string; className?: string }) {
  return (
    <div className={`bg-surface px-5 py-5 ${className}`}>
      <p className="font-display text-3xl font-medium tracking-tight">
        {value}
        {unit && <span className="ml-1 text-base text-muted">{unit}</span>}
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  )
}

/** "IN" → 🇮🇳 */
function flag(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
}
