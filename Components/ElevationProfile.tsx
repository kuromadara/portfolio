import { useState } from 'react'
import { fmtNumber } from '../lib/format'
import type { Step } from '../lib/polarsteps'

/**
 * Ground elevation at each step, in step order (matches the numbered map).
 * One series → no legend; the line/area use the accent, all text stays in ink
 * tokens. Each step is a full-height hover/focus column with a tooltip;
 * clicking scrolls the timeline to that step.
 */
export default function ElevationProfile({ steps }: { steps: Step[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const pts = steps.map((s, i) => ({ i, s, e: s.elev })).filter((p): p is typeof p & { e: number } => p.e != null)
  if (pts.length < 3) return null

  const W = 1000
  const H = 200
  const hi = Math.max(...pts.map((p) => p.e))
  const lo = Math.min(...pts.map((p) => p.e))
  // nice y-range in 500 m steps, at least 500 m tall so flat trips stay flat
  const top = Math.max(Math.ceil(hi / 500) * 500, Math.floor(lo / 500) * 500 + 500)
  const base = Math.max(0, Math.min(Math.floor(lo / 500) * 500, top - 500))
  const ticks = Array.from({ length: 3 }, (_, k) => Math.round(base + ((top - base) * k) / 2))

  const n = steps.length
  const x = (i: number) => (n === 1 ? W / 2 : (i / (n - 1)) * W)
  const y = (e: number) => H - ((e - base) / (top - base)) * H
  const line = pts.map((p, k) => `${k ? 'L' : 'M'}${x(p.i).toFixed(1)},${y(p.e).toFixed(1)}`).join(' ')
  const area = `${line} L${x(pts[pts.length - 1].i).toFixed(1)},${H} L${x(pts[0].i).toFixed(1)},${H} Z`
  const peak = pts.reduce((a, b) => (b.e > a.e ? b : a))
  const climb = pts.reduce((sum, p, k) => sum + (k && p.e > pts[k - 1].e ? p.e - pts[k - 1].e : 0), 0)
  const active = hover != null ? pts.find((p) => p.i === hover) : null

  const toStep = (i: number) => document.getElementById(`step-${i + 1}`)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <figure className="card p-5 sm:p-6">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="font-display text-lg font-medium">Elevation</h2>
        <p className="font-mono text-[11px] text-muted">
          peak {fmtNumber(peak.e)} m · {short(peak.s.place)} · ↑ {fmtNumber(climb)} m climbed between steps
        </p>
      </figcaption>

      <div className="mt-5 flex gap-3">
        {/* y-axis labels */}
        <div className="relative w-12 shrink-0 font-mono text-[10px] text-muted" style={{ height: H }} aria-hidden>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${(y(t) / H) * 100}%` }}>
              {fmtNumber(t)} m
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1" style={{ height: H }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            {ticks.map((t) => (
              <line key={t} x1={0} x2={W} y1={y(t)} y2={y(t)} className="stroke-line" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            ))}
            <path d={area} className="fill-accent/15" />
            <path d={line} fill="none" className="stroke-accent" strokeWidth={2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {active && (
              <line x1={x(active.i)} x2={x(active.i)} y1={0} y2={H} className="stroke-muted" strokeWidth={1} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            )}
          </svg>

          {/* markers as HTML so they stay round at any width */}
          {pts.map((p) => (
            <span
              key={p.i}
              aria-hidden
              className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-accent transition-[width,height] ${
                hover === p.i || p === peak ? 'h-3 w-3' : n > 40 ? 'h-1.5 w-1.5 border-0' : 'h-2 w-2'
              }`}
              style={{ left: `${(x(p.i) / W) * 100}%`, top: `${(y(p.e) / H) * 100}%` }}
            />
          ))}

          {/* hit columns: wider than the marks, one per step */}
          <div className="absolute inset-0 flex" onMouseLeave={() => setHover(null)}>
            {steps.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                onClick={() => toStep(i)}
                aria-label={`Step ${i + 1}, ${s.title}: ${s.elev != null ? `${fmtNumber(s.elev)} metres` : 'no elevation'}. Go to step.`}
                className="h-full flex-1 cursor-pointer outline-none focus-visible:bg-accent/10"
              />
            ))}
          </div>

          {active && (
            <div
              className="pointer-events-none absolute bottom-full z-10 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded border border-line bg-surface px-2.5 py-1.5 text-xs text-ink shadow-md"
              style={{ left: `clamp(110px, ${(x(active.i) / W) * 100}%, calc(100% - 110px))` }}
            >
              <span className="font-mono text-muted">{active.i + 1}.</span> {active.s.title}
              <br />
              <span className="font-mono">{fmtNumber(active.e)} m</span>
              <span className="text-muted"> · {short(active.s.place)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 flex justify-between pl-[60px] font-mono text-[10px] text-muted" aria-hidden>
        <span>step 1</span>
        <span>step {n}</span>
      </div>
      <p className="mt-3 text-[11px] text-muted">
        Ground elevation at each step&rsquo;s location ·{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-2 hover:text-ink">
          Open-Meteo
        </a>{' '}
        / Copernicus DEM
      </p>
    </figure>
  )
}

const short = (place: string) => place.split(',')[0].trim()
