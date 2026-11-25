import Reveal from './Reveal'

export const COFFEE_URL = 'https://buymeacoffee.com/dayd'

/** "Fuel the next trip" — a plain link (no Buy Me a Coffee widget script). */
export default function CoffeeCard({ compact = false }: { compact?: boolean }) {
  return (
    <Reveal
      className={`card flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between ${compact ? 'p-6' : 'p-8'}`}
    >
      <div>
        <p className="eyebrow">Fuel the next trip</p>
        <p className={`mt-2 font-display font-medium ${compact ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>
          {compact ? 'Enjoyed this one? Buy me a chai for the road.' : 'Liked the stories? Every coffee goes into the next mountain.'}
        </p>
      </div>
      <a
        href={COFFEE_URL}
        target="_blank"
        rel="noreferrer"
        className="btn-primary shrink-0 self-start sm:self-auto"
      >
        <span aria-hidden>☕</span> Buy me a coffee
      </a>
    </Reveal>
  )
}
