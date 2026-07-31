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
  const { company, stats } = await loadSiteData()

  assert.deepEqual(company.phones, ['+86-153-5862-3101', '+86-511-8888-1633'])
  assert.equal(
    company.factoryAddress,
    'No. 28, Yaoqiao Road, Yaoqiao Town, Zhenjiang New Area, Jiangsu, China',
  )
  assert.equal(stats.find(({ value }) => value === '25,000')?.label, 'Building Area')
  assert.equal('whatsapp' in company, false, 'an unconfirmed WhatsApp account must not be published')
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
  ]

  for (const [pattern, label] of forbidden) {
    assert.doesNotMatch(corpus, pattern, label)
  }

  const contactForm = await readProjectFile('components/contact-form.tsx')
  assert.doesNotMatch(contactForm, /window\.location|setSubmitted\(true\)/, 'the contact UI must not simulate success')
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
