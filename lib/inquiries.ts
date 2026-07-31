import { getSupabaseClient, getTenantId } from '@/lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export type InquiryInput = {
  name: string
  email: string
  phone?: string
  company?: string
  country?: string
  product?: string
  attachmentName?: string
  privacyAccepted: boolean
  message: string
}

export function resolveInitialProduct(
  value: string | string[] | undefined,
  catalog: readonly string[],
): string | undefined {
  if (typeof value !== 'string') return undefined
  const candidate = value.trim()
  return catalog.find((name) => name === candidate)
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
  if (!input.privacyAccepted) {
    return { ok: false, message: 'Privacy consent is required before sending an inquiry.' }
  }
  return { ok: true }
}

export function buildInquiryPayload(input: InquiryInput, tenantId: string) {
  const context = [
    input.country?.trim() && `Country / Region: ${input.country.trim()}`,
    input.product?.trim() && `Product: ${input.product.trim()}`,
    input.attachmentName?.trim() && `Attachment filename: ${input.attachmentName.trim()}`,
    input.privacyAccepted && 'Privacy consent: accepted',
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

async function insertInquiry(
  input: InquiryInput,
  client: Pick<SupabaseClient, 'from'>,
  tenantId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { error } = await client.from('inquiries').insert(buildInquiryPayload(input, tenantId))
  if (error) {
    console.error('[inquiries] anonymous insert failed.', error.message)
    return { ok: false, message: 'We could not send your inquiry. Please try again or contact us by email.' }
  }

  return { ok: true }
}

export async function submitInquiryWithClient(
  input: InquiryInput,
  client: Pick<SupabaseClient, 'from'>,
  tenantId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const validation = validateInquiry(input)
  if (!validation.ok) return validation
  return insertInquiry(input, client, tenantId)
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

  return insertInquiry(input, client, tenantId)
}
