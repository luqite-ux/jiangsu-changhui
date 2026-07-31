import { getSupabaseClient, getTenantId } from '@/lib/supabase'

export type InquiryInput = {
  name: string
  email: string
  phone?: string
  company?: string
  country?: string
  product?: string
  attachmentName?: string
  message: string
}

export function validateInquiry(
  input: InquiryInput,
): { ok: true } | { ok: false; message: string } {
  if (!input.name.trim() || !input.email.trim() || !input.message.trim()) {
    return { ok: false, message: 'Name, work email, and project requirements are required.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    return { ok: false, message: 'Please enter a valid work email.' }
  }
  return { ok: true }
}

export function buildInquiryPayload(input: InquiryInput, tenantId: string) {
  const context = [
    input.country?.trim() && `Country / Region: ${input.country.trim()}`,
    input.product?.trim() && `Product: ${input.product.trim()}`,
    input.attachmentName?.trim() && `Attachment filename: ${input.attachmentName.trim()}`,
  ].filter(Boolean)
  const product = input.product?.trim()

  return {
    tenant_id: tenantId,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    company: input.company?.trim() || null,
    subject: product ? `Website inquiry · ${product}` : 'Website inquiry',
    message: `${context.join('\n')}${context.length ? '\n\n' : ''}${input.message.trim()}`,
    status: 'unread',
  }
}

export async function submitInquiry(
  input: InquiryInput,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const validation = validateInquiry(input)
  if (!validation.ok) return validation

  const client = getSupabaseClient()
  const tenantId = getTenantId()
  if (!client || !tenantId) {
    return { ok: false, message: 'Online inquiry is temporarily unavailable. Please contact us by email or phone.' }
  }

  const { error } = await client.from('inquiries').insert(buildInquiryPayload(input, tenantId))
  if (error) {
    console.error('[inquiries] anonymous insert failed.', error.message)
    return { ok: false, message: 'We could not send your inquiry. Please try again or contact us by email.' }
  }

  return { ok: true }
}
