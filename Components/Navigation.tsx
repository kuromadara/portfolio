import Link from 'next/link'
import AlterEgoToggle from './AlterEgoToggle'
import ThemeToggle from './ThemeToggle'
import { usePersona } from './persona'

const LINKS = {
  dev: [
    { href: '/#work', label: 'Work' },
    { href: '/#projects', label: 'Projects' },
    { href: '/#skills', label: 'Skills' },
    { href: '/#contact', label: 'Contact' },
  ],
  travel: [
    { href: '/travel#map', label: 'Map' },
    { href: '/travel#numbers', label: 'Numbers' },
    { href: '/travel#trips', label: 'Trips' },
  ],
}

export default function Navigation() {
  const persona = usePersona()
  return (
    <header className="sticky top-0 z-[1000] border-b border-line/70 bg-bg/80 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link href={persona === 'travel' ? '/travel' : '/'} className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink font-display text-sm font-semibold text-bg">
            DD
          </span>
          <span className="hidden font-display text-[15px] font-semibold sm:inline">
            {persona === 'travel' ? 'Dayananda · on the road' : 'Dayananda Dowarah'}
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS[persona].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <AlterEgoToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
