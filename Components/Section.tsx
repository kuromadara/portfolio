import Reveal from './Reveal'

/** Consistent section heading: mono index + display title. */
export default function Section({
  id,
  index,
  title,
  aside,
  children,
}: {
  id: string
  index: string
  title: string
  aside?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section id={id} className="container-page pt-24">
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <h2 className="flex items-baseline gap-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="font-mono text-xs font-normal text-accent">{index}</span>
          {title}
        </h2>
        {aside}
      </Reveal>
      {children}
    </section>
  )
}
