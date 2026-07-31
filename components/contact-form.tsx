import { FileUp, Send } from 'lucide-react'

const inputClass =
  'w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25'

export function ContactForm() {
  return (
    <form
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
        </div>

        <label className="flex items-start gap-3 text-sm leading-relaxed text-foreground sm:col-span-2">
          <input
            name="privacy"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-primary"
          />
          <span>I consent to the use of these details to respond to this business inquiry.</span>
        </label>
      </div>

      <div
        id="inquiry-connection-status"
        role="status"
        className="mt-6 rounded-md border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground"
      >
        Online submission is being connected. The form is available for field review but cannot be sent yet.
      </div>

      <button
        type="submit"
        disabled
        className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-primary/65 px-6 py-3.5 text-base font-semibold text-primary-foreground sm:w-auto"
      >
        <Send className="h-4 w-4" aria-hidden />
        Online submission coming soon
      </button>
    </form>
  )
}
