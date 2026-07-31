import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { photos } from '@/lib/site-data'

const points = [
  'Full sheet-metal fabrication: CNC punching, bending, laser cutting & press-braking',
  'High-purity electrolytic copper busbar processing (≥98% IACS)',
  'Epoxy powder electrostatic coating with ≥60 μm film thickness',
  'In-house electrical test lab: dielectric, insulation resistance, DC resistance & AC withstand',
  '32+ CNC processing machines and 3 overhead bridge cranes',
]

export function CapabilitiesPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-xl shadow-primary/10">
            <Image
              src={photos.productionHallC}
              alt="Chang Hui Electric production floor — LV cabinet assemblies and box-substation enclosures being prepared"
              width={720}
              height={540}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Floating stat card */}
          <div className="absolute -bottom-6 -right-4 hidden rounded-xl border border-border bg-card p-5 shadow-lg sm:block">
            <p className="font-display text-3xl font-bold text-primary">32+</p>
            <p className="text-sm text-muted-foreground">CNC &amp; processing machines</p>
          </div>
          <div className="animate-float-slow absolute -left-4 -top-4 hidden rounded-xl bg-accent p-4 text-accent-foreground shadow-lg md:block">
            <p className="font-display text-2xl font-bold">ISO 9001</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            <span className="h-px w-6 bg-accent" aria-hidden />
            Capabilities
          </span>
          <h2 className="mt-3 font-display text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            From Raw Steel to Fully Tested Cabinets
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Our vertically integrated workshops control every stage of production — sheet metal,
            busbar processing, surface treatment, assembly and electrical testing — under one
            ISO 9001 quality system.
          </p>
          <ul className="mt-6 space-y-3" role="list">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <span className="text-foreground/85">{p}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/capabilities"
            className="group mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Explore Our Capabilities
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
