import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import test from 'node:test'

const root = fileURLToPath(new URL('..', import.meta.url))
const read = (relativePath) => readFileSync(path.join(root, relativePath), 'utf8')

function sourceFiles(relativeRoot) {
  const absoluteRoot = path.join(root, relativeRoot)
  if (!existsSync(absoluteRoot)) return []
  const files = []
  for (const entry of readdirSync(absoluteRoot, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue
    const relative = path.join(relativeRoot, entry.name)
    if (entry.isDirectory()) files.push(...sourceFiles(relative))
    else if (/\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) files.push(relative)
  }
  return files
}

test('CAPTCHA core requires a scoped atomic challenge store', () => {
  const source = read("lib/inquiry-captcha.ts")
  assert.match(source, /issueCaptchaChallenge/)
  assert.match(source, /verifyCaptchaSubmission/)
  assert.match(source, /createSupabaseCaptchaStore/)
  assert.match(source, /issue_inquiry_captcha_challenge/)
  assert.match(source, /consume_inquiry_captcha_challenge/)
  assert.doesNotMatch(source, /v:\s*1/)
})
test('CAPTCHA route and field are server-secret, non-cacheable, refreshable, and accessible', () => {
  const route = read("app/api/captcha/route.ts")
  const field = read("components/inquiry-captcha-field.tsx")
  assert.match(route, /(?:process\.env|env)\.CAPTCHA_SECRET/)
  assert.doesNotMatch(route, /NEXT_PUBLIC_CAPTCHA/)
  assert.match(route, /Cache-Control['"]?:?\s*['"]?no-store/i)
  assert.match(field, /\/api\/captcha\?scope=/)
  assert.match(field, /captchaToken/)
  assert.match(field, /captchaAnswer/)
  assert.match(field, /refreshKey/)
  assert.match(field, /4 位验证码图片/)
  assert.match(field, /换一张/)
  assert.doesNotMatch(field, /CAPTCHA_SECRET/)
})

test('every real inquiry form carries the challenge and refreshes it after rejection', () => {
  for (const relativePath of ["components/contact-form.tsx"]) {
    const form = read(relativePath)
    assert.match(form, /InquiryCaptchaField/, relativePath)
    assert.match(form, /captchaToken/, relativePath)
    assert.match(form, /captchaAnswer/, relativePath)
    assert.match(form, /captchaScope/, relativePath)
    assert.match(form, /captchaRefreshKey/, relativePath)
  }
})

test('every inquiry insert is guarded on the server before persistence', () => {
  const files = ["app","components","lib"].flatMap(sourceFiles)
  const persistenceFiles = files.filter((relativePath) => /from\s*\(\s*['"]inquiries['"]\s*\)[\s\S]{0,500}?\.insert\s*\(/.test(read(relativePath)))
  assert.ok(persistenceFiles.length > 0, 'expected at least one real inquiry insert')
  for (const relativePath of persistenceFiles) {
    const source = read(relativePath)
    const verifyIndex = source.indexOf('verifyCaptchaSubmission(')
    const insertMatch = /from\s*\(\s*['"]inquiries['"]\s*\)[\s\S]{0,500}?\.insert\s*\(/.exec(source)
    assert.ok(verifyIndex >= 0, relativePath + ' can insert without server CAPTCHA verification')
    assert.ok(insertMatch && verifyIndex < insertMatch.index, relativePath + ' verifies CAPTCHA after persistence')
    assert.match(source, /captchaToken/)
    assert.match(source, /captchaAnswer/)
    assert.match(source, /captchaScope/)
    assert.match(source, /createSupabaseCaptchaContextFromEnv/)
    assert.match(source, /process\.env\.CAPTCHA_SECRET/)
    assert.match(source, /if\s*\(\s*!captcha(?:Result)?\.ok\s*\)/)
  }
})
