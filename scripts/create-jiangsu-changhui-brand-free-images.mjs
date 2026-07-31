import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'
import {
  R2_KEY_PREFIX,
  SOURCE_FILES,
  brandFreePublicUrl,
  detectWhiteFooterBoundary,
} from '../lib/brand-free-images.mjs'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const defaultSourceDirectory = 'D:\\Cursor\\Grand\\建站客户资料\\1358-江苏昌晖对接群\\图片'
const defaultOutputDirectory = resolve(repositoryRoot, 'output/brand-free')
const defaultManifestPath = resolve(repositoryRoot, 'output/brand-free-image-manifest.json')

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

function rowWhiteEvidence(data, width, height, channels, rows = Math.min(12, height)) {
  let whitePixels = 0
  let luminanceTotal = 0
  let samples = 0
  const top = height - rows
  const sampleStep = Math.max(1, Math.floor(width / 512))
  for (let y = top; y < height; y += 1) {
    for (let x = 0; x < width; x += sampleStep) {
      const offset = (y * width + x) * channels
      const red = data[offset]
      const green = data[offset + 1]
      const blue = data[offset + 2]
      luminanceTotal += (0.2126 * red) + (0.7152 * green) + (0.0722 * blue)
      if (red >= 242 && green >= 242 && blue >= 242) whitePixels += 1
      samples += 1
    }
  }
  return {
    rows,
    meanLuminance: luminanceTotal / samples,
    whiteFraction: whitePixels / samples,
  }
}

