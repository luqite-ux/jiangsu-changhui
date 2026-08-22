import assert from 'node:assert/strict'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import test from 'node:test'

const root = fileURLToPath(new URL('..', import.meta.url))
process.env.NODE_ENV = 'test'
const captcha = await import(pathToFileURL(path.join(root, 'lib/inquiry-captcha.ts')).href)
const secret = 'x'.repeat(32)
const tenantId = '11111111-1111-4111-8111-111111111111'
const siteScope = 'jiangsu-changhui'
const scope = 'captcha_form_scope_1234567890'

class MemoryChallengeStore {
  rows = new Map()

  key(record) {
    return [record.tenantId, record.siteScopeHash, record.formScopeHash].join(':')
  }

  async issue(record) {
    this.rows.set(this.key(record), { ...record, consumed: false })
  }

  async consume(record) {
    const current = this.rows.get(this.key(record))
    const now = record.now ?? Date.now()
    if (
      !current || current.consumed || current.challengeHash !== record.challengeHash ||
      record.tokenHash !== current.tokenHash || now > current.expiresAt
    ) return false
    current.consumed = true
    return true
  }
}

test('a scoped CAPTCHA challenge can be consumed atomically only once', async () => {
  assert.equal(typeof captcha.issueCaptchaChallenge, 'function')
  assert.equal(typeof captcha.verifyCaptchaSubmission, 'function')
  const store = new MemoryChallengeStore()
  const challenge = await captcha.issueCaptchaChallenge({
    secret, tenantId, siteScope, scope, store, now: 1_000,
  })
  assert.ok(challenge.testAnswer)
  const request = {
    secret, tenantId, siteScope, scope, store,
    token: challenge.token,
    answer: challenge.testAnswer,
    now: 1_001,
  }

  const results = await Promise.all([
    captcha.verifyCaptchaSubmission(request),
    captcha.verifyCaptchaSubmission(request),
  ])
  assert.equal(results.filter((result) => result.ok).length, 1)
  assert.equal(results.filter((result) => !result.ok).length, 1)
})

test('refreshing one form scope does not invalidate a separate mounted form', async () => {
  const store = new MemoryChallengeStore()
  const scopeB = 'captcha_second_scope_1234567890'
  const oldA = await captcha.issueCaptchaChallenge({ secret, tenantId, siteScope, scope, store, now: 1_000 })
  const currentB = await captcha.issueCaptchaChallenge({ secret, tenantId, siteScope, scope: scopeB, store, now: 1_000 })
  const currentA = await captcha.issueCaptchaChallenge({ secret, tenantId, siteScope, scope, store, now: 1_001 })

  assert.deepEqual(await captcha.verifyCaptchaSubmission({ secret, tenantId, siteScope, scope, store, token: oldA.token, answer: oldA.testAnswer, now: 1_002 }), { ok: false, code: 'invalid' })
  assert.deepEqual(await captcha.verifyCaptchaSubmission({ secret, tenantId, siteScope, scope: scopeB, store, token: currentB.token, answer: currentB.testAnswer, now: 1_002 }), { ok: true })
  assert.deepEqual(await captcha.verifyCaptchaSubmission({ secret, tenantId, siteScope, scope, store, token: currentA.token, answer: currentA.testAnswer, now: 1_002 }), { ok: true })
})
