import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { FaqAccordion } from '@/components/faq-accordion'
import { faqs } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about Chang Hui Electric products, pricing, samples, lead times and quality control for international buyers.',
}

export default function FaqPage() {
  return (
    <>
      <PageHero
        breadcrumb="FAQ"
        eyebrow="Support"
        title="Frequently Asked Questions"
        description="Answers to the questions overseas buyers ask most about our products, ordering, lead times and quality assurance."
      />

      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="space-y-14">
          {faqs.map((group, gi) => (
            <Reveal key={group.category} delay={gi * 60}>
              <div>
                <h2 className="mb-5 flex items-center gap-3 font-display text-xl font-bold text-primary">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 font-mono text-sm text-accent">
                    {String(gi + 1).padStart(2, '0')}
                  </span>
                  {group.category}
                </h2>
                <FaqAccordion items={group.items} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <h2 className="font-display text-2xl font-bold text-primary">Still have questions?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground text-pretty">
            Our team is happy to help with technical details, samples and custom requirements.
          </p>
          <Link
            href="/contact"
            className="group mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Contact Us
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>
    </>
  )
}
