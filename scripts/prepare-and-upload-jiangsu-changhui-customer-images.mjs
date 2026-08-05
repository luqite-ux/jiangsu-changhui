import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createHash } from 'node:crypto'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'
import {
  CUSTOMER_REFRESH_R2_PREFIX,
  customerRefreshPublicUrl,
  publishableSources,
} from '../lib/customer-product-image-refresh.mjs'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const defaultSourceDirectory = resolve(repositoryRoot, 'output/private/changhui-image-refresh/restored')
const defaultOutputDirectory = resolve(repositoryRoot, 'output/private/changhui-image-refresh/webp')
const defaultManifestPath = resolve(repositoryRoot, 'output/private/changhui-customer-image-upload-manifest.json')

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex')
const maximumEdgeFor = (kind) => kind === 'product' ? 1600 : 1920

export async function prepareApprovedImages({
  sourceDirectory = defaultSourceDirectory,
  outputDirectory = defaultOutputDirectory,
  manifestPath = defaultManifestPath,
} = {}) {
  await mkdir(outputDirectory, { recursive: true })
  const images = []

  for (const source of publishableSources) {
    const inputPath = resolve(sourceDirectory, source.restoredFileName)
    const outputFileName = `${source.sourceId}.webp`
    const outputPath = resolve(outputDirectory, outputFileName)
    await stat(inputPath)
    const input = await readFile(inputPath)
    const inputMetadata = await sharp(input, { failOn: 'error' }).metadata()
    const maximumEdge = maximumEdgeFor(source.kind)

    await sharp(input, { failOn: 'error' })
      .rotate()
      .resize({ width: maximumEdge, height: maximumEdge, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 88, effort: 6, smartSubsample: true })
      .toFile(outputPath)

    const output = await readFile(outputPath)
    const outputMetadata = await sharp(output, { failOn: 'error' }).metadata()
    if (outputMetadata.format !== 'webp') throw new Error(`Output is not WebP: ${outputPath}`)
    if (!outputMetadata.width || !outputMetadata.height) throw new Error(`Output dimensions missing: ${outputPath}`)
    if (Math.max(outputMetadata.width, outputMetadata.height) > maximumEdge) throw new Error(`Output exceeds size limit: ${outputPath}`)
    if (inputMetadata.width && inputMetadata.height &&
      (outputMetadata.width > inputMetadata.width || outputMetadata.height > inputMetadata.height)) {
      throw new Error(`Output was unexpectedly enlarged: ${outputPath}`)
    }

    images.push({
      sourceId: source.sourceId,
      kind: source.kind,
      outputFileName,
      width: outputMetadata.width,
      height: outputMetadata.height,
      bytes: output.length,
      sha256: sha256(output),
      r2Key: `${CUSTOMER_REFRESH_R2_PREFIX}${outputFileName}`,
      publicUrl: customerRefreshPublicUrl(source.sourceId),
    })
  }

  if (images.length !== 38) throw new Error(`Expected exactly 38 approved outputs, received ${images.length}`)
  const manifest = { schemaVersion: 1, count: images.length, format: 'webp', quality: 88, images }
  await mkdir(dirname(manifestPath), { recursive: true })
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  return manifest
}

function requireR2Environment() {
  const values = {
    endpoint: process.env.R2_S3_ENDPOINT,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET_NAME,
  }
  const missing = Object.entries(values).filter(([, value]) => !value).map(([key]) => key)
  if (missing.length) throw new Error(`Missing required R2 environment values: ${missing.join(', ')}`)
  return values
}

export async function uploadApprovedImages({ manifest, outputDirectory = defaultOutputDirectory } = {}) {
  if (!manifest || manifest.count !== 38) throw new Error('A verified 38-image manifest is required before upload')
  const environment = requireR2Environment()
  const client = new S3Client({
    region: 'auto', endpoint: environment.endpoint,
    credentials: { accessKeyId: environment.accessKeyId, secretAccessKey: environment.secretAccessKey },
  })
  const uploaded = []
  for (const image of manifest.images) {
    if (!image.r2Key.startsWith(CUSTOMER_REFRESH_R2_PREFIX)) throw new Error(`Refusing key outside locked prefix: ${image.r2Key}`)
    const body = await readFile(resolve(outputDirectory, image.outputFileName))
    if (sha256(body) !== image.sha256) throw new Error(`Prepared file changed after review: ${image.outputFileName}`)
    await client.send(new PutObjectCommand({
      Bucket: environment.bucket, Key: image.r2Key, Body: body,
      ContentType: 'image/webp', CacheControl: 'public, max-age=31536000, immutable',
    }))
    const head = await client.send(new HeadObjectCommand({ Bucket: environment.bucket, Key: image.r2Key }))
    if (head.ContentType !== 'image/webp' || Number(head.ContentLength) !== body.length) {
      throw new Error(`R2 verification failed: ${image.r2Key}`)
    }
    uploaded.push({ sourceId: image.sourceId, key: image.r2Key, bytes: body.length })
  }
  return uploaded
}

export async function verifyPublicImages(manifest) {
  const verified = []
  for (const image of manifest.images) {
    const response = await fetch(image.publicUrl, { method: 'HEAD', redirect: 'follow', cache: 'no-store' })
    const contentType = response.headers.get('content-type')?.split(';', 1)[0].toLowerCase()
    if (response.status !== 200 || contentType !== 'image/webp') throw new Error(`Public image verification failed: ${image.publicUrl}`)
    verified.push(image.publicUrl)
  }
  return verified
}

export async function run(args = process.argv.slice(2)) {
  const upload = args.includes('--upload')
  const verifyPublic = args.includes('--verify-public')
  const manifest = await prepareApprovedImages()
  const uploaded = upload ? await uploadApprovedImages({ manifest }) : []
  const verified = verifyPublic ? await verifyPublicImages(manifest) : []
  return { prepared: manifest.count, uploaded: uploaded.length, publicVerified: verified.length, manifestPath: defaultManifestPath }
}

const isDirectExecution = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href
if (isDirectExecution) run().then((result) => console.log(JSON.stringify(result, null, 2))).catch((error) => {
  console.error(`[changhui-customer-images] ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
})
