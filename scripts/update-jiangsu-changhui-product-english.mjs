import { createClient } from '@supabase/supabase-js'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const TENANT_ID = '0f4f3ffa-9a1b-468f-8408-2f59a3b64e45'

export const PRODUCT_NAME_UPDATES = Object.freeze({
  'hxgn-12': 'HXGN□-12 AC Metal-Enclosed Ring Main Unit',
  'box-substation': 'Box-Type Substation Series (European-Type)',
  'xqj-c-trough': 'XQJ-C Trough-Type Cable Tray',
  'xqj-p-tray': 'XQJ-P Tray-Type Cable Tray',
  'xqj-t-ladder': 'XQJ-T Ladder-Type Cable Tray',
})

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) throw new Error('Missing Supabase URL or service-role key')
  if (process.env.NEXT_PUBLIC_TENANT_ID && process.env.NEXT_PUBLIC_TENANT_ID !== TENANT_ID) {
    throw new Error(`Refusing tenant ${process.env.NEXT_PUBLIC_TENANT_ID}; expected ${TENANT_ID}`)
  }
  return createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

export function buildNamePatch(row) {
  if (row?.tenant_id !== TENANT_ID) throw new Error(`Refusing row outside tenant ${TENANT_ID}`)
  const name = PRODUCT_NAME_UPDATES[row.slug]
  if (!name) throw new Error(`No approved English name for ${row.slug}`)
  return { name }
}

async function readRows(client) {
  const slugs = Object.keys(PRODUCT_NAME_UPDATES)
  const result = await client
    .from('products')
    .select('id,tenant_id,slug,name')
    .eq('tenant_id', TENANT_ID)
    .in('slug', slugs)
    .order('slug')
  if (result.error) throw result.error
  if (result.data?.length !== slugs.length) {
    throw new Error(`Expected ${slugs.length} product rows, received ${result.data?.length ?? 0}`)
  }
  for (const row of result.data) buildNamePatch(row)
  return result.data
}

export async function run(args = process.argv.slice(2)) {
  const apply = args.includes('--apply')
  const client = createAdminClient()
  const before = await readRows(client)
  const changes = before.filter((row) => row.name !== PRODUCT_NAME_UPDATES[row.slug])

  if (apply) {
    for (const row of changes) {
      const result = await client
        .from('products')
        .update(buildNamePatch(row))
        .eq('tenant_id', TENANT_ID)
        .eq('id', row.id)
        .eq('slug', row.slug)
        .select('id')
      if (result.error) throw result.error
      if (result.data?.length !== 1) throw new Error(`Expected one updated row for ${row.slug}`)
    }
  }

  const after = await readRows(client)
  if (apply) {
    for (const row of after) {
      if (row.name !== PRODUCT_NAME_UPDATES[row.slug]) throw new Error(`Readback mismatch for ${row.slug}`)
    }
  }

  return {
    mode: apply ? 'apply' : 'dry-run',
    tenantId: TENANT_ID,
    reviewedRows: after.length,
    updatedRows: apply ? changes.length : 0,
    plannedRows: changes.length,
  }
}

const isDirectExecution = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href
if (isDirectExecution) {
  run()
    .then((summary) => console.log(JSON.stringify(summary, null, 2)))
    .catch((error) => {
      console.error(`[jiangsu-changhui-product-english] ${error instanceof Error ? error.message : String(error)}`)
      process.exitCode = 1
    })
}
