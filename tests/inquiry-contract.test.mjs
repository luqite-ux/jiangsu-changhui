import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
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

test('inquiry validation rejects missing lead details and malformed email', async () => {
  const { validateInquiry } = await loadInquiryHelpers()
  const valid = {
    name: 'Ada Buyer',
    email: 'ada@example.com',
    phone: '',
    company: 'Example Power',
    country: 'Singapore',
    product: 'Busway Systems',
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
  assert.deepEqual(validateInquiry(valid), { ok: true })
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
      product: ' Busway Systems ',
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
    subject: 'Website inquiry · Busway Systems',
    message: 'Country / Region: Singapore\nProduct: Busway Systems\n\nPlease quote 20 metres.',
    status: 'unread',
  })
  assert.match(source, /from\(["']inquiries["']\)\.insert\(/)
  assert.doesNotMatch(source, /SERVICE_ROLE|service.role/i)
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
