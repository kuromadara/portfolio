import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { trackPersonaTransition, usePersona } from './persona'

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> }
}

/** Load the map chunk ahead of time (it's ~1 MB; only fetched once). */
const warmMap = () => void import('./TravelMap').catch(() => undefined)

/**
 * The "Alter Ego" switch. Navigates between `/` (dev) and `/travel` (traveler).
 * Where the View Transitions API exists, the new persona is revealed as a
 * circle expanding from the toggle; elsewhere it's a normal navigation.
 *
 * Kept snappy by: prefetching the other page on mount, warming the map chunk
 * on hover/focus, and only freezing the screen (startViewTransition) once the
 * next page is loaded — so the freeze lasts a frame, not a network round-trip.
 */
export default function AlterEgoToggle() {
  const router = useRouter()
  const persona = usePersona()
  const target = persona === 'travel' ? '/' : '/travel'
  // knob moves on click, before the navigation finishes
  const [pending, setPending] = useState<'dev' | 'travel' | null>(null)
  const isTravel = (pending ?? persona) === 'travel'

  useEffect(() => setPending(null), [persona])
  useEffect(() => {
    router.prefetch(target).catch(() => undefined)
  }, [router, target])

  const warm = () => {
    if (target === '/travel') warmMap()
  }

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (pending) return
    setPending(persona === 'travel' ? 'dev' : 'travel')
    warm()
    const doc = document as ViewTransitionDoc
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!doc.startViewTransition || reduced) {
      router.push(target)
      return
    }
    const r = e.currentTarget.getBoundingClientRect()
    // wait (briefly) for the page's code + data so the frozen frame is short
    await Promise.race([router.prefetch(target).catch(() => undefined), new Promise((res) => setTimeout(res, 800))])
    document.documentElement.style.setProperty('--vt-x', `${r.left + r.width / 2}px`)
    document.documentElement.style.setProperty('--vt-y', `${r.top + r.height / 2}px`)
    const vt = doc.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          const done = () => {
            router.events.off('routeChangeComplete', done)
            router.events.off('routeChangeError', done)
            // let React commit the new page before the "new" snapshot is taken
            requestAnimationFrame(() => resolve())
          }
          router.events.on('routeChangeComplete', done)
          router.events.on('routeChangeError', done)
          router.push(target, undefined, { scroll: true })
        }),
    )
    trackPersonaTransition(vt?.finished)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerEnter={warm}
      onFocus={warm}
      role="switch"
      aria-checked={isTravel}
      aria-label={`Alter ego: switch to ${isTravel ? 'developer' : 'traveler'} profile`}
      title="Alter ego"
      className="group relative grid h-9 grid-cols-2 items-center rounded-full border border-line bg-surface p-1 font-mono text-[11px] uppercase tracking-wider"
    >
      <span
        aria-hidden
        className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-ink transition-transform duration-300 ease-out ${
          isTravel ? 'translate-x-full' : ''
        }`}
      />
      <span className={`relative z-10 px-3 transition-colors ${isTravel ? 'text-muted group-hover:text-ink' : 'text-bg'}`}>
        &lt;/&gt; Dev
      </span>
      <span className={`relative z-10 px-3 transition-colors ${isTravel ? 'text-bg' : 'text-muted group-hover:text-ink'}`}>
        ⛰ Travel
      </span>
    </button>
  )
}
