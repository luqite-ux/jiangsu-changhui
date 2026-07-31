import Image from 'next/image'
import { Factory, ClipboardCheck, Wrench, Headset, Layers, Timer } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { photos } from '@/lib/site-data'

const features = [
  {
    icon: Factory,
    title: 'In-House Manufacturing',
    desc: 'Customer materials state a 25,000 m² building area and list 32 production-equipment entries across multiple equipment types.',
  },
  {
    icon: ClipboardCheck,
    title: 'Documented Quality Approach',
    desc: 'The supplied company materials describe incoming, in-process and factory inspection activities.',
  },
  {
    icon: Layers,
    title: 'Full Customisation',
    desc: 'OEM &amp; ODM support — every product built to your drawings, dimensions, materials and applicable standards.',
  },
  {
    icon: Timer,
    title: 'Reliable Lead Times',
    desc: 'Typical production lead time is stated as 15–45 days and varies by product and quantity; a supplied example gives about 50 days for 100 units.',
  },
  {
    icon: Wrench,
    title: 'On-Site Technical Support',
    desc: 'Qualified engineers support installation guidance, commissioning, performance testing and operator training.',
  },
  {
    icon: Headset,
    title: '2-Year Warranty',
    desc: 'Two-year free warranty on all equipment. Technical after-sales service continues beyond the warranty period.',
  },
]

export function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-primary py-24">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-20" aria-hidden />
      {/* Real factory campus image as subtle background */}
      <div className="absolute inset-0 -z-0 opacity-15">
        <Image
          src={photos.factoryRoadD}
          alt=""
          fill
          className="object-cover"
          aria-hidden
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          invert
          eyebrow="Why Chang Hui"
          title="An Experienced Manufacturing Partner"
          description="We combine large-format in-house production, rigorous quality control and responsive engineering support to deliver dependable electrical distribution equipment."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 100}>
              <div className="group h-full rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-accent/40 hover:bg-white/10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-accent-on-dark transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <f.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">{f.title}</h3>
                {/* eslint-disable-next-line react/no-danger */}
                <p className="mt-2 text-sm leading-relaxed text-white/80" dangerouslySetInnerHTML={{ __html: f.desc }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
