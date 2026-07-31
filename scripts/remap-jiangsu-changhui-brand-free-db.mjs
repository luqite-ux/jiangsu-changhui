import { createHash } from 'node:crypto'
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  SOURCE_FILES,
  TENANT_ID,
  replaceOriginalImageUrls,
} from '../lib/brand-free-images.mjs'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const defaultSnapshotPath = resolve(repositoryRoot, 'output/private/brand-free-db-rollback.json')
const explicitlyMutableTables = new Set([
  'tenants',
  'products',
  'product_categories',
  'articles',
  'settings',
  'website_builder_projects',
])

function assertTenantRow(table, row) {
  const rowTenantId = table === 'tenants' ? row?.id : row?.tenant_id
  if (rowTenantId !== TENANT_ID) {
    throw new Error(`Refusing row outside Jiangsu Changhui tenant ${TENANT_ID}`)
  }
}

export function buildRowPatch(table, row) {
  assertTenantRow(table, row)
  const transformed = replaceOriginalImageUrls(row)
  const patch = {}
  for (const [key, value] of Object.entries(transformed.value)) {
    if (['id', 'tenant_id', 'created_at', 'updated_at'].includes(key)) continue
    if (JSON.stringify(value) !== JSON.stringify(row[key])) patch[key] = value
  }
  return { patch, replacements: transformed.replacements }
}

function escapeCurlConfig(value) {
  return String(value).replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('\r', '\\r').replaceAll('\n', '\\n')
}

async function curlJson({ url, method = 'GET', body, accept = 'application/json' }) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  const lines = [
    'silent',
    'show-error',
    'connect-timeout = 15',
    'max-time = 90',
    `url = "${escapeCurlConfig(url)}"`,
    `request = "${method}"`,
    `header = "apikey: ${escapeCurlConfig(serviceRoleKey)}"`,
    `header = "Authorization: Bearer ${escapeCurlConfig(serviceRoleKey)}"`,
    `header = "Accept: ${accept}"`,
    'header = "Content-Type: application/json"',
    'header = "Prefer: return=representation"',
    'write-out = "\\n__CHANGHUI_HTTP_STATUS__:%{http_code}"',
  ]
  if (body !== undefined) lines.push(`data = "${escapeCurlConfig(JSON.stringify(body))}"`)

  const child = spawn('curl.exe', ['--config', '-'], { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true })
  let stdout = ''
  let stderr = ''
  child.stdout.setEncoding('utf8')
  child.stderr.setEncoding('utf8')
  child.stdout.on('data', (chunk) => { stdout += chunk })
  child.stderr.on('data', (chunk) => { stderr += chunk })
  child.stdin.end(`${lines.join('\n')}\n`)
  const exitCode = await new Promise((resolvePromise, reject) => {
    child.once('error', reject)
    child.once('close', resolvePromise)
  })
  if (exitCode !== 0) throw new Error(`Supabase REST transport failed with curl exit ${exitCode}: ${stderr.trim() || 'no details'}`)

  const marker = '\n__CHANGHUI_HTTP_STATUS__:'
  const markerIndex = stdout.lastIndexOf(marker)
  if (markerIndex < 0) throw new Error('Supabase REST response omitted its HTTP status marker')
  const payload = stdout.slice(0, markerIndex)
  const status = Number(stdout.slice(markerIndex + marker.length).trim())
  let parsed
  try {
    parsed = payload ? JSON.parse(payload) : null
  } catch {
    throw new Error(`Supabase REST returned non-JSON with HTTP ${status}`)
  }
  if (status < 200 || status >= 300) {
    const message = parsed && typeof parsed === 'object' ? parsed.message || parsed.hint || parsed.code : null
    throw new Error(`Supabase REST HTTP ${status}${message ? `: ${message}` : ''}`)
  }
  return parsed
}

function supabaseBaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL')
  return `${url.replace(/\/$/, '')}/rest/v1/`
}

async function discoverTenantTables() {
  const specification = await curlJson({
    url: supabaseBaseUrl(),
    accept: 'application/openapi+json',
  })
  const definitions = specification?.definitions ?? {}
  const tables = Object.entries(definitions)
    .filter(([, definition]) => definition?.properties?.tenant_id)
    .map(([name]) => ({ name, tenantColumn: 'tenant_id' }))
  if (definitions.tenants) tables.push({ name: 'tenants', tenantColumn: 'id' })
  const unique = new Map(tables.map((table) => [table.name, table]))
  return [...unique.values()].sort((left, right) => left.name.localeCompare(right.name))
}

async function readAllTenantRows() {
  const tables = await discoverTenantTables()
  const result = []
  for (const table of tables) {
    const query = `${encodeURIComponent(table.name)}?select=*&${table.tenantColumn}=eq.${encodeURIComponent(TENANT_ID)}`
    const rows = await curlJson({ url: `${supabaseBaseUrl()}${query}` })
    if (!Array.isArray(rows)) throw new Error(`Expected an array from ${table.name}`)
    for (const row of rows) assertTenantRow(table.name, row)
    result.push({ ...table, rows })
  }
  return result
}

function countDerivedReferences(value) {
  let count = 0
  const visit = (child) => {
    if (typeof child === 'string') {
      for (const fileName of SOURCE_FILES) count += child.split(`/brand-free/${fileName}`).length - 1
    } else if (Array.isArray(child)) child.forEach(visit)
    else if (child && typeof child === 'object') Object.values(child).forEach(visit)
  }
  visit(value)
  return count
}

