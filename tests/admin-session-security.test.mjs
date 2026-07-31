import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import ts from 'typescript'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const readProjectFile = (relativePath) =>
  readFile(resolve(repositoryRoot, relativePath), 'utf8')

async function loadAdminPathPolicy() {
  const source = await readProjectFile('lib/admin-paths.ts')
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText
  return import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`)
}

test('admin public paths match login and logout by complete path segment only', async () => {
  const { isPublicAdminPath } = await loadAdminPathPolicy()

  for (const pathname of [
    '/admin/login',
    '/admin/login/reset',
    '/admin/logout',
    '/admin/logout/complete',
  ]) {
    assert.equal(isPublicAdminPath(pathname), true, `${pathname} must remain public`)
  }

  for (const pathname of [
    '/admin',
    '/admin/login-evil',
    '/admin/logins',
    '/admin/logout-anything',
    '/admin/logoutx',
  ]) {
    assert.equal(isPublicAdminPath(pathname), false, `${pathname} must require a session`)
  }
})

test('middleware delegates public-path matching to the segment-safe policy', async () => {
  const source = await readProjectFile('middleware.ts')

  assert.match(source, /import\s*\{\s*isPublicAdminPath\s*\}\s*from\s*['"]@\/lib\/admin-paths['"]/)
  assert.match(source, /const\s+isPublicAdminPathname\s*=\s*isPublicAdminPath\(pathname\)/)
  assert.doesNotMatch(source, /pathname\.startsWith\(['"]\/admin\/(?:login|logout)['"]\)/)
})

test('logout revokes the current database session before clearing both cookies', async () => {
  const source = await readProjectFile('app/admin/logout/route.ts')
  const deleteIndex = source.search(/from\(['"]admin_user_sessions['"]\)\.delete\(\)\.eq\(['"]token['"],\s*token\)/)
  const clearSessionIndex = source.search(/cookies\.set\(SESSION_COOKIE,\s*['"]/)
  const clearTenantIndex = source.search(/cookies\.set\(TENANT_COOKIE,\s*['"]/)

  assert.match(source, /request\.cookies\.get\(SESSION_COOKIE\)\?\.value/)
  assert.notEqual(deleteIndex, -1)
  assert.notEqual(clearSessionIndex, -1)
  assert.notEqual(clearTenantIndex, -1)
  assert.ok(deleteIndex < clearSessionIndex)
  assert.ok(deleteIndex < clearTenantIndex)
})
