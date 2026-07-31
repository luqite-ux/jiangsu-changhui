'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, Package, Clock } from 'lucide-react'
import { photos, productCategories } from '@/lib/site-data'

const badges = [
  { icon: ShieldCheck, label: 'ISO 9001 Quality System' },
  { icon: Package, label: 'MOQ 1 Unit' },
  { icon: Clock, label: '2-Year Warranty' },
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image + overlays */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={photos.productionHallA}
          alt="Chang Hui Electric factory workshop — rows of finished switchgear cabinets ready for delivery"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-0 tech-grid opacity-40" aria-hidden />
      </div>

      {/* Floating decorative rings */}
      <div className="pointer-events-none absolute right-[8%] top-32 -z-10 hidden lg:block" aria-hidden>
        <div className="animate-float-slow">
          <div className="relative h-72 w-72 rounded-full border border-white/20">
            <div className="absolute inset-6 rounded-full border border-white/15" />
            <div className="absolute inset-14 rounded-full border border-accent/40" />
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent">
              <span
                className="absolute inset-0 rounded-full bg-accent"
                style={{ animation: 'pulse-ring 2.4s ease-out infinite' }}
              />
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-36 sm:px-6 lg:px-8 lg:pb-32 lg:pt-44">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
            style={{ animation: 'fade-up 0.6s ease both' }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-accent"
                style={{ animation: 'pulse-ring 2s ease-out infinite' }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Jiangsu Changhui Electric Co., Ltd. — Zhenjiang, China
          </div>

          <h1
            className="mt-6 font-display text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ animation: 'fade-up 0.7s ease both', animationDelay: '0.1s' }}
          >
            Custom Electrical{' '}
            <span className="text-accent">Distribution</span>
            {' '}&amp;{' '}
            <span className="text-accent">Switchgear</span>
            {' '}Solutions
          </h1>

          <p
            className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/80"
            style={{ animation: 'fade-up 0.7s ease both', animationDelay: '0.2s' }}
          >
            Professional manufacturer of HV &amp; LV switchgear, distribution boxes, busway
            systems and cable trays. Every unit engineered to your drawings — from single
            cabinets to full project supply.
          </p>

          <div
            className="mt-9 flex flex-wrap items-center gap-4"
            style={{ animation: 'fade-up 0.7s ease both', animationDelay: '0.3s' }}
          >
            <Link
              href="/products"
              className="sheen group relative inline-flex items-center gap-2 overflow-hidden rounded-md bg-accent px-6 py-3.5 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:-translate-y-0.5"
            >
              Explore Products
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/5 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              Request a Quote
            </Link>
          </div>

          <div
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
            style={{ animation: 'fade-up 0.7s ease both', animationDelay: '0.4s' }}
          >
            {badges.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-sm font-medium text-white/85">
                <b.icon className="h-4 w-4 text-accent" aria-hidden />
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category marquee */}
      <div className="relative border-y border-white/10 bg-primary/60 py-4 backdrop-blur-sm">
        <div className="flex overflow-hidden" aria-hidden>
          <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
            {[...productCategories, ...productCategories].map((p, i) => (
              <span
                key={`${p.slug}-${i}`}
                className="flex items-center gap-3 whitespace-nowrap text-sm font-medium uppercase tracking-wider text-white/70"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
