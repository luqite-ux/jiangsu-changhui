import Image from 'next/image'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { customerRefreshPublicUrl } from '@/lib/customer-product-image-refresh.mjs'

const industries = [
  { label: 'Solar Power', image: customerRefreshPublicUrl('industry-solar') },
  { label: 'Power Grid & Utilities', image: customerRefreshPublicUrl('industry-grid') },
  { label: 'Commercial Complexes', image: customerRefreshPublicUrl('industry-mixed-use') },
  { label: 'Wind Power', image: customerRefreshPublicUrl('industry-wind') },
  { label: 'Rail Transportation', image: customerRefreshPublicUrl('industry-high-speed-rail') },
  { label: 'Transmission Infrastructure', image: customerRefreshPublicUrl('advertising-composite-two') },
]

export function IndustriesSection() {
  return (
    <section className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Industries Served"
          title="Electrical Equipment Across Key Sectors"
          description="Customer materials list applications across industry, utilities, healthcare, buildings, research, logistics and transportation."
        />

        <Reveal>
          <ul
            className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {industries.map((ind) => {
              return (
                <li
                  key={ind.label}
                  className="group relative isolate min-h-56 overflow-hidden rounded-xl border border-white/20 bg-slate-900 text-white shadow-sm"
                >
                  <Image
                    src={ind.image}
                    alt={`${ind.label} application context`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/25 to-transparent" aria-hidden />
                  <span className="relative z-10 flex min-h-56 items-end p-6 text-lg font-semibold text-white">
                    {ind.label}
                  </span>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
