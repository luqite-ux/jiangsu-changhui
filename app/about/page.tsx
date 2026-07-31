import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Target, Eye, HeartHandshake, ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { CountUp } from '@/components/count-up'
import { company, stats, photos } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Jiangsu Changhui Electric Co., Ltd. — an integrated R&D, design, manufacturing and sales enterprise specializing in high & low voltage electrical distribution equipment.',
}

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    desc: 'Your needs are our pursuit. We focus on customer requirements, detail and quality in every project we deliver.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    desc: 'To build "Chang Hui" into an internationally recognized electrical brand through innovation and reliability.',
  },
  {
    icon: HeartHandshake,
    title: 'Our Values',
    desc: 'Quality first, customer foremost — a global mindset with open, collaborative partnership on every project.',
  },
]

const commitments = [
  'A global outlook with an open, collaborative approach to every project.',
  'A first-class R&D team delivering forward-looking, individualized designs.',
  'High-caliber engineers providing professional, intelligent solutions.',
  'Modern management and equipment for efficient, high-quality products.',
  'A nationwide network delivering timely, attentive service.',
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb="About"
        eyebrow="Who We Are"
        title="Engineering Trusted Power Distribution Since Day One"
        description="Jiangsu Changhui Electric Co., Ltd. is an integrated R&D, design, manufacturing and sales enterprise, dedicated to building the internationally recognized electrical brand 'Chang Hui'."
      />

      {/* Intro */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative overflow-hidden rounded-2xl border border-border shadow-xl shadow-primary/10">
            <Image
              src={photos.factoryRoadD}
              alt="Jiangsu Changhui Electric — factory campus main road between production workshops in Yangzhong, Jiangsu"
              width={720}
              height={560}
              className="h-full w-full object-cover"
            />
          </Reveal>
          <Reveal delay={100}>
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              <span className="h-px w-6 bg-accent" />
              Company Profile
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-primary text-balance sm:text-4xl">
              A Professional Manufacturer of Complete Electrical Sets
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                {company.legalName} is a professional manufacturer and supplier of high & low
                voltage complete electrical equipment, busway systems, cable trays, support &
                hanger systems and related supporting products.
              </p>
              <p>
                Located in the beautiful river city of Yangzhong — adjacent to the Yangtze River
                port and the Shanghai–Nanjing expressway — our facility enjoys an exceptional
                geographic location. We uphold the philosophy of{' '}
                <span className="font-medium text-foreground">
                  &ldquo;focusing on customer needs, focusing on detail and quality.&rdquo;
                </span>
              </p>
              <p>
                Following the principle of &ldquo;quality first, customer foremost,&rdquo; we
                continuously develop new products and innovate to serve society with
                high-quality electrical solutions.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="text-center">
              <div className="font-display text-4xl font-bold text-primary">
                <CountUp value={s.value} />
                <span className="text-accent">{s.suffix}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Philosophy"
          title="Mission, Vision & Values"
          description="Everything we build is guided by a commitment to our customers and an ambition to grow Chang Hui into a global electrical brand."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <div className="group h-full rounded-xl border border-border bg-card p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <v.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-primary">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Commitments */}
      <section className="relative overflow-hidden bg-primary py-24">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-20" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <SectionHeading
            invert
            eyebrow="Our Promise"
            title="We Focus on Every One of Your Needs"
          />
          <div className="mt-12 grid gap-4 text-left sm:grid-cols-1">
            {commitments.map((c, i) => (
              <Reveal
                key={c}
                delay={i * 80}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-accent-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-white/85">{c}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <Link
              href="/contact"
              className="group mt-12 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:-translate-y-0.5"
            >
              Partner With Us
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
