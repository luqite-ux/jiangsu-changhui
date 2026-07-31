import { Mail, Phone, FileText } from 'lucide-react'
import { company } from '@/lib/site-data'

export function ContactForm() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold text-primary">Prepare Your Inquiry</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Include the product name, quantity, project requirements and any available drawings.
            Send the information directly by email or contact the company by phone.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={`mailto:${company.emails[0]}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Mail className="h-4 w-4" aria-hidden />
          Email an Inquiry
        </a>
        <a
          href={`tel:${company.phones[0].replace(/[^+\d]/g, '')}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-input bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Phone className="h-4 w-4" aria-hidden />
          Call {company.phones[0]}
        </a>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        This page does not display a submission confirmation unless a request has actually been sent.
      </p>
    </div>
  )
}
