'use client'

import { type FormEvent, useState } from 'react'
import { FileUp, LoaderCircle, Send } from 'lucide-react'
import { submitInquiry, type InquiryInput } from '@/lib/inquiries'

const inputClass =
  'w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25'

type ContactFormProps = {
  initialProduct?: string
}

export function ContactForm({ initialProduct }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const form = event.currentTarget
    const data = new FormData(form)
    const attachment = data.get('attachment')
    const input: InquiryInput = {
      name: String(data.get('name') || ''),
      email: String(data.get('email') || ''),
      phone: String(data.get('phone') || ''),
      company: String(data.get('company') || ''),
      country: String(data.get('country') || ''),
      product: String(data.get('product') || ''),
      attachmentName: attachment instanceof File && attachment.size > 0 ? attachment.name : '',
      privacyAccepted: data.get('privacy') === 'accepted',
      message: String(data.get('message') || ''),
    }

    setIsSubmitting(true)
    setResult(null)
    try {
      const response = await submitInquiry(input)
      if (response.ok) {
        form.reset()
        setResult({ type: 'success', message: 'Inquiry sent successfully. Thank you for contacting us.' })
      } else {
        setResult({ type: 'error', message: response.message })
      }
    } catch {
      setResult({ type: 'error', message: 'We could not send your inquiry. Please try again or contact us by email.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
      aria-describedby="inquiry-connection-status"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="inquiry-name" className="mb-1.5 block text-sm font-medium text-foreground">
            Full name <span className="text-accent">*</span>
          </label>
          <input id="inquiry-name" name="name" autoComplete="name" required className={inputClass} />
        </div>

        <div>
          <label htmlFor="inquiry-email" className="mb-1.5 block text-sm font-medium text-foreground">
            Work email <span className="text-accent">*</span>
          </label>
          <input id="inquiry-email" name="email" type="email" autoComplete="email" required className={inputClass} />
        </div>

        <div>
          <label htmlFor="inquiry-phone" className="mb-1.5 block text-sm font-medium text-foreground">
            Phone
          </label>
          <input id="inquiry-phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </div>

        <div>
          <label htmlFor="inquiry-company" className="mb-1.5 block text-sm font-medium text-foreground">
            Company
          </label>
          <input id="inquiry-company" name="company" autoComplete="organization" className={inputClass} />
        </div>

        <div>
          <label htmlFor="inquiry-country" className="mb-1.5 block text-sm font-medium text-foreground">
            Country / region
          </label>
          <input id="inquiry-country" name="country" autoComplete="country-name" className={inputClass} />
        </div>

        <div>
          <label htmlFor="inquiry-product" className="mb-1.5 block text-sm font-medium text-foreground">
            Product of interest
          </label>
          {initialProduct ? (
            <input id="inquiry-product" name="product" value={initialProduct} readOnly className={inputClass} />
          ) : (
            <select id="inquiry-product" name="product" defaultValue="" className={inputClass}>
              <option value="" disabled>Select a category</option>
              <option>High Voltage Switchgear</option>
              <option>Low Voltage Switchgear</option>
              <option>Distribution Boxes</option>
              <option>Box-Type Substations</option>
              <option>Busway Systems</option>
              <option>Cable Tray Systems</option>
              <option>Other / Custom</option>
            </select>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="inquiry-message" className="mb-1.5 block text-sm font-medium text-foreground">
            Project requirements <span className="text-accent">*</span>
          </label>
          <textarea
            id="inquiry-message"
            name="message"
            required
            rows={6}
            className={inputClass}
            placeholder="Describe quantities, voltage class, delivery needs and available drawings."
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="inquiry-attachment" className="mb-1.5 block text-sm font-medium text-foreground">
            Drawing or specification
          </label>
          <label
            htmlFor="inquiry-attachment"
            className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-input bg-secondary/40 px-4 py-5 text-center transition-colors hover:border-primary"
          >
            <FileUp className="h-6 w-6 text-primary" aria-hidden />
            <span className="mt-2 text-sm font-medium text-foreground">Choose a file</span>
            <span className="mt-1 text-xs text-muted-foreground">PDF, DOC, DOCX, XLS, XLSX, PNG or JPG</span>
          </label>
          <input
            id="inquiry-attachment"
            name="attachment"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            className="sr-only"
          />
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            The selected filename is included with your inquiry; our team will arrange secure document transfer when replying.
          </p>
        </div>

        <label className="flex items-start gap-3 text-sm leading-relaxed text-foreground sm:col-span-2">
          <input
            name="privacy"
            type="checkbox"
            value="accepted"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-primary"
          />
          <span>I consent to the use of these details to respond to this business inquiry.</span>
        </label>
      </div>

      {result?.type === 'success' && (
        <div id="inquiry-connection-status" role="status" className="mt-6 rounded-md border border-emerald-700/40 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {result.message}
        </div>
      )}
      {result?.type === 'error' && (
        <div id="inquiry-connection-status" role="alert" className="mt-6 rounded-md border border-red-700/40 bg-red-50 px-4 py-3 text-sm text-red-900">
          {result.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
      >
        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
        {isSubmitting ? 'Sending inquiry…' : 'Send Inquiry'}
      </button>
    </form>
  )
}
