import { useRouter } from 'next/router'

export type Persona = 'dev' | 'travel'

export const personaFor = (pathname: string): Persona =>
  pathname === '/travel' || pathname.startsWith('/travel/') ? 'travel' : 'dev'

export function usePersona(): Persona {
  return personaFor(useRouter().pathname)
}
