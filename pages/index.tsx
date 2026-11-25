import type { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { COFFEE_URL } from '../Components/CoffeeCard'
import Reveal from '../Components/Reveal'
import Section from '../Components/Section'
import { education, experience, facts, featured, profile, skills } from '../content/dev'
import { fmtNumber } from '../lib/format'
import type { TravelStats } from '../lib/polarsteps'
import { getTravelProfile } from '../lib/travelData'
import { getProjects, type Project } from '../lib/sanity'

interface Props {
  projects: Project[]
  travel: TravelStats | null
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const projects = await getProjects()
  return { props: { projects, travel: getTravelProfile().stats }, revalidate: 3600 }
}

export default function DevHome({ projects, travel }: Props) {
  const title = `${profile.name} — ${profile.role}`
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={profile.intro} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={profile.intro} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
      </Head>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="grid-bg absolute inset-0 -z-0" />
        <div className="container-page relative pb-16 pt-20 sm:pt-28">
          <Reveal>
            <p className="eyebrow mb-6">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent-2 align-middle" />
              {profile.role} · {profile.location}
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">
              I build software that
              <br className="hidden sm:block" /> <span className="text-accent">runs real things.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{profile.intro}</p>
          </Reveal>

          <Reveal delay={120} className="mt-9 flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} className="btn-primary">
              Get in touch <span aria-hidden>→</span>
            </a>
            <a href={profile.resume} download className="btn-ghost">
              Résumé (PDF)
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="btn-ghost">
              GitHub
            </a>
          </Reveal>

          <Reveal delay={220} className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-3">
            <Fact k="Now" v={experience[0].company} />
            <Fact k="Experience" v={facts.experience} />
            <Fact k="Focus" v={facts.focus} />
          </Reveal>
        </div>
      </section>

      {/* ── Experience ───────────────────────────────────── */}
      <Section id="work" index="01" title="Experience">
        <ol className="divide-y divide-line">
          {experience.map((job, i) => (
            <Reveal as="li" key={job.company} delay={i * 60} className="grid gap-4 py-8 md:grid-cols-[200px_1fr]">
              <div className="font-mono text-sm text-muted">
                {job.period}
                {job.current && (
                  <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] text-accent">current</span>
                )}
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold">
                  {job.role} <span className="text-muted">@ {job.company}</span>
                </h3>
                <ul className="mt-3 space-y-1.5 text-[15px] leading-relaxed text-ink/85">
                  {job.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-muted" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.stack.map((s) => (
                    <span key={s} className="chip">{s}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ── Featured ─────────────────────────────────────── */}
      <Section id="featured" index="02" title="Highlights">
        <div className="grid gap-4 md:grid-cols-3">
          {featured.map((f, i) => (
            <Reveal key={f.title} delay={i * 80} className="card flex flex-col p-6">
              <p className="eyebrow text-accent">{f.meta}</p>
              <h3 className="mt-3 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.blurb}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Projects (Sanity) ────────────────────────────── */}
      <Section id="projects" index="03" title="Projects">
        {projects.length === 0 ? (
          <p className="card p-8 text-muted">Projects are on their way — check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => {
              const Wrapper = p.link ? 'a' : 'div'
              return (
                <Reveal key={p._id} delay={(i % 3) * 80}>
                  <Wrapper
                    {...(p.link ? { href: p.link, target: '_blank', rel: 'noreferrer' } : {})}
                    title={p.detail ?? undefined}
                    className="card group flex h-full flex-col p-5 transition-colors hover:border-accent/60"
                  >
                    <h3 className="flex items-start justify-between gap-3 font-display text-lg font-semibold leading-snug">
                      {p.title.trim()}
                      {p.link && (
                        <span aria-hidden className="mt-0.5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent">
                          ↗
                        </span>
                      )}
                    </h3>
                    {p.description && <p className="mt-2 text-sm leading-relaxed text-ink/80">{p.description.trim()}</p>}
                    {p.detail && (
                      <p className={`mt-2 text-sm leading-relaxed text-muted ${p.description ? 'line-clamp-2' : 'line-clamp-4'}`}>
                        {p.detail.trim()}
                      </p>
                    )}
                    {p.link && <p className="mt-auto pt-4 font-mono text-[11px] text-muted">{host(p.link)}</p>}
                  </Wrapper>
                </Reveal>
              )
            })}
          </div>
        )}
      </Section>

      {/* ── Skills + education ───────────────────────────── */}
      <Section id="skills" index="04" title="Toolbox">
        <div className="grid gap-10 md:grid-cols-3">
          {skills.map((s, i) => (
            <Reveal key={s.group} delay={i * 80}>
              <h3 className="eyebrow mb-4">{s.group}</h3>
              <ul className="flex flex-wrap gap-2">
                {s.items.map((it) => (
                  <li key={it} className="rounded-[var(--radius)] border border-line bg-surface px-3 py-1.5 text-sm">
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14">
          <h3 className="eyebrow mb-4">Education</h3>
          <ul className="divide-y divide-line border-y border-line">
            {education.map((e) => (
              <li key={e.degree} className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                <span className="font-medium">{e.degree}</span>
                <span className="text-sm text-muted">
                  {e.school} · <span className="font-mono">{e.year}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* ── Alter-ego teaser ─────────────────────────────── */}
      {travel && (
        <section className="container-page pt-24">
          <Reveal>
            <Link
              href="/travel"
              className="card group flex flex-col justify-between gap-6 p-8 transition-colors hover:border-accent sm:flex-row sm:items-center"
            >
              <div>
                <p className="eyebrow">Off the clock</p>
                <p className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
                  {fmtNumber(travel.km)} km, {travel.trips} trips, {travel.countries} countries — mostly up mountains.
                </p>
              </div>
              <span className="shrink-0 font-mono text-sm text-accent">
                Meet the traveler <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </Reveal>
        </section>
      )}

      {/* ── Contact ──────────────────────────────────────── */}
      <Section id="contact" index="05" title="Contact">
        <Reveal>
          <p className="max-w-xl text-lg text-muted">
            Open to interesting work — full-stack builds, GovTech, mobile, or DevOps. The fastest way to reach me is email.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-6 inline-block break-all font-display text-2xl font-semibold underline decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-accent sm:text-4xl"
          >
            {profile.email}
          </a>
          <p className="mt-10 text-sm text-muted">
            Found a repo or write-up here useful?{' '}
            <a
              href={COFFEE_URL}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent"
            >
              ☕ Buy me a coffee
            </a>
          </p>
        </Reveal>
      </Section>
    </>
  )
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-surface px-5 py-4">
      <p className="eyebrow">{k}</p>
      <p className="mt-1 text-[15px] font-medium">{v}</p>
    </div>
  )
}

/** "https://www.github.com/x/y" → "github.com" */
function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
