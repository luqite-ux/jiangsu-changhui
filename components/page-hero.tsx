import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow?: string
  title: string
  description?: string
  breadcrumb: string
}) {
  return (
    <section className="relative isolate overflow-hidden bg-primary pb-16 pt-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-30" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-sm text-white/80" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white/90">{breadcrumb}</span>
        </nav>

        {eyebrow && (
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent-on-dark">
            <span className="h-px w-6 bg-accent-on-dark" />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-white text-balance sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80 text-pretty">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
