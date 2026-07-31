import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { company } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'

export function HomeCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <Reveal className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/85 px-6 py-16 text-center shadow-xl shadow-primary/20 sm:px-12">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-25" aria-hidden />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
            Ready to Start Your Next Power Project?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/80 text-pretty">
            Send us your drawings or requirements and our engineering team will prepare a tailored
            quotation — with samples, technical data sheets and test reports.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="sheen group relative inline-flex items-center gap-2 overflow-hidden rounded-md bg-accent px-6 py-3.5 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:-translate-y-0.5"
            >
              Request a Quote
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${company.phones[0].replace(/[^+\d]/g, '')}`}
              className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/5 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <Phone className="h-5 w-5" />
              {company.phones[0]}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
