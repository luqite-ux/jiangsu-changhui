import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import ts from 'typescript'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const r2Base = 'https://pub-c7a22068052144a5805830c30d280128.r2.dev/v0-design-assets/jiangsu-changhui/'
const brandFreeBase = `${r2Base}brand-free/`
const imageFiles = [
  'LOGO.png',
  '02f2c9b85494be5f6063823e28e5665f.jpg',
  '07aa12b7ec089769602cf99396ad4717.jpg',
  '145d8f2fb35cde497a78de753733de09.jpg',
  '246d07276ec814ad150bfa9b0743524b.jpg',
  '30d699934a9dc20b49d07ccb91fa1cef.jpg',
  '31da433f19c652ef226adf68587f0afd.jpg',
  '387e1063a6c0345b8c690c4a64cd7b7d.jpg',
  '3e9c2d13f4aee978503506a95c46f298.jpg',
  '41a7662e2280501fc87a68d90e51c191.jpg',
  '5c14f20c11cae0e7c9617cdd638846fd.jpg',
  '5db473a5465b7db0c12cc26e0c1843cc.jpg',
  '60a2398278c02f4d6441f2c715df5a6f.jpg',
  '72df68df4bc1cfa526bb3ae4da3d4f06.jpg',
  '74555b5dbc17d0e1f4dbd000e97d0cda.jpg',
  '95cdd4127a66a1c65e08bc0b816e41e4.jpg',
  '9f207edbf52231ba32365ec49be9a90d.jpg',
  'bfb6243b6e876212a40c6c1f97cd18d2.jpg',
  'd9fdc25dc385d622514d29fad41d86dc.jpg',
  'dc66751b92bf3bd2a4edc3589a63270d.jpg',
  'e4915e3ee3bcf118efd515fa321ab0a5.jpg',
  'f0b42be9bff25d93aea867d94460452e.jpg',
  'fa5cc2105a12324374ce3e47e9e7c65d.jpg',
  'fcabfea35ff10fbd7d0106d729a26390.jpg',
]
const videoFiles = [
  '6ac3922c83d45e180deaaa40ed76094a.mp4',
  '71567e513fa6260a173a4f721bb6cb50.mp4',
  '8a23dc13e83287e70477bd094f7c134d.mp4',
  'a606292cd803c6034f21c14a4e93a42c.mp4',
  'fe632746fdfc968d086c2afb3dfe63b2.mp4',
]

async function readProjectFile(relativePath) {
  return readFile(resolve(repositoryRoot, relativePath), 'utf8')
}

async function listFilesRecursively(directory) {
  const absoluteDirectory = resolve(repositoryRoot, directory)
  const entries = await readdir(absoluteDirectory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absolutePath = join(absoluteDirectory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursively(relative(repositoryRoot, absolutePath))))
    } else {
      files.push(relative(repositoryRoot, absolutePath).replaceAll('\\', '/'))
    }
  }

  return files
}

async function loadSiteData() {
  const source = await readProjectFile('lib/site-data.ts')
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText
  return import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`)
}

test('all 24 confirmed image assets are present once in the customer media collection', async () => {
  const { customerImageAssets, photos } = await loadSiteData()
  const expected = [`${r2Base}${imageFiles[0]}`, ...imageFiles.slice(1).map((file) => `${brandFreeBase}${file}`)]

  assert.equal(photos.logo, expected[0])
  assert.deepEqual(customerImageAssets.map(({ src }) => src), expected.slice(1))
  assert.equal(new Set(customerImageAssets.map(({ src }) => src)).size, 23)
  assert.ok(customerImageAssets.every(({ alt, caption }) => alt.length > 0 && caption.length > 0))
})

test('all five confirmed videos flow through the accessible native video gallery', async () => {
  const { customerVideos } = await loadSiteData()
  const gallery = await readProjectFile('components/customer-video-gallery.tsx')
  const capabilitiesPage = await readProjectFile('app/capabilities/page.tsx')

  assert.deepEqual(customerVideos.map(({ src }) => src), videoFiles.map((file) => `${r2Base}${file}`))
  assert.ok(customerVideos.every(({ title, description }) => /customer-supplied/i.test(`${title} ${description}`)))
  assert.equal(new Set(customerVideos.map(({ trackSrc }) => trackSrc)).size, 5)
  assert.ok(customerVideos.every(({ trackSrc }) => /^\/captions\/[\w-]+\.vtt$/.test(trackSrc)))
  for (const video of customerVideos) {
    const vtt = await readProjectFile(`public${video.trackSrc}`)
    assert.match(vtt, /^WEBVTT\s/m)
    assert.match(vtt, /\d{2}:\d{2}\.\d{3}\s+-->\s+\d{2}:\d{2}\.\d{3}/)
    assert.doesNotMatch(vtt, /No transcript or editorial narration was included/i)
    assert.ok(vtt.replace(/^WEBVTT\s*/, '').trim().length > 40, `${video.trackSrc} must contain useful timed captions`)
  }
  assert.match(gallery, /customerVideos\.map/)
  assert.match(gallery, /<video[\s\S]*?controls[\s\S]*?playsInline/)
  assert.match(gallery, /<track[\s\S]*?kind="captions"/)
  assert.match(gallery, /src=\{video\.trackSrc\}/)
  assert.match(capabilitiesPage, /CustomerVideoGallery/)
})

test('the business licence is never included in public assets or published source', async () => {
  const allFiles = await listFilesRecursively('.')
  const publicFiles = allFiles.filter((name) => name.startsWith('public/'))
  const sourceFiles = allFiles.filter((name) => /^(?:app|components|lib)\/.+\.(?:ts|tsx)$/.test(name))
  const source = (await Promise.all(sourceFiles.map(readProjectFile))).join('\n')

  assert.ok(publicFiles.every((name) => !/licen[cs]e|营业执照|营业职照|昌晖正本/i.test(name)))
  assert.doesNotMatch(source, /licen[cs]e\.(?:jpe?g|png)|营业执照|营业职照|昌晖正本/i)
})
