import Link from 'next/link'
import { fmtDate, fmtNumber } from '../lib/format'
import type { TravelStats } from '../lib/polarsteps'
import type { TravelInsights as Insights } from '../lib/travelInsights'
import Reveal from './Reveal'

/**
 * "By the numbers" for the travel page. Hand-built HTML charts (no chart
 * library): every chart encodes one measure, so all marks use the persona
 * accent — the calendar is the only sequential scale (accent, light → dark).
 */
export default function TravelInsights({
  data,
  stats,
  onTripHover,
}: {
  data: Insights
  stats: TravelStats
  onTripHover?: (id: number | null) => void
}) {
  return (
    <div className="space-y-6">
      <Tiles data={data} stats={stats} />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card title="Distance per trip" note="oldest → newest" className="lg:col-span-3">
          <TripBars trips={data.trips} onHover={onTripHover} />
        </Card>
        <Card title="Days on the road" note="per month" className="lg:col-span-2">
          <Calendar months={data.months} />
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card title="When I log a step" note="local time">
          <Hours hours={data.hours} />
        </Card>
        <Card
          title="Weather on the road"
          note={data.coolest && data.hottest ? `${data.coolest.temp}° – ${data.hottest.temp}°C` : undefined}
        >
          <BarList rows={data.weather.map((w) => ({ key: w.label, label: w.label, value: w.count, suffix: pct(w.count, data.weather) }))} />
        </Card>
        <Card title="Most-logged places" note="steps · trips" className="md:col-span-2 lg:col-span-1">
          <BarList
            rows={data.places.slice(0, 7).map((r) => ({
              key: r.name,
              label: r.name,
              value: r.steps,
              suffix: `${r.trips} trip${r.trips === 1 ? '' : 's'}`,
            }))}
          />
          {data.places.length > 7 && (
            <p className="mt-3 font-mono text-[11px] text-muted">+ {data.places.length - 7} more places</p>
          )}
        </Card>
      </div>

      {data.compass.length > 0 && (
        <Card title="Compass points" note="the edges of the map so far">
          <ul className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-4">
            {data.compass.map((c) => (
              <li key={c.dir} className="flex items-start gap-3 bg-surface p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-accent font-mono text-xs text-accent">
                  {c.dir}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{c.place}</span>
                  <span className="font-mono text-[11px] text-muted">{c.coord}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

/* ── Headline tiles ─────────────────────────────────────────────────────── */

function Tiles({ data, stats }: { data: Insights; stats: TravelStats }) {
  const tiles: { value: string; unit?: string; label: string; sub?: string }[] = [
    { value: fmtNumber(data.photos), label: 'photos taken', sub: `${(data.photos / Math.max(1, stats.steps)).toFixed(1)} per step` },
    { value: `${data.earthPct}`, unit: '%', label: 'of the way around Earth', sub: `${fmtNumber(stats.km)} of 40,075 km` },
    {
      value: fmtNumber(Math.round(stats.km / Math.max(1, stats.days))),
      unit: 'km',
      label: 'per day on the road',
      sub: `across ${stats.days} days`,
    },
  ]
  if (stats.furthest)
    tiles.push({ value: fmtNumber(stats.furthest.km), unit: 'km', label: 'furthest from home', sub: stats.furthest.place })
  if (data.longestLeg)
    tiles.push({
      value: fmtNumber(data.longestLeg.km),
      unit: 'km',
      label: 'longest hop between steps',
      sub: `${short(data.longestLeg.from)} → ${short(data.longestLeg.place)}`,
    })
  if (data.hottest) tiles.push({ value: `${data.hottest.temp}`, unit: '°C', label: 'hottest step', sub: short(data.hottest.place) })
  if (data.coolest) tiles.push({ value: `${data.coolest.temp}`, unit: '°C', label: 'coolest step', sub: short(data.coolest.place) })
  const longest = data.trips.reduce<Insights['trips'][number] | null>((b, t) => (!b || t.days > b.days ? t : b), null)
  if (longest) tiles.push({ value: `${longest.days}`, unit: 'days', label: 'longest trip', sub: longest.name })

  return (
    <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line lg:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="min-w-0 bg-surface px-5 py-5">
          <p className="font-display text-3xl font-medium tracking-tight">
            {t.value}
            {t.unit && <span className="ml-1 text-base text-muted">{t.unit}</span>}
          </p>
          <p className="mt-1 text-sm text-ink">{t.label}</p>
          {t.sub && <p className="mt-0.5 truncate font-mono text-[11px] text-muted">{t.sub}</p>}
        </div>
      ))}
    </Reveal>
  )
}

/* ── Building blocks ────────────────────────────────────────────────────── */

function Card({
  title,
  note,
  className = '',
  children,
}: {
  title: string
  note?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Reveal className={`card p-5 sm:p-6 ${className}`}>
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-medium">{title}</h3>
        {note && <span className="font-mono text-[11px] text-muted">{note}</span>}
      </div>
      {children}
    </Reveal>
  )
}

/** Hover / focus tooltip. Parent needs `group relative`. */
function Tip({ children, align = 'center' }: { children: React.ReactNode; align?: 'center' | 'left' | 'right' }) {
  const pos = align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
  return (
    <span
      role="tooltip"
      className={`pointer-events-none invisible absolute bottom-full z-20 mb-2 w-max max-w-[240px] rounded border border-line bg-surface px-2.5 py-1.5 text-left text-xs text-ink opacity-0 shadow-md transition-opacity group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100 ${pos}`}
    >
      {children}
    </span>
  )
}

/* ── Distance per trip: horizontal bars, rows link to the trip ──────────── */

function TripBars({ trips, onHover }: { trips: Insights['trips']; onHover?: (id: number | null) => void }) {
  const max = Math.max(1, ...trips.map((t) => t.km))
  return (
    <ul className="space-y-1">
      {trips.map((t) => (
        <li key={t.id}>
          <Link
            href={`/travel/${t.slug}`}
            onMouseEnter={() => onHover?.(t.id)}
            onMouseLeave={() => onHover?.(null)}
            onFocus={() => onHover?.(t.id)}
            onBlur={() => onHover?.(null)}
            className="group relative grid grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-3 rounded py-1.5 outline-offset-2 sm:grid-cols-[minmax(0,12rem)_1fr_auto]"
          >
            <span className="truncate text-sm group-hover:text-accent">{t.name}</span>
            <span className="relative h-2.5">
              <span
                className="absolute inset-y-0 left-0 rounded-r bg-accent/85 transition-colors group-hover:bg-accent"
                style={{ width: `${Math.max(1.5, (t.km / max) * 100)}%` }}
              />
            </span>
            <span className="w-16 text-right font-mono text-xs tabular-nums text-muted">{fmtNumber(t.km)} km</span>
            <Tip align="left">
              <span className="block font-medium">{t.name}</span>
              <span className="font-mono text-[11px] text-muted">
                {fmtDate(t.start, t.timezone, { month: 'short', year: 'numeric', day: undefined })} · {t.days} day
                {t.days === 1 ? '' : 's'} · {t.steps} steps · {t.photos} photos · {fmtNumber(Math.round(t.km / t.days))}{' '}
                km/day
              </span>
            </Tip>
          </Link>
        </li>
      ))}
    </ul>
  )
}

/* ── Calendar heatmap: year rows × month columns ────────────────────────── */

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/** Sequential steps: 0 · 1–3 · 4–7 · 8–14 · 15+ days. */
const BUCKETS = [
  { min: 15, cls: 'bg-accent', label: '15+' },
  { min: 8, cls: 'bg-accent/65', label: '8–14' },
  { min: 4, cls: 'bg-accent/40', label: '4–7' },
  { min: 1, cls: 'bg-accent/25', label: '1–3' },
]
const bucket = (days: number) => BUCKETS.find((b) => days >= b.min)?.cls ?? 'bg-line/40'

function Calendar({ months }: { months: Insights['months'] }) {
  const byKey = new Map(months.map((m) => [m.key, m]))
  const years = Array.from(new Set(months.map((m) => m.key.slice(0, 4))))
  const busiest = months.reduce<Insights['months'][number] | null>((b, m) => (!b || m.days > b.days ? m : b), null)

  return (
    <div>
      <div className="grid grid-cols-[2.5rem_repeat(12,minmax(0,1fr))] gap-1">
        <span />
        {MONTHS.map((m, i) => (
          <span key={i} className="text-center font-mono text-[10px] text-muted">
            {m}
          </span>
        ))}
        {years.map((y) => (
          <Row key={y} year={y} byKey={byKey} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted" aria-label="Legend: days per month">
          <span>days</span>
          <span className="h-3 w-3 rounded-sm bg-line/40" title="0" />
          {BUCKETS.slice().reverse().map((b) => (
            <span key={b.label} className="flex items-center gap-1">
              <span className={`h-3 w-3 rounded-sm ${b.cls}`} />
              {b.label}
            </span>
          ))}
        </div>
        {busiest && busiest.days > 0 && (
          <p className="font-mono text-[11px] text-muted">
            busiest: {monthLabel(busiest.key)} · {busiest.days} days
          </p>
        )}
      </div>
    </div>
  )
}

function Row({ year, byKey }: { year: string; byKey: Map<string, Insights['months'][number]> }) {
  return (
    <>
      <span className="self-center font-mono text-[11px] text-muted">{year}</span>
      {MONTH_NAMES.map((_, i) => {
        const key = `${year}-${String(i + 1).padStart(2, '0')}`
        const m = byKey.get(key)
        if (!m) return <span key={key} aria-hidden className="aspect-square rounded-sm border border-dashed border-line/70" />
        const label = `${monthLabel(key)}: ${m.days} day${m.days === 1 ? '' : 's'} on the road`
        return (
          <span
            key={key}
            tabIndex={0}
            aria-label={`${label}${m.trips.length ? ` — ${m.trips.join(', ')}` : ''}`}
            className={`group relative aspect-square rounded-sm outline-offset-1 ${bucket(m.days)}`}
          >
            <Tip align={i < 3 ? 'left' : i > 8 ? 'right' : 'center'}>
              <span className="block font-medium">{label}</span>
              {m.trips.length > 0 && <span className="font-mono text-[11px] text-muted">{m.trips.join(' · ')}</span>}
            </Tip>
          </span>
        )
      })}
    </>
  )
}

const monthLabel = (key: string) => `${MONTH_NAMES[Number(key.slice(5, 7)) - 1]} ${key.slice(0, 4)}`

/* ── Hour-of-day histogram ──────────────────────────────────────────────── */

function Hours({ hours }: { hours: number[] }) {
  const max = Math.max(1, ...hours)
  const peak = hours.indexOf(max)
  const total = hours.reduce((a, b) => a + b, 0)
  const share = (from: number, to: number) => Math.round((hours.slice(from, to).reduce((a, b) => a + b, 0) / Math.max(1, total)) * 100)

  return (
    <div>
      <div className="flex h-32 items-end gap-[2px] border-b border-line" role="list" aria-label="Steps logged per hour of day">
        {hours.map((n, h) => (
          <span
            key={h}
            role="listitem"
            tabIndex={0}
            aria-label={`${hourLabel(h)}: ${n} steps`}
            className="group relative flex h-full flex-1 items-end outline-offset-1"
          >
            <span
              className={`w-full rounded-t-[3px] ${h === peak ? 'bg-accent' : 'bg-accent/45'} transition-colors group-hover:bg-accent`}
              style={{ height: n ? `${Math.max(4, (n / max) * 100)}%` : 0 }}
            />
            <Tip align={h < 4 ? 'left' : h > 19 ? 'right' : 'center'}>
              <span className="font-medium">{hourLabel(h)}</span> · {n} step{n === 1 ? '' : 's'}
            </Tip>
          </span>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted" aria-hidden>
        <span>12am</span>
        <span>6am</span>
        <span>12pm</span>
        <span>6pm</span>
        <span>11pm</span>
      </div>
      <p className="mt-4 text-sm text-muted">
        Busiest around <span className="text-ink">{hourLabel(peak)}</span> · {share(5, 12)}% before noon, {share(18, 24)}%
        after 6pm
      </p>
    </div>
  )
}

const hourLabel = (h: number) => `${h % 12 || 12}${h < 12 ? 'am' : 'pm'}`

/* ── Generic labelled bar list ──────────────────────────────────────────── */

function BarList({ rows }: { rows: { key: string; label: string; value: number; suffix?: string }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate">{r.label}</span>
            <span className="shrink-0 font-mono text-xs tabular-nums text-muted">
              {r.value}
              {r.suffix && <span className="ml-2">{r.suffix}</span>}
            </span>
          </div>
          <div className="h-2">
            <div className="h-full rounded-r bg-accent/85" style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

const pct = (n: number, all: { count: number }[]) => `${Math.round((n / Math.max(1, all.reduce((a, b) => a + b.count, 0))) * 100)}%`

/** "Pokhara, Nepal" → "Pokhara" */
const short = (place: string) => place.split(',')[0]
