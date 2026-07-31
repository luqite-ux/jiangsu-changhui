import type { Metadata } from 'next'
import Image from 'next/image'
import {
  Scissors,
  Cog,
  SprayCan,
  Boxes,
  FlaskConical,
  PackageCheck,
  ShieldCheck,
  Gauge,
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { CustomerVideoGallery } from '@/components/customer-video-gallery'
import { photos } from '@/lib/site-data'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Manufacturing & Quality Capabilities',
  description:
    'Explore the manufacturing processes and equipment described in Chang Hui Electric’s supplied company materials.',
  path: '/capabilities',
  image: photos.productionHallC,
})

const process = [
  {
    icon: Scissors,
    step: '01',
    title: 'Sheet Metal Fabrication',
    desc: 'CNC punching, laser cutting, shearing and bending with dimensional tolerance ≤ ±1mm.',
  },
  {
    icon: Cog,
    step: '02',
    title: 'Busbar Processing',
    desc: 'High-purity electrolytic copper (≥98% IACS) cut, punched, bent and tin-plated at contact faces.',
  },
  {
    icon: SprayCan,
    step: '03',
    title: 'Surface Treatment',
    desc: 'Pickling and phosphating followed by epoxy powder electrostatic coating with a film thickness of at least 60 μm and grade 1 adhesion.',
  },
  {
    icon: Boxes,
    step: '04',
    title: 'Assembly & Wiring',
    desc: 'Standardized primary & secondary wiring with hydraulic crimping and 100% interchangeable drawers.',
  },
  {
    icon: FlaskConical,
    step: '05',
    title: 'Testing & Inspection',
    desc: 'Mechanical, electrical and dielectric testing at defined hold points before release.',
  },
  {
    icon: PackageCheck,
    step: '06',
    title: 'Packaging & Delivery',
    desc: 'Standards-compliant packaging with full documentation, serial numbers and traceability.',
  },
]

const equipment = [
  { name: 'CNC Turret Punch Press', spec: 'Murata M-2044EZ / M-2048LT', use: 'Precision multi-hole punching' },
  { name: 'CNC Press Brakes', spec: '510032 / 504022 / 520032', use: 'Sheet-metal bending' },
  { name: 'Fiber Laser Cutting Machine', spec: 'JR3015F series, 1500 W', use: 'Sheet-metal cutting' },
  { name: 'Busbar Processing Center', spec: 'BM303-S-3-8 PII', use: 'Copper busbar shear/punch/bend' },
  { name: 'Electrostatic Powder Coating', spec: 'WL-2020-KST', use: 'Durable surface finishing' },
  { name: 'Laser Marking Machine', spec: 'BGR-T30W', use: 'Permanent nameplate marking' },
]

const testing = [
  'Power-frequency withstand voltage testing (up to 150 kV)',
  'Transformer ratio, capacity and load testing',
  'Microcomputer relay protection testing',
  'DC high-voltage and leakage-current testing',
  'Insulation and DC resistance measurement',
  'Loop and contact resistance testing',
  'Residual-current and dielectric-strength testing',
  'HV/LV switchgear energization test bench',
]

const qcTiers = [
  {
    icon: ShieldCheck,
    title: 'Incoming Material Control',
    desc: 'Every purchased component requires certificates and test reports; each batch is sampled and non-conforming lots are returned in full.',
  },
  {
    icon: Gauge,
    title: 'In-Process Control',
    desc: 'Five defined hold points require written QC release — from sheet metal to busbar, wiring and final assembly.',
  },
  {
    icon: PackageCheck,
    title: 'Factory & Type Testing',
    desc: 'The supplied company materials describe routine factory testing and state that type testing has been completed; report documents were not supplied for publication.',
  },
]

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        breadcrumb="Capabilities"
        eyebrow="Manufacturing & Quality"
        title="Vertically Integrated From Raw Steel to Tested Cabinets"
        description="The supplied company materials state a 42,000 m² site area and list 32 production-equipment entries across fabrication, handling and support equipment."
      />

      {/* Process */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Production Process"
          title="Six Controlled Stages of Manufacturing"
          description="A tightly managed workflow ensures consistency, quality and traceability on every order."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {process.map((p, i) => (
            <Reveal key={p.step} delay={(i % 3) * 100}>
              <div className="group relative h-full overflow-hidden rounded-xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                <span className="pointer-events-none absolute right-4 top-2 font-display text-6xl font-bold text-secondary transition-colors group-hover:text-accent/15">
                  {p.step}
                </span>
                <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="relative mt-5 font-display text-lg font-semibold text-primary">
                  {p.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Equipment */}
      <section className="relative overflow-hidden bg-primary py-24">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-20" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl">
              <Image
                src={photos.productionHallC}
                alt="Customer-supplied company photograph from Jiangsu Changhui Electric"
                width={720}
                height={540}
                className="h-full w-full object-cover"
              />
            </Reveal>
            <Reveal delay={100}>
              <SectionHeading
                invert
                align="left"
                eyebrow="Core Equipment"
                title="32 Listed Production-Equipment Entries"
              />
              <div className="mt-8 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                {equipment.map((e) => (
                  <div key={e.name} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-white">{e.name}</p>
                      <p className="text-sm text-white/80">{e.use}</p>
                    </div>
                    <span className="mt-1 inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-accent-on-dark sm:mt-0">
                      {e.spec}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testing */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Test Laboratory"
              title="Comprehensive In-House Electrical Testing"
              description="The listed in-house test equipment supports electrical performance and safety checks before products leave the factory."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {testing.map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm">
                  <FlaskConical className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent" />
                  <span className="text-foreground/85">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} className="relative overflow-hidden rounded-2xl border border-border shadow-xl shadow-primary/10">
            <Image
              src={photos.hvXgnOpenDoor}
              alt="Customer-supplied company photograph from Jiangsu Changhui Electric"
              width={720}
              height={620}
              className="h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* Quality control */}
      <section className="bg-secondary/60 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Quality Assurance"
            title="A Three-Tier Quality Control System"
            description="The supplied company materials describe quality checks from incoming materials through manufacturing and factory inspection."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {qcTiers.map((q, i) => (
              <Reveal key={q.title} delay={i * 100}>
                <div className="h-full rounded-xl border border-border bg-card p-8 shadow-sm">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <q.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-primary">{q.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{q.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CustomerVideoGallery />
    </>
  )
}
