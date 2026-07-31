import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { access, mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import test from 'node:test'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const modulePath = resolve(repositoryRoot, 'lib/brand-free-images.mjs')
const scriptPath = resolve(repositoryRoot, 'scripts/create-jiangsu-changhui-brand-free-images.mjs')
const databaseScriptPath = resolve(repositoryRoot, 'scripts/remap-jiangsu-changhui-brand-free-db.mjs')
const customerSourceDirectory = 'D:\\Cursor\\Grand\\建站客户资料\\1358-江苏昌晖对接群\\图片'
const generatedOutputDirectory = resolve(repositoryRoot, 'output/brand-free')
const generatedManifestPath = resolve(repositoryRoot, 'output/brand-free-image-manifest.json')

async function loadModule() {
  try {
    await access(modulePath)
  } catch {
    assert.fail('lib/brand-free-images.mjs must implement deterministic footer-band detection')
  }
  return import(`${pathToFileURL(modulePath).href}?test=${Date.now()}`)
}

async function loadScript() {
  try {
    await access(scriptPath)
  } catch {
    assert.fail('the deterministic Jiangsu Changhui crop/upload script must exist')
  }
  return import(`${pathToFileURL(scriptPath).href}?test=${Date.now()}`)
}

async function loadDatabaseScript() {
  try {
    await access(databaseScriptPath)
  } catch {
    assert.fail('the tenant-locked Jiangsu Changhui database remap script must exist')
  }
  return import(`${pathToFileURL(databaseScriptPath).href}?test=${Date.now()}`)
}

function syntheticPhotoWithFooter({ width = 20, height = 20, footerTop = 16 } = {}) {
  const channels = 3
  const data = Buffer.alloc(width * height * channels)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * channels
      const inFooter = y >= footerTop
      const simulatedDarkBrandText = inFooter && y >= footerTop + 3 && x >= 4 && x <= 12
      const value = simulatedDarkBrandText ? 25 : inFooter ? 255 : 80 + ((x + y) % 80)
      data[offset] = value
      data[offset + 1] = value
      data[offset + 2] = value
    }
  }
  return { data, width, height, channels }
}

test('detects the first footer row while tolerating dark phone-brand text inside the white band', async () => {
  const { detectWhiteFooterBoundary } = await loadModule()
  const image = syntheticPhotoWithFooter()

  const result = detectWhiteFooterBoundary(image, {
    minFooterRatio: 0.15,
    maxFooterRatio: 0.30,
    cleanRunLength: 2,
    minimumEdgeDelta: 70,
  })

  assert.equal(result.cropHeight, 16)
  assert.equal(result.removedPixels, 4)
  assert.equal(result.removedRatio, 0.2)
})

test('refuses to crop a photograph without a qualifying bottom white footer', async () => {
  const { detectWhiteFooterBoundary } = await loadModule()
  const image = syntheticPhotoWithFooter({ footerTop: 20 })

  assert.throws(
    () => detectWhiteFooterBoundary(image),
    /No qualifying bottom white footer band detected/,
  )
})

test('includes a JPEG-softened transition row in the removed footer band', async () => {
  const { detectWhiteFooterBoundary } = await loadModule()
  const image = syntheticPhotoWithFooter()
  for (let x = 0; x < image.width; x += 1) {
    const offset = ((16 * image.width) + x) * image.channels
    image.data[offset] = 225
    image.data[offset + 1] = 225
    image.data[offset + 2] = 225
  }

  const result = detectWhiteFooterBoundary(image, {
    minFooterRatio: 0.15,
    maxFooterRatio: 0.30,
    cleanRunLength: 1,
    minimumEdgeDelta: 70,
  })

  assert.equal(result.cropHeight, 16)
})