function protectedMediaDigest(tables) {
  const values = []
  const visit = (value) => {
    if (typeof value === 'string' && (/\.png(?:$|[?#])/i.test(value) || /\.mp4(?:$|[?#])/i.test(value))) values.push(value)
    else if (Array.isArray(value)) value.forEach(visit)
    else if (value && typeof value === 'object') Object.values(value).forEach(visit)
  }
  for (const table of tables) for (const row of table.rows) visit(row)
  const unique = [...new Set(values)].sort()
  return {
    count: unique.length,
    digest: createHash('sha256').update(unique.join('\n')).digest('hex'),
  }
}

function buildAudit(tables) {
  const changes = []
  let originalReferences = 0
  let derivedReferences = 0
  for (const table of tables) {
    for (const row of table.rows) {
      const result = buildRowPatch(table.name, row)
      const derived = countDerivedReferences(row)
      originalReferences += result.replacements
      derivedReferences += derived
      if (result.replacements > 0) {
        if (!explicitlyMutableTables.has(table.name)) {
          throw new Error(`Original image reference found in non-approved table ${table.name}; refusing automatic update`)
        }
        if (!row.id) throw new Error(`Referenced row in ${table.name} has no id; refusing automatic update`)
        changes.push({
          table: table.name,
          tenantColumn: table.tenantColumn,
          id: row.id,
          row,
          patch: result.patch,
          replacements: result.replacements,
        })
      }
    }
  }
  return {
    tables: tables.length,
    rows: tables.reduce((sum, table) => sum + table.rows.length, 0),
    originalReferences,
    derivedReferences,
    changes,
    protectedMedia: protectedMediaDigest(tables),
  }
}

async function writeSnapshot(snapshotPath, audit) {
  await mkdir(dirname(snapshotPath), { recursive: true })
  await writeFile(snapshotPath, `${JSON.stringify({
    tenantId: TENANT_ID,
    capturedAt: new Date().toISOString(),
    protectedMedia: audit.protectedMedia,
    rows: audit.changes.map(({ table, tenantColumn, row }) => ({ table, tenantColumn, row })),
  }, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' })
}

async function applyChange(change) {
  const query = `${encodeURIComponent(change.table)}?id=eq.${encodeURIComponent(change.id)}&${change.tenantColumn}=eq.${encodeURIComponent(TENANT_ID)}&select=*`
  const rows = await curlJson({
    url: `${supabaseBaseUrl()}${query}`,
    method: 'PATCH',
    body: change.patch,
  })
  if (!Array.isArray(rows) || rows.length !== 1) throw new Error(`Expected one updated ${change.table} row ${change.id}`)
  assertTenantRow(change.table, rows[0])
  if (replaceOriginalImageUrls(rows[0]).replacements !== 0) throw new Error(`Readback still contains an original URL in ${change.table} row ${change.id}`)
}

function parseArguments(args) {
  const apply = args.includes('--apply')
  const dryRun = args.includes('--dry-run')
  if (apply && dryRun) throw new Error('Choose either --apply or --dry-run')
  const snapshotIndex = args.indexOf('--snapshot')
  if (snapshotIndex >= 0 && !args[snapshotIndex + 1]) throw new Error('--snapshot requires a path')
  return {
    apply,
    snapshotPath: snapshotIndex >= 0 ? resolve(args[snapshotIndex + 1]) : defaultSnapshotPath,
  }
}

export async function run(args = process.argv.slice(2)) {
  const options = parseArguments(args)
  if (process.env.NEXT_PUBLIC_TENANT_ID && process.env.NEXT_PUBLIC_TENANT_ID !== TENANT_ID) {
    throw new Error(`NEXT_PUBLIC_TENANT_ID does not match locked tenant ${TENANT_ID}`)
  }
  const beforeTables = await readAllTenantRows()
  const before = buildAudit(beforeTables)
  const tableCounts = Object.fromEntries(before.changes.map(({ table }) => table).reduce((map, table) => map.set(table, (map.get(table) ?? 0) + 1), new Map()))

  if (!options.apply) {
    return {
      mode: 'dry-run',
      tenantId: TENANT_ID,
      auditedTables: before.tables,
      auditedRows: before.rows,
      originalReferences: before.originalReferences,
      plannedRows: before.changes.length,
      tableCounts,
      protectedMedia: before.protectedMedia,
    }
  }

  await writeSnapshot(options.snapshotPath, before)
  for (const change of before.changes) await applyChange(change)

  const afterTables = await readAllTenantRows()
  const after = buildAudit(afterTables)
  if (after.originalReferences !== 0 || after.changes.length !== 0) {
    throw new Error(`Post-apply audit found ${after.originalReferences} original references in ${after.changes.length} rows`)
  }
  if (before.protectedMedia.digest !== after.protectedMedia.digest || before.protectedMedia.count !== after.protectedMedia.count) {
    throw new Error('PNG/MP4 protected-media values changed during JPG remap')
  }
  return {
    mode: 'apply',
    tenantId: TENANT_ID,
    auditedTables: after.tables,
    auditedRows: after.rows,
    updatedRows: before.changes.length,
    replacedReferences: before.originalReferences,
    remainingOriginalReferences: after.originalReferences,
    derivedReferences: after.derivedReferences,
    tableCounts,
    protectedMediaUnchanged: true,
    protectedMedia: after.protectedMedia,
    snapshotPath: options.snapshotPath,
  }
}

const isDirectExecution = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href
if (isDirectExecution) {
  run()
    .then((summary) => console.log(JSON.stringify(summary, null, 2)))
    .catch((error) => {
      console.error(`[jiangsu-changhui-brand-free-db] ${error instanceof Error ? error.message : String(error)}`)
      process.exitCode = 1
    })
}
