import { profile } from '../content/dev'
import { POLARSTEPS_PROFILE_URL } from '../lib/polarsteps'
import { usePersona } from './persona'

export default function Footer() {
  const persona = usePersona()
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
          {persona === 'travel' && <> · trip data from Polarsteps</>}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li><a className="hover:text-ink" href={`mailto:${profile.email}`}>Email</a></li>
          <li><a className="hover:text-ink" href={profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
          <li><a className="hover:text-ink" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a className="hover:text-ink" href={POLARSTEPS_PROFILE_URL} target="_blank" rel="noreferrer">Polarsteps</a></li>
        </ul>
      </div>
    </footer>
  )
}
