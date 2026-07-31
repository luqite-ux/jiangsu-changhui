import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import ts from 'typescript'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

async function readProjectFile(relativePath) {
  return readFile(resolve(repositoryRoot, relativePath), 'utf8')
}

async function collectVisibleSource(directory) {
  const entries = await readdir(resolve(repositoryRoot, directory), { withFileTypes: true })
  const chunks = []

  for (const entry of entries) {
    const relativePath = `${directory}/${entry.name}`
    if (entry.isDirectory()) {
      chunks.push(...(await collectVisibleSource(relativePath)))
    } else if (['.ts', '.tsx'].includes(extname(entry.name))) {
      chunks.push({ relativePath, source: await readProjectFile(relativePath) })
    }
  }

  return chunks
}

async function loadSiteData() {
  const source = await readProjectFile('lib/site-data.ts')
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText
  return import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`)
}

test('published content contains only confirmed contact, address, area and equipment facts', async () => {
  const { company, productCategories, stats } = await loadSiteData()

  assert.deepEqual(company.phones, ['+86-153-5862-3101', '+86-511-8888-1633'])
  assert.equal(
    company.factoryAddress,
    'No. 28, Yaoqiao Road, Yaoqiao Town, Zhenjiang New Area, Jiangsu, China',
  )
  assert.equal(stats.find(({ value }) => value === '25,000')?.label, 'Building Area')
  assert.equal('whatsapp' in company, false, 'an unconfirmed WhatsApp account must not be published')
  assert.equal(productCategories.length, 6)
})

test('visible source excludes unsupported claims and all preview placeholders', async () => {
  const visibleSource = [
    ...(await collectVisibleSource('app')),
    ...(await collectVisibleSource('components')),
    { relativePath: 'lib/site-data.ts', source: await readProjectFile('lib/site-data.ts') },
  ]
  const corpus = visibleSource.map(({ relativePath, source }) => `\n/* ${relativePath} */\n${source}`).join('')

  const forbidden = [
    [/whatsapp|wa\.me/i, 'unconfirmed WhatsApp'],
    [/exporting worldwide|export-ready|24\s*[/×x]\s*7 export/i, 'unsupported export claim'],
    [/within one business day|quote within one business day/i, 'unsupported response promise'],
    [/32\+\s+(?:cnc|advanced manufacturing)/i, 'incorrect machine count'],
    [/3 overhead bridge cranes/i, 'incorrect crane count'],
    [/25,000\s*m²\s*workshop|workshop floor space/i, 'building area mislabeled as workshop'],
    [/frontend demonstration|news-content-pending|placeholder for future news/i, 'preview placeholder'],
    [/direct access to major export ports/i, 'unsupported logistics claim'],
    [/under one the quality system/i, 'broken capability sentence'],
    [/under one\s+a quality approach/i, 'broken capability sentence'],
    [/customer inspection welcome\./i, 'incomplete inspection sentence'],
    [/customers and third-party inspectors are welcome/i, 'unsupported third-party inspection claim'],
    [/full customisation/i, 'mixed British and American spelling'],
    [/Jiangsu Changhui Electric Co\., Ltd\.\./i, 'duplicate punctuation after legal name'],
    [/micro-computer relay/i, 'nonstandard microcomputer spelling'],
    [/\b150kV\b|\b60μm\b/, 'missing space between a value and its SI unit'],
    [/\b(?:catalogue|metres|customisation)\b/i, 'mixed British and American spelling'],
  ]

  for (const [pattern, label] of forbidden) {
    assert.doesNotMatch(corpus, pattern, label)
  }

  const contactForm = await readProjectFile('components/contact-form.tsx')
  assert.doesNotMatch(contactForm, /mailto:|window\.location|setSubmitted\(true\)|alert\(|console\.log|setTimeout/, 'the contact UI must not simulate success')
})

test('public English uses clear procurement terminology and consistent product names', async () => {
  const { faqs, products, stats } = await loadSiteData()

  assert.deepEqual(stats.find(({ label }) => label === 'Minimum Order Quantity'), {
    value: '1',
    suffix: ' Unit',
    label: 'Minimum Order Quantity',
  })
  assert.deepEqual(stats.find(({ label }) => label === 'Warranty Period'), {
    value: '2',
    suffix: ' Years',
    label: 'Warranty Period',
  })

  const names = new Map(products.map(({ slug, name }) => [slug, name]))
  assert.equal(names.get('hxgn-12'), 'HXGN□-12 AC Metal-Enclosed Ring Main Unit')
  assert.equal(names.get('box-substation'), 'Box-Type Substation Series (European-Type)')
  assert.equal(names.get('xqj-c-trough'), 'XQJ-C Trough-Type Cable Tray')
  assert.equal(names.get('xqj-p-tray'), 'XQJ-P Tray-Type Cable Tray')
  assert.equal(names.get('xqj-t-ladder'), 'XQJ-T Ladder-Type Cable Tray')

  const faqCorpus = JSON.stringify(faqs)
  assert.doesNotMatch(faqCorpus, /third-party inspection/i)
  assert.match(faqCorpus, /customer inspection/i)
})

test('the production English correction script is locked to Jiangsu Changhui', async () => {
  const module = await import('../scripts/update-jiangsu-changhui-product-english.mjs')
  const row = { tenant_id: module.TENANT_ID, slug: 'xqj-p-tray' }

  assert.deepEqual(module.buildNamePatch(row), {
    name: 'XQJ-P Tray-Type Cable Tray',
    name_en: 'XQJ-P Tray-Type Cable Tray',
  })
  assert.throws(
    () => module.buildNamePatch({ ...row, tenant_id: '00000000-0000-0000-0000-000000000000' }),
    /outside tenant/,
  )
})

test('inquiry form preserves all required lead fields for real submission', async () => {
  const form = await readProjectFile('components/contact-form.tsx')

  assert.match(form, /<form\b/)
  for (const field of ['name', 'email', 'phone', 'company', 'country', 'product', 'message', 'attachment', 'privacy']) {
    assert.match(form, new RegExp(`name=["']${field}["']`), `missing inquiry field: ${field}`)
  }
  assert.match(form, /name="attachment"[\s\S]*?type="file"|type="file"[\s\S]*?name="attachment"/)
  assert.match(form, /name="privacy"[\s\S]*?required/)
  assert.match(form, /submitInquiry/)
  assert.doesNotMatch(form, /online submission is being connected/i)
  assert.doesNotMatch(form, /type="submit"[\s\S]*?disabled(?:\s|>)/)
})

