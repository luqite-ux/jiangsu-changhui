import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToFileURL } from 'node:url'
import test from 'node:test'
import ts from 'typescript'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const readProjectFile = (relativePath) =>
  readFile(resolve(repositoryRoot, relativePath), 'utf8')

async function loadInquiryHelpers() {
  const source = (await readProjectFile('lib/inquiries.ts')).replace(/^import[^\n]+\n/gm, '')
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText
  return import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`)
}

async function loadSiteData() {
  return import(pathToFileURL(resolve(repositoryRoot, 'lib/site-data.ts')).href)
}

test('inquiry validation rejects missing lead details and malformed email', async () => {
  const { validateInquiry } = await loadInquiryHelpers()
  const valid = {
    name: 'Ada Buyer',
    email: 'ada@example.com',
    phone: '',
    company: 'Example Power',
    country: 'Singapore',
    product: 'KYN28-12 Metal-Clad Withdrawable AC Switchgear',
    privacyAccepted: true,
    message: 'Please quote 20 metres for our project.',
  }

  assert.deepEqual(validateInquiry({ ...valid, name: ' ' }), {
    ok: false,
    message: 'Name, work email, and project requirements are required.',
  })
  assert.deepEqual(validateInquiry({ ...valid, email: 'invalid' }), {
    ok: false,
    message: 'Please enter a valid work email.',
  })
  assert.deepEqual(validateInquiry({ ...valid, privacyAccepted: false }), {
    ok: false,
    message: 'Privacy consent is required before sending an inquiry.',
  })
  assert.deepEqual(validateInquiry(valid), { ok: true })
})

test('contact product query accepts one exact catalog model and ignores arbitrary values', async () => {
  const { resolveInitialProduct } = await loadInquiryHelpers()
  const { products } = await loadSiteData()
  const productNames = products.map(({ name }) => name)
  const exactModel = 'KYN28-12 Metal-Clad Withdrawable AC Switchgear'

  assert.equal(productNames.length, 27)
  assert.equal(resolveInitialProduct(exactModel, productNames), exactModel)
  assert.equal(resolveInitialProduct(` ${exactModel} `, productNames), exactModel)
  assert.equal(resolveInitialProduct('arbitrary-model', productNames), undefined)
  assert.equal(resolveInitialProduct([exactModel], productNames), undefined)
})

test('inquiry payload preserves every supported lead field without service credentials', async () => {
  const source = await readProjectFile('lib/inquiries.ts')
  const { buildInquiryPayload } = await loadInquiryHelpers()
  const payload = buildInquiryPayload(
    {
      name: ' Ada Buyer ',
      email: ' ada@example.com ',
      phone: ' +65 5555 ',
      company: ' Example Power ',
      country: ' Singapore ',
      product: ' KYN28-12 Metal-Clad Withdrawable AC Switchgear ',
      attachmentName: ' single-line.pdf ',
      privacyAccepted: true,
      message: ' Please quote 20 metres. ',
    },
    'tenant-test',
  )

  assert.deepEqual(payload, {
    tenant_id: 'tenant-test',
    name: 'Ada Buyer',
    email: 'ada@example.com',
    phone: '+65 5555',
    company: 'Example Power',
    subject: 'Website inquiry · KYN28-12 Metal-Clad Withdrawable AC Switchgear',
    message:
      'Country / Region: Singapore\nProduct: KYN28-12 Metal-Clad Withdrawable AC Switchgear\nAttachment filename: single-line.pdf\nPrivacy consent: accepted\n\nPlease quote 20 metres.',
    status: 'unread',
  })
  const route = await readProjectFile('app/api/inquiry/route.ts')
  assert.match(route, /from\(["']inquiries["']\)\.insert\(/)
  assert.ok(route.indexOf('verifyCaptchaSubmission(') < route.search(/from\(["']inquiries["']\)\.insert\(/))
  assert.doesNotMatch(source, /SERVICE_ROLE|service.role/i)
})

test('inquiry submission posts the complete lead and CAPTCHA to the server route', async () => {
  const { submitInquiry } = await loadInquiryHelpers()
  let request
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, init) => {
    request = { url, init }
    return Response.json({ ok: true })
  }
  const input = {
    name: 'Ada Buyer',
    email: 'ada@example.com',
    phone: '+65 5555',
    company: 'Example Power',
    country: 'Singapore',
    product: 'KYN28-12 Metal-Clad Withdrawable AC Switchgear',
    attachmentName: 'single-line.pdf',
    privacyAccepted: true,
    message: 'Please quote 20 metres.',
    captchaScope: 'captcha_test_scope_123456',
    captchaToken: 'signed-token',
    captchaAnswer: 'ABCD',
  }

  try {
    assert.deepEqual(await submitInquiry(input), { ok: true })
  } finally {
    globalThis.fetch = originalFetch
  }
  assert.equal(request.url, '/api/inquiry')
  assert.deepEqual(JSON.parse(request.init.body), input)
})

test('inquiry submission exposes a safe server failure without client persistence', async () => {
  const { submitInquiry } = await loadInquiryHelpers()
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => Response.json(
    { error: 'We could not send your inquiry. Please try again or contact us by email.' },
    { status: 502 },
  )
  try {
    assert.deepEqual(await submitInquiry({
      name: 'Ada Buyer',
      email: 'ada@example.com',
      privacyAccepted: true,
      message: 'Please quote 20 metres.',
      captchaScope: 'captcha_test_scope_123456',
      captchaToken: 'signed-token',
      captchaAnswer: 'ABCD',
    }), {
      ok: false,
      message: 'We could not send your inquiry. Please try again or contact us by email.',
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('contact page passes only a validated exact model into the visible form', async () => {
  const page = await readProjectFile('app/contact/page.tsx')
  const form = await readProjectFile('components/contact-form.tsx')

  assert.match(page, /searchParams/)
  assert.match(page, /resolveInitialProduct/)
  assert.match(page, /products\.map/)
  assert.match(page, /<ContactForm\s+initialProduct=\{initialProduct\}/)
  assert.match(form, /initialProduct\?: string/)
  assert.match(form, /value=\{initialProduct\}/)
  assert.match(form, /privacyAccepted:\s*data\.get\(['"]privacy['"]\)\s*===\s*['"]accepted['"]/)
})

test('the contact form submits once, clears on success, and reports both outcomes', async () => {
  const source = await readProjectFile('components/contact-form.tsx')

  assert.match(source, /^['"]use client['"]/m)
  assert.match(source, /submitInquiry/)
  assert.match(source, /if\s*\(isSubmitting\)\s*return/)
  assert.match(source, /setIsSubmitting\(true\)/)
  assert.match(source, /form\.reset\(\)/)
  assert.match(source, /role=["']status["']/)
  assert.match(source, /role=["']alert["']/)
  assert.match(source, /disabled=\{isSubmitting\}/)
  assert.match(source, /Sending inquiry/)
  assert.match(source, /Inquiry sent successfully/)
  assert.doesNotMatch(source, /setTimeout|alert\(|console\.log/)
})
