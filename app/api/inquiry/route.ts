import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

import {
  createSupabaseCaptchaContextFromEnv,
  verifyCaptchaSubmission,
} from '@/lib/inquiry-captcha'
import {
  buildInquiryPayload,
  validateInquiry,
  type InquirySubmission,
} from '@/lib/inquiries'

export async function POST(request: Request) {
  let input: InquirySubmission
  try {
    input = await request.json() as InquirySubmission
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const validation = validateInquiry(input)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.message }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  const secret = process.env.CAPTCHA_SECRET?.trim()
  if (!url || !anonKey || !tenantId || !secret) {
    return NextResponse.json({ error: 'Online inquiry is temporarily unavailable.' }, { status: 503 })
  }

  try {
    const { store, tenantId: captchaTenantId, siteScope } = createSupabaseCaptchaContextFromEnv()
    const captchaResult = await verifyCaptchaSubmission({
      secret,
      store,
      tenantId: captchaTenantId,
      siteScope,
      scope: String(input.captchaScope ?? ''),
      token: String(input.captchaToken ?? ''),
      answer: String(input.captchaAnswer ?? ''),
    })
    if (!captchaResult.ok) {
      return NextResponse.json(
        { error: 'Invalid or expired CAPTCHA. Please refresh and try again.' },
        { status: 400 },
      )
    }

    const client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { error } = await client.from('inquiries').insert(buildInquiryPayload(input, tenantId))
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[inquiries] server insert failed.', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'We could not send your inquiry. Please try again or contact us by email.' },
      { status: 502 },
    )
  }
}