test('small text contrast classes and reduced-motion fallbacks stay compliant', async () => {
  const visibleSource = [
    ...(await collectVisibleSource('app')),
    ...(await collectVisibleSource('components')),
  ].map(({ source }) => source).join('\n')
  const styles = await readProjectFile('app/globals.css')

  assert.doesNotMatch(visibleSource, /text-white\/(?:50|55|60|65)\b/)
  assert.doesNotMatch(visibleSource, /text-foreground\/60\b/)
  assert.match(styles, /prefers-reduced-motion:[\s\S]*animation-delay:\s*0(?:ms|s)\s*!important/)
  assert.match(styles, /prefers-reduced-motion:[\s\S]*transition-delay:\s*0(?:ms|s)\s*!important/)
  assert.match(styles, /\.reveal\s*\{[^}]*opacity:\s*1\s*!important[^}]*transform:\s*none\s*!important/s)
})

test('Vercel Analytics is not injected by a local production server', async () => {
  const layout = await readProjectFile('app/layout.tsx')

  assert.match(layout, /process\.env\.NODE_ENV === 'production'[\s\S]*?process\.env\.VERCEL/)
})

test('news contains no placeholder article and product copy stays within supplied evidence', async () => {
  const { newsArticles, products } = await loadSiteData()

  assert.equal(newsArticles.length, 3)
  assert.ok(newsArticles.every((article) => !/pending|placeholder/i.test(`${article.slug} ${article.title} ${article.body}`)))
  assert.equal(products.length, 27)
  for (const product of products) {
    assert.match(product.description, /customer-supplied product list/i)
    assert.match(product.customNote, /drawings|requirements/i)
    assert.match(product.image, /^\/products\//, `${product.slug} must use a neutral category illustration`)
    assert.deepEqual(product.images, [product.image], `${product.slug} must not claim unverified photos are that model`)
  }
})