export async function cropJpegFile(inputPath, outputPath, detectionOptions = {}) {
  const input = await readFile(inputPath)
  const decoded = await sharp(input, { failOn: 'error' })
    .rotate()
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = decoded.info
  const detection = detectWhiteFooterBoundary({ data: decoded.data, width, height, channels }, detectionOptions)

  await mkdir(dirname(outputPath), { recursive: true })
  await sharp(input, { failOn: 'error' })
    .rotate()
    .extract({ left: 0, top: 0, width, height: detection.cropHeight })
    .jpeg({
      quality: 95,
      chromaSubsampling: '4:4:4',
      progressive: true,
      optimiseCoding: true,
    })
    .toFile(outputPath)

  const output = await readFile(outputPath)
  const outputDecoded = await sharp(output, { failOn: 'error' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const outputMetadata = await sharp(output, { failOn: 'error' }).metadata()
  if (outputMetadata.format !== 'jpeg') throw new Error(`Derived file is not JPEG: ${outputPath}`)
  if (outputDecoded.info.width !== width || outputDecoded.info.height !== detection.cropHeight) {
    throw new Error(`Derived dimensions do not match the detected crop: ${outputPath}`)
  }

  return {
    originalWidth: width,
    originalHeight: height,
    outputWidth: outputDecoded.info.width,
    outputHeight: outputDecoded.info.height,
    removedPixels: detection.removedPixels,
    removedRatio: detection.removedRatio,
    edgeDelta: detection.edgeDelta,
    boundaryMeanLuminance: detection.boundaryMeanLuminance,
    boundaryWhiteFraction: detection.boundaryWhiteFraction,
    outputBottomEvidence: rowWhiteEvidence(
      outputDecoded.data,
      outputDecoded.info.width,
      outputDecoded.info.height,
      outputDecoded.info.channels,
    ),
    inputSha256: sha256(input),
    outputSha256: sha256(output),
    outputBytes: output.length,
  }
}

async function assertExactSourceSet(sourceDirectory) {
  const actual = (await readdir(sourceDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /\.jpe?g$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort()
  const expected = [...SOURCE_FILES].sort()
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    const missing = expected.filter((name) => !actual.includes(name))
    const unexpected = actual.filter((name) => !expected.includes(name))
    throw new Error(`Source set must be the exact approved 23 JPEGs (missing: ${missing.join(', ') || 'none'}; unexpected: ${unexpected.join(', ') || 'none'})`)
  }
}

export async function processSourceImages({
  sourceDirectory = defaultSourceDirectory,
  outputDirectory = defaultOutputDirectory,
  manifestPath = defaultManifestPath,
} = {}) {
  await assertExactSourceSet(sourceDirectory)
  await mkdir(outputDirectory, { recursive: true })
  const images = []

  for (const fileName of SOURCE_FILES) {
    const result = await cropJpegFile(
      resolve(sourceDirectory, fileName),
      resolve(outputDirectory, fileName),
    )
    if (result.outputWidth !== result.originalWidth || result.outputHeight >= result.originalHeight) {
      throw new Error(`Unsafe crop result for ${fileName}`)
    }
    images.push({
      fileName,
      r2Key: `${R2_KEY_PREFIX}${fileName}`,
      publicUrl: brandFreePublicUrl(fileName),
      ...result,
    })
  }

  const manifest = {
    schemaVersion: 1,
    method: 'deterministic Sharp extract; no generation, inpainting, content-aware fill, or source overwrite',
    thresholds: {
      footerSearchRatio: '6%-15% from image bottom',
      boundaryMeanLuminance: 230,
      boundaryWhiteFraction: 0.60,
      cleanMeanLuminance: 244,
      cleanWhiteFraction: 0.75,
      minimumEdgeDelta: 35,
    },
    count: images.length,
    images,
  }
  await mkdir(dirname(manifestPath), { recursive: true })
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  return manifest
}

function requireR2Environment() {
  const endpoint = process.env.R2_S3_ENDPOINT
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucket = process.env.R2_BUCKET_NAME
  const missing = [
    ['R2_S3_ENDPOINT', endpoint],
    ['R2_ACCESS_KEY_ID', accessKeyId],
    ['R2_SECRET_ACCESS_KEY', secretAccessKey],
    ['R2_BUCKET_NAME', bucket],
  ].filter(([, value]) => !value).map(([name]) => name)
  if (missing.length) throw new Error(`Missing required R2 environment variables: ${missing.join(', ')}`)
  return { endpoint, accessKeyId, secretAccessKey, bucket }
}

export async function uploadDerivedImages({
  manifest,
  outputDirectory = defaultOutputDirectory,
} = {}) {
  if (!manifest || manifest.count !== SOURCE_FILES.length) throw new Error('A verified 23-image manifest is required before upload')
  const environment = requireR2Environment()
  const client = new S3Client({
    region: 'auto',
    endpoint: environment.endpoint,
    credentials: {
      accessKeyId: environment.accessKeyId,
      secretAccessKey: environment.secretAccessKey,
    },
  })
  const uploaded = []

  for (const image of manifest.images) {
    if (!SOURCE_FILES.includes(image.fileName)) throw new Error(`Refusing unapproved upload ${image.fileName}`)
    const key = `${R2_KEY_PREFIX}${image.fileName}`
    if (image.r2Key !== key || !key.startsWith(R2_KEY_PREFIX)) throw new Error(`Refusing key outside locked prefix: ${image.r2Key}`)
    const body = await readFile(resolve(outputDirectory, image.fileName))
    await client.send(new PutObjectCommand({
      Bucket: environment.bucket,
      Key: key,
      Body: body,
      ContentType: 'image/jpeg',
      CacheControl: 'public, max-age=31536000, immutable',
    }))
    const head = await client.send(new HeadObjectCommand({ Bucket: environment.bucket, Key: key }))
    if (head.ContentType !== 'image/jpeg') throw new Error(`R2 object is not image/jpeg: ${key}`)
    uploaded.push({ key, bytes: body.length, etag: head.ETag ?? null })
  }
  return uploaded
}

export async function verifyPublicImages() {
  const results = []
  for (const fileName of SOURCE_FILES) {
    const url = brandFreePublicUrl(fileName)
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow', cache: 'no-store' })
    const contentType = response.headers.get('content-type')?.split(';', 1)[0].toLowerCase() ?? ''
    if (response.status !== 200 || contentType !== 'image/jpeg') {
      throw new Error(`Public HEAD failed for ${fileName}: ${response.status} ${contentType || 'missing content-type'}`)
    }
    results.push({ fileName, status: response.status, contentType })
  }
  return results
}

function parseArguments(args) {
  const valueAfter = (flag) => {
    const index = args.indexOf(flag)
    if (index < 0) return undefined
    if (!args[index + 1]) throw new Error(`${flag} requires a value`)
    return resolve(args[index + 1])
  }
  return {
    sourceDirectory: valueAfter('--source') ?? defaultSourceDirectory,
    outputDirectory: valueAfter('--output') ?? defaultOutputDirectory,
    manifestPath: valueAfter('--manifest') ?? defaultManifestPath,
    upload: args.includes('--upload'),
    verifyPublic: args.includes('--verify-public'),
  }
}

export async function run(args = process.argv.slice(2)) {
  const options = parseArguments(args)
  const manifest = await processSourceImages(options)
  const uploaded = options.upload ? await uploadDerivedImages({ manifest, outputDirectory: options.outputDirectory }) : []
  const publicHeads = options.verifyPublic ? await verifyPublicImages() : []
  return {
    processed: manifest.count,
    uploaded: uploaded.length,
    publicHeadVerified: publicHeads.length,
    manifestPath: options.manifestPath,
  }
}

const isDirectExecution = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href
if (isDirectExecution) {
  run()
    .then((summary) => console.log(JSON.stringify(summary, null, 2)))
    .catch((error) => {
      console.error(`[jiangsu-changhui-brand-free] ${error instanceof Error ? error.message : String(error)}`)
      process.exitCode = 1
    })
}
