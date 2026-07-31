import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { processSteps } from '@/lib/site-data'

export function ProcessSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="How We Work"
        title="From Drawing to Delivery"
        description="A transparent, customer-focused process — from technical review through to factory-tested delivery and on-site support."
      />

      <div className="relative mt-16">
        {/* Horizontal connector line (desktop) */}
        <div
          className="absolute left-0 right-0 top-6 hidden h-px bg-border lg:block"
          aria-hidden
        />

        <ol className="relative grid gap-8 lg:grid-cols-5">
          {processSteps.map((s, i) => (
            <Reveal key={s.step} delay={i * 80}>
              <li className="relative flex flex-col">
                {/* Step indicator */}
                <div className="mb-5 flex items-center gap-3 lg:flex-col lg:items-start">
                  <span className="relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background font-display text-sm font-bold text-primary lg:h-14 lg:w-14">
                    {s.step}
                  </span>
                </div>

                <h3 className="font-display text-base font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
