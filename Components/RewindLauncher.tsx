import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { loadRewind, type RewindIndex, type YearRewind } from '../lib/rewind'
import { afterPersonaTransition } from './persona'

const Rewind = dynamic(() => import('./Rewind'), { ssr: false })

/** Months (0-based) when the current year's rewind is offered: November and December. */
const SEASON = [10, 11]
const seenKey = (year: number) => `rewind-seen-${year}`

/**
 * Rewind controls on /travel:
 * - "So far" (everything to date) and an archive of past years — always available.
 * - The current year joins the archive in Nov–Dec, when it also opens by itself
 *   once per visitor (remembered in localStorage).
 * `?rewind=all` / `?rewind=2025` / `?rewind=1` (this year) open one directly.
 */
export default function RewindLauncher({ index }: { index: RewindIndex[] }) {
  const rewinds = Object.fromEntries(index.map((r) => [r.key, r])) as Record<string, RewindIndex>
  const [now, setNow] = useState<Date | null>(null) // client-only: the page is static
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const archiveRef = useRef<HTMLDivElement>(null)

  const thisYear = now?.getFullYear() ?? 0
  const inSeason = now ? SEASON.includes(now.getMonth()) : false
  const archive = index
    .filter((r) => r.kind === 'year' && (r.year < thisYear || (r.year === thisYear && inSeason)))
    .sort((a, b) => b.year - a.year)

  useEffect(() => {
    const d = new Date()
    setNow(d)
    const y = d.getFullYear()
    const forced = new URLSearchParams(window.location.search).get('rewind')
    let key: string | null = null
    if (forced === 'all' || (forced && /^\d{4}$/.test(forced))) key = forced
    else if (forced) key = String(y)
    else if (SEASON.includes(d.getMonth()) && rewinds[y]) {
      try {
        if (localStorage.getItem(seenKey(y)) !== '1') key = String(y)
      } catch {}
    }
    if (!key || !rewinds[key]) return

    let cancelled = false
    const k = key
    afterPersonaTransition().then(() =>
      setTimeout(() => {
        if (cancelled) return
        setOpenKey(k)
        if (k === String(y))
          try {
            localStorage.setItem(seenKey(y), '1')
          } catch {}
      }, 900),
    )
    return () => {
      cancelled = true
    }
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  // close the archive menu on outside click
  useEffect(() => {
    if (!archiveOpen) return
    const onDown = (e: PointerEvent) => {
      if (!archiveRef.current?.contains(e.target as Node)) setArchiveOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [archiveOpen])

  const close = useCallback(() => setOpenKey(null), [])

  // the story itself is a separate chunk, fetched on first open
  const [story, setStory] = useState<YearRewind | null>(null)
  useEffect(() => {
    if (!openKey) return setStory(null)
    let live = true
    loadRewind(openKey).then((r) => live && setStory(r))
    return () => {
      live = false
    }
  }, [openKey])

  if (!rewinds.all) return null
  const current = inSeason ? rewinds[thisYear] : undefined
  const firstYear = Math.min(...index.map((r) => r.since))

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {current && (
          <button type="button" onClick={() => setOpenKey(current.key)} className="group inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 py-1.5 pl-1.5 pr-4 text-sm font-medium text-ink transition-colors hover:border-accent hover:bg-accent/15">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-accent-ink transition-transform group-hover:rotate-[-20deg]">↺</span>
            My {current.year} rewind
            <span className="rounded-full bg-accent px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent-ink">new</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpenKey('all')}
          className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-4 text-sm font-medium text-ink transition-colors hover:border-accent"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-bg transition-transform group-hover:rotate-[-20deg]">↺</span>
          Rewind: so far
        </button>
        {archive.length > 0 && (
          <div ref={archiveRef} className="relative">
            <button
              type="button"
              onClick={() => setArchiveOpen((v) => !v)}
              aria-expanded={archiveOpen}
              aria-haspopup="menu"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-ink"
            >
              Archive <span aria-hidden className={`text-xs transition-transform ${archiveOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {archiveOpen && (
              <ul role="menu" className="absolute left-0 top-full z-30 mt-2 min-w-[11rem] overflow-hidden rounded-[var(--radius)] border border-line bg-surface py-1 shadow-lg">
                {archive.map((r) => (
                  <li key={r.key} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setArchiveOpen(false)
                        setOpenKey(r.key)
                      }}
                      className="flex w-full items-baseline justify-between gap-4 px-4 py-2 text-left text-sm hover:bg-accent/10"
                    >
                      <span className="font-medium">{r.year} rewind</span>
                      <span className="font-mono text-[11px] text-muted">{r.trips} trips</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {openKey && story?.key === openKey && (
        <Rewind key={story.key} data={story} firstYear={story.year === firstYear} open onClose={close} />
      )}
    </>
  )
}
