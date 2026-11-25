import { useRouter } from 'next/router'

export type Persona = 'dev' | 'travel'

export const personaFor = (pathname: string): Persona =>
  pathname === '/travel' || pathname.startsWith('/travel/') ? 'travel' : 'dev'

export function usePersona(): Persona {
  return personaFor(useRouter().pathname)
}

/**
 * The persona switch's view transition, while one is running. Heavy work on
 * the new page (the MapLibre globe) waits for it so the reveal stays smooth.
 */
let transition: Promise<unknown> | null = null

export function trackPersonaTransition(finished: Promise<unknown> | undefined) {
  if (!finished) return
  const p = finished.catch(() => undefined).finally(() => {
    if (transition === p) transition = null
  })
  transition = p
}

/** Resolves once any running persona transition has finished and the browser is idle. */
export async function afterPersonaTransition() {
  if (transition) await transition
  await new Promise<void>((resolve) => {
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void })
      .requestIdleCallback
    if (ric) ric(() => resolve(), { timeout: 300 })
    else setTimeout(resolve, 0)
  })
}