test('locks processing to the exact 23 Jiangsu Changhui JPEG names and brand-free key prefix', async () => {
  const { SOURCE_FILES, R2_KEY_PREFIX, brandFreePublicUrl } = await loadModule()

  assert.equal(SOURCE_FILES.length, 23)
  assert.equal(new Set(SOURCE_FILES).size, 23)
  assert.ok(SOURCE_FILES.every((file) => /^[a-f0-9]{32}\.jpg$/.test(file)))
  assert.equal(R2_KEY_PREFIX, 'v0-design-assets/jiangsu-changhui/brand-free/')
  assert.equal(
    brandFreePublicUrl('02f2c9b85494be5f6063823e28e5665f.jpg'),
    'https://pub-c7a22068052144a5805830c30d280128.r2.dev/v0-design-assets/jiangsu-changhui/brand-free/02f2c9b85494be5f6063823e28e5665f.jpg',
  )
  assert.throws(() => brandFreePublicUrl('../outside.jpg'), /not an approved Jiangsu Changhui source/)
})

test('recursively remaps only approved original JPG URLs while leaving logo PNG and MP4 values unchanged', async () => {
  const { replaceOriginalImageUrls } = await loadModule()
  const originalBase = 'https://pub-c7a22068052144a5805830c30d280128.r2.dev/v0-design-assets/jiangsu-changhui/'
  const sourceFile = '02f2c9b85494be5f6063823e28e5665f.jpg'
  const logo = `${originalBase}logo.png`
  const video = `${originalBase}6ac3922c83d45e180deaaa40ed76094a.mp4`
  const input = {
    image_url: `${originalBase}${sourceFile}`,
    extra_data: {
      images: [`${originalBase}${sourceFile}`],
      html: `<img src="${originalBase}${sourceFile}">`,
      logo,
      video,
    },
  }

  const result = replaceOriginalImageUrls(input)

  assert.equal(result.replacements, 3)
  assert.equal(result.value.image_url, `${originalBase}brand-free/${sourceFile}`)
  assert.equal(result.value.extra_data.images[0], `${originalBase}brand-free/${sourceFile}`)
  assert.match(result.value.extra_data.html, /brand-free\/02f2c9b8/)
  assert.equal(result.value.extra_data.logo, logo)
  assert.equal(result.value.extra_data.video, video)
  assert.deepEqual(input.extra_data.images, [`${originalBase}${sourceFile}`], 'the source row must not be mutated')
})

test('builds a minimal tenant-scoped database patch and rejects every other tenant', async () => {
  const { buildRowPatch } = await loadDatabaseScript()
  const originalBase = 'https://pub-c7a22068052144a5805830c30d280128.r2.dev/v0-design-assets/jiangsu-changhui/'
  const row = {
    id: 'product-1',
    tenant_id: '0f4f3ffa-9a1b-468f-8408-2f59a3b64e45',
    slug: 'example',
    image_url: `${originalBase}02f2c9b85494be5f6063823e28e5665f.jpg`,
    extra_data: {
      images: [`${originalBase}02f2c9b85494be5f6063823e28e5665f.jpg`],
      video: `${originalBase}6ac3922c83d45e180deaaa40ed76094a.mp4`,
    },
  }

  const result = buildRowPatch('products', row)

  assert.deepEqual(Object.keys(result.patch).sort(), ['extra_data', 'image_url'])
  assert.equal(result.replacements, 2)
  assert.match(result.patch.image_url, /\/brand-free\//)
  assert.equal(result.patch.extra_data.video, row.extra_data.video)
  assert.throws(
    () => buildRowPatch('products', { ...row, tenant_id: '11111111-1111-1111-1111-111111111111' }),
    /Refusing row outside Jiangsu Changhui tenant/,
  )
})

test('crops only the detected bottom footer and writes a shorter JPEG with the same width', async () => {
  const sharp = (await import('sharp')).default
  const { cropJpegFile } = await loadScript()
  const temporaryDirectory = await mkdtemp(resolve(tmpdir(), 'changhui-brand-free-'))
  const inputPath = resolve(temporaryDirectory, 'input.jpg')
  const outputPath = resolve(temporaryDirectory, 'output.jpg')
  const width = 200
  const height = 200
  const footerTop = 170

  try {
    const photographedContent = await sharp({
      create: { width, height: footerTop, channels: 3, background: { r: 46, g: 96, b: 126 } },
    }).png().toBuffer()
    const footer = await sharp({
      create: { width, height: height - footerTop, channels: 3, background: { r: 255, g: 255, b: 255 } },
    }).composite([{
      input: Buffer.from(`<svg width="200" height="30"><text x="55" y="24" fill="#111">vivo X200 Pro</text></svg>`),
      top: 0,
      left: 0,
    }]).png().toBuffer()
    await sharp({
      create: { width, height, channels: 3, background: { r: 0, g: 0, b: 0 } },
    }).composite([{ input: photographedContent, top: 0, left: 0 }, { input: footer, top: footerTop, left: 0 }])
      .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
      .toFile(inputPath)

    const result = await cropJpegFile(inputPath, outputPath, {
      minFooterRatio: 0.10,
      maxFooterRatio: 0.20,
      cleanRunLength: 4,
    })
    const outputMetadata = await sharp(await readFile(outputPath)).metadata()
    const bottom = await sharp(outputPath).extract({ left: 0, top: footerTop - 5, width, height: 5 }).stats()

    assert.equal(result.originalWidth, width)
    assert.equal(result.originalHeight, height)
    assert.equal(result.outputWidth, width)
    assert.equal(result.outputHeight, footerTop)
    assert.equal(outputMetadata.format, 'jpeg')
    assert.ok(bottom.channels.every(({ mean }) => mean < 180), 'the output bottom must be photographed content, not the former white footer')
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true })
  }
})

