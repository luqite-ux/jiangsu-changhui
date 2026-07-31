import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Building2, Factory } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { ContactForm } from '@/components/contact-form'
import { company } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with CHANG HUI ELECTRIC (Jiangsu Changhui Electric Co., Ltd.) for quotations, technical support and OEM/ODM inquiries on switchgear, busway and cable tray systems.',
}

const contactCards = [
  {
    icon: Phone,
    title: 'Call Us',
    lines: company.phones,
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: company.emails,
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumb="Contact"
        eyebrow="Contact"
        title="Let's Power Your Next Project"
        description="Reach out with product names, quantities, drawings and project requirements for review."
      />

      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {contactCards.map((card, i) => (
              <Reveal key={card.title} delay={i * 90}>
                <div className="h-full rounded-2xl border border-border bg-card/70 p-7 backdrop-blur-sm transition-colors hover:border-primary/40">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-serif text-lg font-semibold text-foreground">{card.title}</h3>
                  <div className="mt-3 space-y-1">
                    {card.lines.map((line) => (
                      <p key={line} className="text-sm text-muted-foreground">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-5">
            <Reveal className="lg:col-span-3">
              <div className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-sm md:p-9">
                <h2 className="font-serif text-2xl font-bold text-foreground">Send an Inquiry</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Share your project requirements directly with the company by email or phone.
                </p>
                <div className="mt-7">
                  <ContactForm />
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-2">
              <div className="flex h-full flex-col gap-6">
                <div className="rounded-2xl border border-border bg-card/70 p-7 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h3 className="font-serif text-lg font-semibold text-foreground">Registered Office</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{company.address}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card/70 p-7 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Factory className="h-5 w-5 text-primary" />
                    <h3 className="font-serif text-lg font-semibold text-foreground">Manufacturing Base</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {company.factoryAddress}
                  </p>
                </div>
                <div className="flex flex-1 items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-7">
                  <MapPin className="h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-foreground">
                    The registered office and manufacturing base are separate addresses in Jiangsu; use the location details above when planning a visit.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
