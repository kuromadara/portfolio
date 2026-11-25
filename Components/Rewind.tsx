import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fmtNumber } from '../lib/format'
import { img } from '../lib/image'
import type { Photo } from '../lib/polarsteps'
import type { YearRewind } from '../lib/rewind'
import { COFFEE_URL } from './CoffeeCard'

const SLIDE_MS = 6000
/** currentColor at a given opacity (Tailwind's /opacity doesn't apply to `current`). */
const fade = (pct: number) => `color-mix(in srgb, currentColor ${pct}%, transparent)`

/**
 * Story-style "year rewind" (think Spotify Wrapped). Full-screen <dialog>:
 * tap right / → to advance, tap left / ← to go back, hold to pause, Esc to close.
 */
export default function Rewind({
  data,
  firstYear,
  open,
  onClose,
}: {
  data: YearRewind
  /** The earliest year on record — its countries aren't "new". */
  firstYear: boolean
  open: boolean
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const slides = useMemo(() => buildSlides(data, firstYear, onClose), [data, firstYear, onClose])
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const last = slides.length - 1

  useEffect(() => setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches), [])

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (open && !dlg.open) {
      setI(0)
      dlg.showModal()
      document.documentElement.style.overflow = 'hidden'
    }
    if (!open && dlg.open) dlg.close()
  }, [open])

  // release the page scroll lock however we unmount
  useEffect(
    () => () => {
      document.documentElement.style.overflow = ''
    },
    [],
  )

  const go = useCallback((d: number) => setI((n) => Math.min(last, Math.max(0, n + d))), [last])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        go(1)
      }
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, go])

  // preload the next slide's images
  useEffect(() => {
    slides[i + 1]?.images?.forEach((src) => (new Image().src = src))
  }, [i, slides])

  const slide = slides[i]
  const holdTimer = useRef<number | null>(null)
  const held = useRef(false)
  const tap = (d: number) => {
    if (held.current) {
      held.current = false // that was a hold-to-pause, not a tap
      return
    }
    go(d)
  }

  return (
    <dialog
      ref={ref}
      onClose={() => {
        document.documentElement.style.overflow = ''
        onClose()
      }}
      aria-label={`${title(data)} travel rewind`}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="flex h-full w-full items-center justify-center sm:p-6" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <div
            className={`relative flex h-full w-full flex-col overflow-hidden sm:aspect-[9/16] sm:h-[min(92dvh,860px)] sm:w-auto sm:rounded-2xl ${slide.tone}`}
            onPointerDown={() => {
              held.current = false
              holdTimer.current = window.setTimeout(() => {
                held.current = true
                setPaused(true)
              }, 220)
            }}
            onPointerUp={() => {
              if (holdTimer.current) clearTimeout(holdTimer.current)
              setTimeout(() => setPaused(false), 0)
            }}
            onPointerLeave={() => setPaused(false)}
          >
            {slide.bg}

            {/* progress */}
            <div className="relative z-20 flex gap-1 px-3 pt-3" aria-hidden>
              {slides.map((_, k) => (
                <div key={k} className="h-[3px] flex-1 overflow-hidden rounded-full" style={{ background: fade(28) }}>
                  {k < i && <div className="h-full w-full bg-current" />}
                  {k === i && (
                    <div
                      key={`${i}-${open}`}
                      className="h-full bg-current"
                      style={{
                        width: reduced || i === last ? '100%' : undefined,
                        animation: reduced || i === last ? undefined : `rewind-progress ${SLIDE_MS}ms linear forwards`,
                        animationPlayState: paused ? 'paused' : 'running',
                      }}
                      onAnimationEnd={() => go(1)}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="relative z-20 flex items-center justify-between px-4 pt-3 font-mono text-[11px] uppercase tracking-widest opacity-80">
              <span>{title(data)} · rewind</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close rewind"
                className="grid h-8 w-8 place-items-center rounded-full text-lg normal-case"
                style={{ background: fade(14) }}
              >
                ×
              </button>
            </div>

            {/* tap zones: left third back, rest forward (below content buttons) */}
            <button type="button" aria-label="Previous" className="absolute inset-y-0 left-0 z-10 w-1/3 cursor-w-resize" onClick={() => tap(-1)} />
            <button type="button" aria-label="Next" className="absolute inset-y-0 right-0 z-10 w-2/3 cursor-e-resize" onClick={() => tap(1)} />

            <div key={i} className="rewind-in pointer-events-none relative z-10 flex flex-1 flex-col justify-end px-6 pb-10 sm:px-8">
              {slide.body(!reduced)}
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}

/* ── slides ───────────────────────────────────────────────────────────── */

interface Slide {
  tone: string
  bg?: React.ReactNode
  images?: string[]
  body: (animate: boolean) => React.ReactNode
}

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-xs uppercase tracking-[0.2em] opacity-75">{children}</p>
)
const Big = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-3 font-display text-6xl font-medium leading-[0.95] tracking-tight sm:text-7xl">{children}</p>
)
const Line = ({ children }: { children: React.ReactNode }) => <p className="mt-4 max-w-sm text-lg leading-snug opacity-90">{children}</p>

function PhotoBg({ photo, dim = 'from-black/85 via-black/40 to-black/20' }: { photo: Photo | null; dim?: string }) {
  if (!photo) return null
  return (
    <div className="absolute inset-0" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img(photo.src, 900)} alt="" className="rewind-zoom h-full w-full object-cover" />
      <div className={`absolute inset-0 bg-gradient-to-t ${dim}`} />
    </div>
  )
}

function buildSlides(d: YearRewind, firstYear: boolean, onClose: () => void): Slide[] {
  const month = (key: string) =>
    new Intl.DateTimeFormat('en', { month: 'long', timeZone: 'UTC' }).format(new Date(`${key}-01T00:00:00Z`))
  const all = d.kind === 'all'
  const tripMonth = (iso: string) =>
    new Intl.DateTimeFormat('en', { month: 'short', ...(all && { year: '2-digit' }), timeZone: 'Asia/Kolkata' }).format(new Date(iso))
  const monthName = (key: string) => (all ? `${month(key)} ${key.slice(0, 4)}` : month(key))
  // long lists (the all-time rewind): newest few + a count
  const listed = d.trips.length > 7 ? d.trips.slice(-6) : d.trips
  const earlier = d.trips.length - listed.length
  const slides: Slide[] = []
  const lastCover = d.trips.at(-1)?.cover ?? null

  slides.push({
    tone: 'bg-ink text-bg',
    images: d.collage.map((p) => img(p.src, 300)),
    bg: (
      <div aria-hidden className="absolute inset-0">
        <div className="grid h-full grid-cols-3 gap-0.5 opacity-30 grayscale">
          {d.collage.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p.id} src={img(p.src, 300)} alt="" className="rewind-zoom h-full w-full object-cover" />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/30" />
      </div>
    ),
    body: () => (
      <>
        <Kicker>Dayananda · on the road</Kicker>
        {all ? (
          <>
            <p className="mt-4 font-display text-[5.5rem] font-medium leading-[0.85] tracking-tighter sm:text-[6.5rem]">So far.</p>
            <p className="mt-2 font-display text-4xl italic text-accent">
              {d.since} → today
            </p>
            <Line>Every step since my first trip — {fmtNumber(d.trips.length)} trips and counting. Tap to start →</Line>
          </>
        ) : (
          <>
            <p className="mt-4 font-display text-[7rem] font-medium leading-[0.85] tracking-tighter sm:text-[8.5rem]">{d.year}</p>
            <p className="font-display text-4xl italic text-accent">rewound.</p>
            <Line>A year of steps, summits and bus rides — in {fmtNumber(d.trips.length)} trips. Tap to start →</Line>
          </>
        )}
      </>
    ),
  })

  slides.push({
    tone: 'bg-accent text-accent-ink',
    body: () => (
      <>
        <Kicker>{all ? `Since ${d.since} I've hit the road` : 'This year I hit the road'}</Kicker>
        <Big>{d.trips.length} times</Big>
        <ul className="mt-6 space-y-2 font-mono text-sm">
          {earlier > 0 && (
            <li className="pb-1 opacity-75">
              + {earlier} earlier trip{earlier > 1 ? 's' : ''}
            </li>
          )}
          {listed.map((t) => (
            <li key={t.slug} className="flex items-center justify-between gap-3 border-b pb-1.5" style={{ borderColor: fade(25) }}>
              {t.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img(t.cover.src, 96)} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover" />
              ) : (
                <span className="h-9 w-9 shrink-0 rounded-md" style={{ background: fade(20) }} />
              )}
              <span className="min-w-0 flex-1 truncate">{t.name}</span>
              <span className="shrink-0 opacity-75">{tripMonth(t.start)}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  })

  slides.push({
    tone: 'bg-surface text-ink',
    bg: (
      <>
        <div aria-hidden className="topo-bg absolute inset-0" />
        <Art>
          <Signature routes={d.routes} />
        </Art>
      </>
    ),
    body: (animate) => (
      <>
        <Kicker>Distance covered</Kicker>
        <Big>
          <CountUp to={d.km} animate={animate} />
          <span className="ml-2 text-3xl text-muted">km</span>
        </Big>
        <Line>
          That&rsquo;s <strong className="text-accent">{d.earthPct}%</strong> of the way around the Earth. Above: every route I
          took, drawn to scale.
        </Line>
      </>
    ),
  })

  slides.push({
    tone: 'bg-ink text-bg',
    bg: (
      <Art>
        {all ? <MonthBlocks since={d.since} until={d.year} monthDays={d.monthDays} /> : <DayDots year={d.year} days={d.travelDays} />}
      </Art>
    ),
    body: (animate) => (
      <>
        <Kicker>Days on the road</Kicker>
        <Big>
          <CountUp to={d.days} animate={animate} />
          <span className="ml-2 text-3xl opacity-60">days</span>
        </Big>
        {d.busiestMonth && (
          <Line>
            Busiest month: <strong className="text-accent">{monthName(d.busiestMonth.key)}</strong>, with {d.busiestMonth.days} days away.
          </Line>
        )}
      </>
    ),
  })

  if (d.collage.length) {
    slides.push({
      tone: 'bg-black text-white',
      images: d.collage.map((p) => img(p.src, 400)),
      bg: (
        <div className="absolute inset-0 grid grid-cols-3 gap-0.5" aria-hidden>
          {d.collage.map((p, k) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.id}
              src={img(p.src, 400)}
              alt=""
              className="rewind-pop h-full w-full object-cover"
              style={{ animationDelay: `${k * 90}ms` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
      ),
      body: (animate) => (
        <>
          <Kicker>Captured</Kicker>
          <Big>
            <CountUp to={d.photos} animate={animate} /> photos
          </Big>
          <Line>across {fmtNumber(d.steps)} logged steps.</Line>
        </>
      ),
    })
  }

  if (d.highest) {
    const h = d.highest
    slides.push({
      tone: 'bg-ink text-white',
      images: h.photo ? [img(h.photo.src, 900)] : [],
      bg: <PhotoBg photo={h.photo} />,
      body: (animate) => (
        <>
          <Kicker>Highest point</Kicker>
          <Big>
            <CountUp to={h.elev} animate={animate} />
            <span className="ml-2 text-3xl opacity-70">m</span>
          </Big>
          <Line>
            {h.place.split(',')[0]} — on {h.trip}.
          </Line>
        </>
      ),
    })
  }

  if (d.topPlace || d.hottest || d.coolest) {
    slides.push({
      tone: 'bg-accent-2 text-white',
      bg: (
        <div aria-hidden className="absolute -right-16 top-12 h-72 w-72 rotate-12 opacity-[0.14] [&_svg]:h-full [&_svg]:w-full">
          <Icon name="sun" />
        </div>
      ),
      body: () => (
        <>
          <Kicker>Odds &amp; ends</Kicker>
          <dl className="mt-6 space-y-5">
            {d.topPlace && (
              <div>
                <dt className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest opacity-75">
                  <Icon name="pin" /> Most-logged place
                </dt>
                <dd className="font-display text-3xl font-medium">
                  {d.topPlace.name} <span className="text-lg opacity-75">· {d.topPlace.steps} steps</span>
                </dd>
              </div>
            )}
            {d.hottest && (
              <div>
                <dt className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest opacity-75">
                  <Icon name="sun" /> Hottest
                </dt>
                <dd className="font-display text-3xl font-medium">
                  {d.hottest.temp}°C <span className="text-lg opacity-75">· {d.hottest.place.split(',')[0]}</span>
                </dd>
              </div>
            )}
            {d.coolest && d.coolest.temp !== d.hottest?.temp && (
              <div>
                <dt className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest opacity-75">
                  <Icon name="snow" /> Coolest
                </dt>
                <dd className="font-display text-3xl font-medium">
                  {d.coolest.temp}°C <span className="text-lg opacity-75">· {d.coolest.place.split(',')[0]}</span>
                </dd>
              </div>
            )}
          </dl>
        </>
      ),
    })
  }

  if ((all || !firstYear) && d.newCountries.length) {
    slides.push({
      tone: 'bg-surface text-ink',
      bg: (
        <>
          <div aria-hidden className="topo-bg absolute inset-0" />
          <Art>
            <Signature routes={d.newCountries.map((c) => d.countryPoints?.[c] ?? [])} dots />
          </Art>
        </>
      ),
      body: () => (
        <>
          <Kicker>{all ? 'Flags collected' : `New flag${d.newCountries.length > 1 ? 's' : ''} collected`}</Kicker>
          <p className="mt-4 text-7xl">{d.newCountries.map(flagFor).join(' ')}</p>
          <Big>{d.newCountries.join(' · ')}</Big>
          <Line>
            {all ? 'Every step I’ve ever logged, joined up.' : 'First time on the map — every step I logged there, joined up.'}
          </Line>
        </>
      ),
    })
  }

  if (d.topTrip) {
    const t = d.topTrip
    slides.push({
      tone: 'bg-ink text-white',
      images: t.cover ? [img(t.cover.src, 900)] : [],
      bg: <PhotoBg photo={t.cover} />,
      body: () => (
        <>
          <Kicker>{all ? 'Biggest trip so far' : 'Trip of the year'}</Kicker>
          <Big>{t.name}</Big>
          <Line>
            {fmtNumber(t.km)} km over {t.days} days.
          </Line>
          <Link
            href={`/travel/${t.slug}`}
            onClick={onClose}
            className="pointer-events-auto relative z-30 mt-6 inline-flex w-max items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
          >
            Open the trip →
          </Link>
        </>
      ),
    })
  }

  slides.push({
    tone: 'bg-accent text-accent-ink',
    bg: (
      <div aria-hidden className="absolute inset-0">
        {lastCover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img(lastCover.src, 900)} alt="" className="rewind-zoom h-full w-full object-cover opacity-35 mix-blend-luminosity" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-accent via-accent/70 to-transparent" />
      </div>
    ),
    body: () => (
      <>
        <Kicker>{all ? 'The story so far' : `That was ${d.year}`}</Kicker>
        <Big>{all ? 'More trails ahead.' : `See you on the trail in ${d.year + 1}.`}</Big>
        <div className="pointer-events-auto relative z-30 mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-accent-ink px-4 py-2 text-sm font-medium text-accent"
          >
            Explore the trips
          </button>
          <a
            href={COFFEE_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border px-4 py-2 text-sm font-medium"
            style={{ borderColor: fade(45) }}
          >
            ☕ Buy me a coffee
          </a>
        </div>
      </>
    ),
  })

  return slides
}

/** "2026", or "2025–26" for the all-time rewind. */
export const title = (d: YearRewind) =>
  d.kind === 'all' ? (d.since === d.year ? 'So far' : `${d.since}–${String(d.year).slice(2)}`) : String(d.year)

/* ── artwork ──────────────────────────────────────────────────────────── */

/** Upper part of the card, above the text. */
const Art = ({ children }: { children: React.ReactNode }) => (
  <div aria-hidden className="absolute inset-x-6 bottom-[44%] top-20 flex items-center justify-center sm:inset-x-8">
    {children}
  </div>
)

/**
 * Routes drawn to scale with no map underneath (equirectangular, x scaled by
 * cos(latitude)), each line drawing itself in. `dots` also marks every point.
 */
function Signature({ routes, dots = false }: { routes: [number, number][][]; dots?: boolean }) {
  const pts = routes.flat()
  if (!pts.length) return null
  const k = Math.cos((pts.reduce((n, [lat]) => n + lat, 0) / pts.length) * (Math.PI / 180))
  const xy = (lat: number, lon: number) => [lon * k, -lat] as const
  const xs = pts.map(([la, lo]) => xy(la, lo)[0])
  const ys = pts.map(([la, lo]) => xy(la, lo)[1])
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  const span = Math.max(x1 - x0, y1 - y0, 0.05)
  const pad = span * 0.08
  const vb = `${x0 - pad} ${y0 - pad} ${x1 - x0 + pad * 2} ${y1 - y0 + pad * 2}`
  const r = span * 0.008

  return (
    <svg viewBox={vb} className="h-full w-full overflow-visible text-accent" preserveAspectRatio="xMidYMid meet">
      {routes.map((route, i) =>
        route.length > 1 ? (
          <path
            key={i}
            d={route.map(([la, lo], j) => `${j ? 'L' : 'M'}${xy(la, lo).join(',')}`).join(' ')}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            // width in map units (not non-scaling-stroke, which breaks pathLength-based drawing)
            strokeWidth={span * (dots ? 0.004 : 0.009)}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="rewind-draw"
            style={{ animationDelay: `${i * 250}ms`, opacity: dots ? 0.5 : 1 }}
          />
        ) : null,
      )}
      {(dots ? pts : routes.flatMap((rt) => (rt.length ? [rt[0], rt[rt.length - 1]] : []))).map(([la, lo], i) => {
        const [x, y] = xy(la, lo)
        return <circle key={i} cx={x} cy={y} r={dots ? r : r * 1.4} fill="currentColor" className="rewind-pop" style={{ animationDelay: `${300 + i * 12}ms`, transformBox: 'fill-box', transformOrigin: 'center' }} />
      })}
    </svg>
  )
}

/** The whole year as dots, one row per month; travel days lit in the accent. */
function DayDots({ year, days }: { year: number; days: number[] }) {
  const lit = new Set(days)
  let doy = 0
  let order = 0
  return (
    <div className="w-full max-w-md space-y-[3px]">
      {Array.from({ length: 12 }, (_, m) => {
        const len = new Date(Date.UTC(year, m + 1, 0)).getUTCDate()
        const row = (
          <div key={m} className="grid items-center gap-[3px]" style={{ gridTemplateColumns: '1.1rem repeat(31, minmax(0, 1fr))' }}>
            <span className="font-mono text-[9px] opacity-50">{'JFMAMJJASOND'[m]}</span>
            {Array.from({ length: len }, (_, k) => {
              const on = lit.has(doy + k)
              return (
                <span
                  key={k}
                  className={`aspect-square rounded-full ${on ? 'rewind-pop bg-accent' : ''}`}
                  style={on ? { animationDelay: `${200 + order++ * 25}ms` } : { background: fade(14) }}
                />
              )
            })}
          </div>
        )
        doy += len
        return row
      })}
    </div>
  )
}

/** All-time days: one row per year, one block per month, shaded by days away. */
function MonthBlocks({ since, until, monthDays }: { since: number; until: number; monthDays: Record<string, number> }) {
  const shade = (n: number) => (n >= 15 ? 1 : n >= 8 ? 0.7 : n >= 4 ? 0.45 : n > 0 ? 0.25 : 0)
  let order = 0
  return (
    <div className="w-full max-w-md space-y-2">
      <div className="grid gap-1.5 font-mono text-[9px] opacity-50" style={{ gridTemplateColumns: '2.4rem repeat(12, minmax(0, 1fr))' }}>
        <span />
        {'JFMAMJJASOND'.split('').map((m, i) => (
          <span key={i} className="text-center">
            {m}
          </span>
        ))}
      </div>
      {Array.from({ length: until - since + 1 }, (_, k) => since + k).map((y) => (
        <div key={y} className="grid items-center gap-1.5" style={{ gridTemplateColumns: '2.4rem repeat(12, minmax(0, 1fr))' }}>
          <span className="font-mono text-[10px] opacity-60">{y}</span>
          {Array.from({ length: 12 }, (_, m) => {
            const n = monthDays[`${y}-${String(m + 1).padStart(2, '0')}`] ?? 0
            return (
              <span key={m} className="relative aspect-square rounded-[3px]" style={{ background: fade(14) }}>
                {n > 0 && (
                  // shade on the wrapper: the pop-in animation drives the inner element's opacity
                  <span className="absolute inset-0" style={{ opacity: shade(n) }}>
                    <span className="rewind-pop absolute inset-0 rounded-[3px] bg-accent" style={{ animationDelay: `${200 + order++ * 60}ms` }} />
                  </span>
                )}
              </span>
            )
          })}
        </div>
      ))}
      <p className="pt-1 font-mono text-[9px] opacity-50">darker = more days away that month</p>
    </div>
  )
}

function Icon({ name }: { name: 'pin' | 'sun' | 'snow' }) {
  const paths = {
    pin: 'M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4',
    snow: 'M12 2v20 M4 6.5l16 11 M4 17.5l16-11 M9 3.5l3 2.5 3-2.5 M9 20.5l3-2.5 3 2.5',
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={paths[name]} />
    </svg>
  )
}

/** Counts up to `to` over ~1.2s (instant when motion is reduced). */
function CountUp({ to, animate }: { to: number; animate: boolean }) {
  const [n, setN] = useState(animate ? 0 : to)
  useEffect(() => {
    if (!animate) return setN(to)
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1200)
      setN(Math.round(to * (1 - (1 - p) ** 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, animate])
  return <>{fmtNumber(n)}</>
}

/** "Nepal" → 🇳🇵 (via the browser's region names). */
function flagFor(name: string) {
  try {
    const names = new Intl.DisplayNames(['en'], { type: 'region' })
    for (let a = 65; a <= 90; a++)
      for (let b = 65; b <= 90; b++) {
        const code = String.fromCharCode(a, b)
        if (names.of(code) === name) return String.fromCodePoint(127397 + a, 127397 + b)
      }
  } catch {}
  return '📍'
}
