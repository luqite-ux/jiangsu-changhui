import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const readProjectFile = (relativePath) =>
  readFile(resolve(repositoryRoot, relativePath), 'utf8')

async function projectFileExists(relativePath) {
  try {
    await access(resolve(repositoryRoot, relativePath), constants.F_OK)
    return true
  } catch {
    return false
  }
}

test('admin proxy exposes the three required afterFiles rewrites', async () => {
  const source = await readProjectFile('next.config.mjs')

  assert.match(source, /NEXT_PUBLIC_ADMIN_URL/)
  assert.match(source, /trim\(\)/)
  assert.match(source, /replace\(\/\[\\r\\n\]\//)
  assert.match(source, /afterFiles\s*:/)
  assert.match(source, /source:\s*['"]\/admin['"]/)
  assert.match(source, /source:\s*['"]\/admin\/:path\*['"]/)
  assert.match(source, /source:\s*['"]\/api\/admin\/:path\*['"]/)
})

test('admin login is a native POST form and never uses a Server Action', async () => {
  assert.equal(await projectFileExists('app/admin/login/actions.ts'), false)

  const source = await readProjectFile('app/admin/login/page.tsx')
  assert.match(source, /<form[\s\S]*action=["']\/api\/auth\/login["']/)
  assert.match(source, /method=["']post["']/)
  assert.match(source, /name=["']email["']/)
  assert.match(source, /name=["']password["']/)
  assert.doesNotMatch(source, /useActionState|formAction|actions?\.ts/)
})

test('login Route Handler scopes the account, creates a session, and returns both cookies with a 303', async () => {
  const source = await readProjectFile('app/api/auth/login/route.ts')

  assert.match(source, /export\s+async\s+function\s+POST/)
  assert.match(source, /from\(['"]admin_users['"]\)/)
  assert.match(source, /\.eq\(['"]tenant_id['"],\s*tenantId\)/)
  assert.match(source, /bcrypt\.compare\(/)
  assert.match(source, /from\(['"]admin_user_sessions['"]\)\.insert\(/)
  assert.match(source, /NextResponse\.redirect\(new URL\(['"]\/admin['"],\s*request\.url\),\s*303\)/)
  assert.match(source, /cookies\.set\(SESSION_COOKIE,\s*token/)
  assert.match(source, /cookies\.set\(TENANT_COOKIE,\s*tenantId/)
})

test('middleware protects private admin paths while leaving login and logout local', async () => {
  const source = await readProjectFile('middleware.ts')

  assert.match(source, /isPublicAdminPath\(pathname\)/)
  assert.match(source, /request\.cookies\.get\(SESSION_COOKIE\)/)
  assert.match(source, /url\.pathname\s*=\s*['"]\/admin\/login['"]/)
  assert.match(source, /reason['"],\s*['"]unauthorized['"]/)
  assert.match(source, /matcher:\s*\[['"]\/admin\/:path\*['"]\]/)
})

test('server-only Supabase client uses the service role and logout clears both tenant cookies', async () => {
  const session = await readProjectFile('lib/admin-session.ts')
  const serverClient = await readProjectFile('lib/supabase/server.ts')
  const logout = await readProjectFile('app/admin/logout/route.ts')

  assert.match(session, /SESSION_COOKIE\s*=\s*['"]hq_admin_session['"]/)
  assert.match(session, /TENANT_COOKIE\s*=\s*['"]hq_tenant_id['"]/)
  assert.match(serverClient, /SUPABASE_SERVICE_ROLE_KEY/)
  assert.match(serverClient, /persistSession:\s*false/)
  assert.doesNotMatch(serverClient, /NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY/)
  assert.match(logout, /cookies\.set\(SESSION_COOKIE,\s*['"]/)
  assert.match(logout, /cookies\.set\(TENANT_COOKIE,\s*['"]/)
  assert.match(logout, /maxAge:\s*0/)
})
