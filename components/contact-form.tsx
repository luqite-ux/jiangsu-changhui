'use client'

import { useState, type FormEvent } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { company } from '@/lib/site-data'

const inputClass =
  'w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const subject = encodeURIComponent(`Inquiry from ${data.get('name') || 'Website'}`)
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nCompany: ${data.get('company')}\nEmail: ${data.get('email')}\nCountry: ${data.get('country')}\nProduct: ${data.get('product')}\n\nMessage:\n${data.get('message')}`,
    )
    // Open the user's email client pre-filled with their inquiry.
    window.location.href = `mailto:${company.emails[0]}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-10 text-center shadow-sm">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold text-primary">Thank you!</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Your email client should now be open with your inquiry. If not, please email us directly
          at{' '}
          <a href={`mailto:${company.emails[0]}`} className="font-medium text-accent">
            {company.emails[0]}
          </a>
          . We typically respond within one business day.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
            Full name <span className="text-accent">*</span>
          </label>
          <input id="name" name="name" required className={inputClass} placeholder="John Smith" />
        </div>
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-foreground">
            Company
          </label>
          <input id="company" name="company" className={inputClass} placeholder="Your company" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-foreground">
            Country / Region
          </label>
          <input id="country" name="country" className={inputClass} placeholder="e.g. Germany" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="product" className="mb-1.5 block text-sm font-medium text-foreground">
            Product of interest
          </label>
          <select id="product" name="product" className={inputClass} defaultValue="">
            <option value="" disabled>
              Select a product category
            </option>
            <option>High Voltage Switchgear</option>
            <option>Low Voltage Switchgear</option>
            <option>Distribution Boxes</option>
            <option>Busway Systems</option>
            <option>Cable Tray Systems</option>
            <option>Box-Type Substations</option>
            <option>Other / Custom</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
            Message <span className="text-accent">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className={inputClass}
            placeholder="Tell us about your project, quantities, drawings or specifications..."
          />
        </div>
      </div>

      <button
        type="submit"
        className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-primary/90 sm:w-auto"
      >
        Send Inquiry
        <Send className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  )
}