test('all 23 real customer outputs preserve width, shorten height, and end above the former white footer', {
  skip: !existsSync(customerSourceDirectory) || !existsSync(generatedManifestPath),
}, async () => {
  const sharp = (await import('sharp')).default
  const { SOURCE_FILES } = await loadModule()
  const manifest = JSON.parse(await readFile(generatedManifestPath, 'utf8'))
  const sourceFiles = (await readdir(customerSourceDirectory)).filter((file) => /\.jpg$/i.test(file)).sort()
  const outputFiles = (await readdir(generatedOutputDirectory)).filter((file) => /\.jpg$/i.test(file)).sort()

  assert.deepEqual(sourceFiles, [...SOURCE_FILES].sort())
  assert.deepEqual(outputFiles, [...SOURCE_FILES].sort())
  assert.equal(manifest.count, 23)

  for (const fileName of SOURCE_FILES) {
    const source = await sharp(resolve(customerSourceDirectory, fileName)).metadata()
    const outputPath = resolve(generatedOutputDirectory, fileName)
    const output = await sharp(outputPath).metadata()
    const raw = await sharp(outputPath).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    const rows = Math.min(12, raw.info.height)
    let whitePixels = 0
    let luminanceTotal = 0
    let samples = 0
    for (let y = raw.info.height - rows; y < raw.info.height; y += 1) {
      for (let x = 0; x < raw.info.width; x += Math.max(1, Math.floor(raw.info.width / 512))) {
        const offset = ((y * raw.info.width) + x) * raw.info.channels
        const red = raw.data[offset]
        const green = raw.data[offset + 1]
        const blue = raw.data[offset + 2]
        luminanceTotal += (0.2126 * red) + (0.7152 * green) + (0.0722 * blue)
        if (red >= 242 && green >= 242 && blue >= 242) whitePixels += 1
        samples += 1
      }
    }

    assert.equal(output.format, 'jpeg', fileName)
    assert.equal(output.width, source.width, fileName)
    assert.ok(output.height < source.height, fileName)
    assert.ok((whitePixels / samples) < 0.10, `${fileName} must not retain a uniform white footer`)
    assert.ok((luminanceTotal / samples) < 230, `${fileName} output bottom must be photographed content`)
    assert.doesNotMatch(JSON.stringify(output), /vivo|X200 Pro/i, `${fileName} metadata must not retain phone-brand text`)
  }
})
