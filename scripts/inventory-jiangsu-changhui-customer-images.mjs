import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import sharp from 'sharp'
import { sourceImageManifest } from '../lib/customer-product-image-refresh.mjs'

const execFileAsync = promisify(execFile)
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const imageExtension = /\.(?:jpe?g|webp)$/i

function normaliseArchivePath(value) {
  return value.replaceAll('\\', '/').replace(/^\.\//, '')
}

export function validateArchiveEntryPaths(entryPaths) {
  const normalised = entryPaths
    .map(normaliseArchivePath)
    .filter((entry) => imageExtension.test(entry))

  for (const entry of normalised) {
    if (!entry || entry.startsWith('/') || /^[A-Za-z]:\//.test(entry) || entry.split('/').includes('..')) {
      throw new Error(`Unsafe archive path: ${entry}`)
    }
  }

  const expected = sourceImageManifest.map(({ archivePath }) => normaliseArchivePath(archivePath)).sort()
  const actual = [...normalised].sort()
  if (new Set(actual).size !== actual.length || JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error('Archive entries do not match manifest')
  }
  return normalised
}

function parseArguments(args) {
  const archiveIndex = args.indexOf('--archive')
  const outputIndex = args.indexOf('--output')
  const archivePath = archiveIndex >= 0 ? args[archiveIndex + 1] : undefined
  const outputPath = outputIndex >= 0 ? args[outputIndex + 1] : undefined
  if (!archivePath) throw new Error('--archive requires a ZIP path')
  if (outputIndex >= 0 && !outputPath) throw new Error('--output requires a JSON path')
  return {
    archivePath: resolve(archivePath),
    outputPath: outputPath ? resolve(repositoryRoot, outputPath) : undefined,
  }
}

function assertWithin(parent, candidate) {
  const child = resolve(candidate)
  const relation = relative(resolve(parent), child)
  if (relation.startsWith(`..${sep}`) || relation === '..' || isAbsolute(relation)) {
    throw new Error(`Resolved path escaped extraction root: ${child}`)
  }
  return child
}

async function listArchive(archivePath) {
  const script = `
$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($env:CODEX_CHANGHUI_ARCHIVE)
try {
  @($archive.Entries | ForEach-Object { $_.FullName }) | ConvertTo-Json -Compress
} finally {
  $archive.Dispose()
}
`
  const encodedCommand = Buffer.from(script, 'utf16le').toString('base64')
  const { stdout } = await execFileAsync('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', encodedCommand], {
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
    env: { ...process.env, CODEX_CHANGHUI_ARCHIVE: archivePath },
  })
  const entries = JSON.parse(stdout.trim())
  return Array.isArray(entries) ? entries : [entries]
}

async function extractArchive(archivePath, extractionRoot) {
  const script = `
$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($env:CODEX_CHANGHUI_ARCHIVE, $env:CODEX_CHANGHUI_DESTINATION)
`
  const encodedCommand = Buffer.from(script, 'utf16le').toString('base64')
  await execFileAsync('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', encodedCommand], {
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
    env: {
      ...process.env,
      CODEX_CHANGHUI_ARCHIVE: archivePath,
      CODEX_CHANGHUI_DESTINATION: extractionRoot,
    },
  })
}

export async function run(args = process.argv.slice(2)) {
  const { archivePath, outputPath } = parseArguments(args)
  const entries = validateArchiveEntryPaths(await listArchive(archivePath))
  const extractionRoot = await mkdtemp(resolve(tmpdir(), 'changhui-customer-images-'))

  try {
    await extractArchive(archivePath, extractionRoot)

    const metadataByPath = new Map()
    for (const archiveEntry of entries) {
      const localPath = assertWithin(extractionRoot, resolve(extractionRoot, ...archiveEntry.split('/')))
      const metadata = await sharp(localPath).metadata()
      metadataByPath.set(archiveEntry, {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: metadata.size,
        hasAlpha: metadata.hasAlpha,
      })
    }

    const report = {
      archivePath,
      inspectedAt: new Date().toISOString(),
      count: entries.length,
      images: sourceImageManifest.map((source) => ({
        ...source,
        metadata: metadataByPath.get(normaliseArchivePath(source.archivePath)),
      })),
    }

    if (outputPath) {
      await mkdir(dirname(outputPath), { recursive: true })
      await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
    }
    return report
  } finally {
    await rm(extractionRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
  }
}

const isDirectExecution = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href
if (isDirectExecution) {
  run()
    .then(({ count, archivePath }) => console.log(JSON.stringify({ archivePath, count }, null, 2)))
    .catch((error) => {
      console.error(`[changhui-customer-image-inventory] ${error instanceof Error ? error.message : String(error)}`)
      process.exitCode = 1
    })
}
