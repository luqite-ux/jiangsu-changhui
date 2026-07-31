import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, ClipboardCheck, FlaskConical, PackageCheck, ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { photos } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Quality Assurance',
  description:
    'Chang Hui Electric ISO 9001 quality management — three-tier quality control covering incoming materials, in-process inspection, factory acceptance testing and full traceability.',
}

const tiers = [
  {
    icon: ShieldCheck,
    step: '01',
    title: 'Incoming Material Control',
    desc: 'Every purchased component requires certificates and test reports. Each batch is sampled on arrival; non-conforming lots are returned in full before entering the production floor.',
  },
  {
    icon: ClipboardCheck,
    step: '02',
    title: 'In-Process Inspection',
    desc: 'Five defined hold points require written QC sign-off — sheet metal forming, bus assembly, wiring, final assembly and pre-test. Production cannot advance past a hold point without release.',
  },
  {
    icon: FlaskConical,
    step: '03',
    title: 'Factory Acceptance Testing',
    desc: 'Every unit undergoes insulation resistance, circuit continuity, protection relay verification and dielectric withstand tests before release. Customers and third-party inspectors are welcome.',
  },
  {
    icon: PackageCheck,
    step: '04',
    title: 'Traceability & Records',
    desc: 'Each product carries a unique serial number linked to full quality records throughout production — enabling end-to-end traceability from raw material through to delivery.',
  },
]

const certifications = [
  { label: 'Quality System', value: 'ISO 9001 Quality Management System' },
  { label: 'Warranty', value: '2-year free warranty from delivery' },
  { label: 'After-sales Response', value: 'Within 1 hour for technical support requests' },
  { label: 'Type Tests', value: '7 type-test reports covering temperature rise, dielectric, short-circuit withstand and protection ratings' },
]

const testCapabilities = [
  'Power-frequency withstand voltage test (up to 150 kV)',
  'Transformer ratio, capacity and load testing',
  'Micro-computer relay protection testing',
  'DC high-voltage generator and leakage current test',
  'Insulation and DC resistance measurement',
  'Loop resistance and contact resistance testing',
  'Residual current and dielectric strength testing',
  'HV/LV switchgear energization test bench',
]

export default function QualityPage() {
  return (
    <>
      <PageHero
        breadcrumb="Quality"
        eyebrow="Quality Assurance"
        title="ISO 9001 Quality Throughout Every Stage"
        description="Our three-tier quality control system covers incoming materials, in-process inspection and factory acceptance testing — with full serial-number traceability on every unit."
      />

      {/* Three-tier overview */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Quality Control"
          title="A Three-Tier Quality System"
          description="Under ISO 9001, quality is controlled across the full production lifecycle — from raw materials through to on-site commissioning support."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t, i) => (
            <Reveal key={t.step} delay={(i % 4) * 80}>
              <div className="group h-full rounded-xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <t.icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="mt-4 block font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Step {t.step}
                </span>
                <h3 className="mt-1 font-display text-base font-semibold text-primary">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Certifications + test lab */}
      <section className="relative overflow-hidden bg-primary py-24">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-20" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl">
              <Image
                src={photos.hvXgnOpenDoor}
                alt="Factory acceptance inspection — XGN-40.5G switchgear with door open showing internal wiring and relay compartment"
                width={720}
                height={540}
                className="h-full w-full object-cover"
              />
            </Reveal>
            <Reveal delay={100}>
              <SectionHeading
                invert
                align="left"
                eyebrow="Certifications & Standards"
                title="Built to Last, Documented to Prove It"
              />
              <dl className="mt-8 space-y-4">
                {certifications.map((c) => (
                  <div key={c.label} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-white/55">{c.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-white">{c.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Test lab capabilities */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Test Laboratory"
              title="Comprehensive In-House Electrical Testing"
              description="Our fully equipped on-site test lab verifies performance and safety before any product leaves the factory."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {testCapabilities.map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm">
                  <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span className="text-foreground/85">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} className="relative overflow-hidden rounded-2xl border border-border shadow-xl shadow-primary/10">
            <Image
              src={photos.productionHallC}
              alt="Chang Hui Electric production bay — LV cabinet assemblies and enclosures in production"
              width={720}
              height={620}
              className="h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center shadow-xl shadow-primary/20 sm:px-12">
          <div className="pointer-events-none absolute inset-0 tech-grid opacity-25" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-2xl font-bold text-white text-balance sm:text-3xl">
              Request Inspection or Test Reports
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80 text-pretty">
              Customer inspection before shipment is always welcome. Contact us to arrange or to request test records for any order.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:-translate-y-0.5"
            >
              Contact Us
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
