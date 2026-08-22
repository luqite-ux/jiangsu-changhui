import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto'

const CAPTCHA_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
const CAPTCHA_LENGTH = 4
const CAPTCHA_TTL_MS = 5 * 60 * 1_000
const FORM_SCOPE_PATTERN = /^[A-Za-z0-9_-]{16,160}$/
const TENANT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const GLYPH_PIXELS: Record<string, readonly string[]> = {
  '2': ['11110', '00001', '00001', '11110', '10000', '10000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['10010', '10010', '10010', '11111', '00010', '00010', '00010'],
  '5': ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
  '6': ['01111', '10000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00001', '11110'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
}


type CaptchaPayload = {
  v: 2
  iat: number
  exp: number
  n: string
  ah: string
  cid: string
  scope: string
  tenantHash: string
  siteHash: string
}

export type CaptchaChallenge = {
  svg: string
  token: string
  expiresAt: number
  testAnswer?: string
}

export type CaptchaVerification =
  | { ok: true }
  | { ok: false; code: 'missing' | 'invalid' | 'expired' }

export type CaptchaChallengeIssueRecord = {
  tenantId: string
  siteScopeHash: string
  formScopeHash: string
  challengeHash: string
  tokenHash: string
  expiresAt: number
}

export type CaptchaChallengeConsumeRecord = Omit<CaptchaChallengeIssueRecord, 'expiresAt' | 'tokenHash'> & {
  tokenHash: string | null
  now?: number
}

export type CaptchaChallengeStore = {
  issue(record: CaptchaChallengeIssueRecord): void | Promise<void>
  consume(record: CaptchaChallengeConsumeRecord): boolean | Promise<boolean>
}

type CaptchaContext = {
  secret: string
  tenantId: string
  siteScope: string
  scope: string
  token: string
  now?: number
}

type TokenRecord = {
  payload: CaptchaPayload
  actualSignature: string
  expectedSignature: string
  consumeRecord: CaptchaChallengeConsumeRecord
}

function assertSecret(secret: string) {
  if (secret.trim().length < 32) {
    throw new Error('CAPTCHA_SECRET must contain at least 32 characters')
  }
}

function assertTenantId(tenantId: string) {
  const normalized = tenantId?.trim() ?? ''
  if (!TENANT_ID_PATTERN.test(normalized)) {
    throw new Error('NEXT_PUBLIC_TENANT_ID must be a UUID')
  }
  return normalized
}

function assertSiteScope(siteScope: string) {
  const normalized = siteScope?.trim() ?? ''
  if (!normalized || normalized.length > 200) {
    throw new Error('CAPTCHA_SITE_SCOPE must contain 1 to 200 characters')
  }
  return normalized
}

function assertFormScope(scope: string) {
  const normalized = scope?.trim() ?? ''
  if (!FORM_SCOPE_PATTERN.test(normalized)) {
    throw new Error('captchaScope must contain 16 to 160 URL-safe characters')
  }
  return normalized
}

function normalizeAnswer(answer: string) {
  return answer.trim().toUpperCase()
}

function digest(secret: string, value: string) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

function hashValue(value: string) {
  return createHash('sha256').update(value).digest('base64url')
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

function decimal(value: number) {
  return Math.round(value * 10) / 10
}

function renderSvg(answer: string, nonce: string) {
  const seed = Buffer.from(nonce, 'base64url')
  const glyphs = [...answer]
    .map((character, index) => {
      const pixels = GLYPH_PIXELS[character]
      const originX = 13 + index * 36
      const originY = 9 + (seed[(index + 11) % seed.length] % 5) - 2
      const rotation = (seed[(index + 7) % seed.length] % 15) - 7
      const commands: string[] = []
      for (let row = 0; row < pixels.length; row += 1) {
        for (let column = 0; column < pixels[row].length; column += 1) {
          if (pixels[row][column] !== '1') continue
          const noise = seed[(index * 9 + row * 5 + column) % seed.length]
          const x = decimal(originX + column * 4.3 + ((noise & 3) - 1.5) * 0.2)
          const y = decimal(originY + row * 5.2 + (((noise >> 2) & 3) - 1.5) * 0.2)
          const width = decimal(3.5 + ((noise >> 4) & 1) * 0.3)
          const height = decimal(4.3 + ((noise >> 5) & 1) * 0.3)
          commands.push(`M${x} ${y}h${width}v${height}h-${width}Z`)
        }
      }
      return `<path d="${commands.join('')}" transform="rotate(${rotation} ${originX + 10} 28)"/>`
    })
    .join('')

  const lines = [0, 1, 2]
    .map((index) => {
      const offset = index * 4
      const y1 = 8 + (seed[offset] % 43)
      const y2 = 8 + (seed[offset + 1] % 43)
      return `<path d="M 3 ${y1} C 42 ${y2}, 106 ${y1}, 157 ${y2}" />`
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="56" viewBox="0 0 160 56" role="img" aria-label="验证码图片"><rect width="160" height="56" rx="8" fill="#f8fafc"/><g fill="none" stroke="#94a3b8" stroke-width="1" opacity=".55">${lines}</g><g fill="#0f172a">${glyphs}</g></svg>`
}


function contextHashes(tenantId: string, siteScope: string, scope: string) {
  return {
    tenantId: assertTenantId(tenantId),
    siteScopeHash: hashValue(assertSiteScope(siteScope)),
    formScopeHash: hashValue(assertFormScope(scope)),
  }
}

function parseTokenRecord(input: CaptchaContext): TokenRecord | null {
  assertSecret(input.secret)
  const scope = assertFormScope(input.scope)
  const context = contextHashes(input.tenantId, input.siteScope, scope)
  const token = input.token?.trim() ?? ''
  const [encodedPayload, actualSignature, extra] = token.split('.')
  if (!encodedPayload || !actualSignature || extra) return null

  let payload: CaptchaPayload
  try {
    payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as CaptchaPayload
  } catch {
    return null
  }

  if (
    payload.v !== 2
    || !Number.isFinite(payload.iat)
    || !Number.isFinite(payload.exp)
    || typeof payload.n !== 'string'
    || typeof payload.ah !== 'string'
    || typeof payload.cid !== 'string'
    || payload.scope !== scope
    || payload.tenantHash !== hashValue(context.tenantId)
    || payload.siteHash !== context.siteScopeHash
  ) {
    return null
  }

  const expectedSignature = digest(input.secret, `token:${encodedPayload}`)
  const canonicalToken = `${encodedPayload}.${expectedSignature}`
  return {
    payload,
    actualSignature,
    expectedSignature,
    consumeRecord: {
      ...context,
      challengeHash: hashValue(payload.cid),
      tokenHash: hashValue(canonicalToken),
      now: input.now,
    },
  }
}

function createChallenge(input: {
  secret: string
  tenantId: string
  siteScope: string
  scope: string
  now: number
}) {
  assertSecret(input.secret)
  const scope = assertFormScope(input.scope)
  const context = contextHashes(input.tenantId, input.siteScope, scope)
  const answer = Array.from(
    { length: CAPTCHA_LENGTH },
    () => CAPTCHA_ALPHABET[randomInt(CAPTCHA_ALPHABET.length)],
  ).join('')
  const nonce = randomBytes(16).toString('base64url')
  const challengeId = randomBytes(16).toString('base64url')
  const expiresAt = input.now + CAPTCHA_TTL_MS
  const payload: CaptchaPayload = {
    v: 2,
    iat: input.now,
    exp: expiresAt,
    n: nonce,
    cid: challengeId,
    scope,
    tenantHash: hashValue(context.tenantId),
    siteHash: context.siteScopeHash,
    ah: digest(
      input.secret,
      `answer:${nonce}:${answer}:${scope}:${context.tenantId}:${context.siteScopeHash}:${challengeId}`,
    ),
  }
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = digest(input.secret, `token:${encodedPayload}`)
  const token = `${encodedPayload}.${signature}`
  return {
    challenge: {
      svg: renderSvg(answer, nonce),
      token,
      expiresAt,
      ...(process.env.NODE_ENV === 'test' ? { testAnswer: answer } : {}),
    } satisfies CaptchaChallenge,
    issueRecord: {
      ...context,
      challengeHash: hashValue(challengeId),
      tokenHash: hashValue(token),
      expiresAt,
    } satisfies CaptchaChallengeIssueRecord,
  }
}

export async function issueCaptchaChallenge(input: {
  secret: string
  tenantId: string
  siteScope: string
  scope: string
  store: CaptchaChallengeStore
  now?: number
}): Promise<CaptchaChallenge> {
  if (!input.store?.issue) throw new Error('CAPTCHA challenge store is required')
  const generated = createChallenge({ ...input, now: input.now ?? Date.now() })
  await input.store.issue(generated.issueRecord)
  return generated.challenge
}

export function verifyCaptcha(input: CaptchaContext & { answer: string }): CaptchaVerification {
  const token = input.token?.trim() ?? ''
  const scope = input.scope?.trim() ?? ''
  if (!token || !scope) return { ok: false, code: 'missing' }

  let record: TokenRecord | null
  try {
    record = parseTokenRecord(input)
  } catch {
    return { ok: false, code: 'invalid' }
  }
  if (!record) return { ok: false, code: 'invalid' }
  if (!safeEqual(record.actualSignature, record.expectedSignature)) {
    return { ok: false, code: 'invalid' }
  }

  const now = input.now ?? Date.now()
  if (now > record.payload.exp) return { ok: false, code: 'expired' }

  const answer = normalizeAnswer(input.answer ?? '')
  if (!answer) return { ok: false, code: 'missing' }
  const answerHash = digest(
    input.secret,
    `answer:${record.payload.n}:${answer}:${record.payload.scope}:${record.consumeRecord.tenantId}:${record.consumeRecord.siteScopeHash}:${record.payload.cid}`,
  )
  return safeEqual(record.payload.ah, answerHash) ? { ok: true } : { ok: false, code: 'invalid' }
}

export async function consumeCaptchaChallenge(input: CaptchaContext & {
  store: CaptchaChallengeStore
}): Promise<boolean> {
  if (!input.store?.consume) throw new Error('CAPTCHA challenge store is required')
  let record: TokenRecord | null
  try {
    record = parseTokenRecord(input)
  } catch {
    return false
  }
  if (!record) return false
  const signatureMatches = safeEqual(record.actualSignature, record.expectedSignature)
  return Boolean(await input.store.consume({
    ...record.consumeRecord,
    tokenHash: signatureMatches ? record.consumeRecord.tokenHash : null,
  }))
}

export async function verifyCaptchaSubmission(input: CaptchaContext & {
  answer: string
  store: CaptchaChallengeStore
}): Promise<CaptchaVerification> {
  const verification = verifyCaptcha(input)
  const consumed = await consumeCaptchaChallenge(input)
  if (!verification.ok) return verification
  return consumed ? { ok: true } : { ok: false, code: 'invalid' }
}

function requireStoreValue(name: string, value: string | undefined) {
  const normalized = value?.trim() ?? ''
  if (!normalized) throw new Error(`${name} is required for the CAPTCHA challenge store`)
  return normalized
}

async function rpcRequest(input: {
  supabaseUrl: string
  serviceRoleKey: string
  fetchImpl: typeof fetch
  functionName: string
  body: Record<string, unknown>
}) {
  const response = await input.fetchImpl(
    `${input.supabaseUrl}/rest/v1/rpc/${input.functionName}`,
    {
      method: 'POST',
      headers: {
        apikey: input.serviceRoleKey,
        authorization: `Bearer ${input.serviceRoleKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(input.body),
      cache: 'no-store',
    },
  )
  if (!response.ok) {
    throw new Error(`CAPTCHA challenge store RPC failed with HTTP ${response.status}`)
  }
  return response.json()
}

export function createSupabaseCaptchaStore(input: {
  supabaseUrl: string
  serviceRoleKey: string
  fetch?: typeof fetch
}): CaptchaChallengeStore {
  const supabaseUrl = requireStoreValue('NEXT_PUBLIC_SUPABASE_URL', input.supabaseUrl).replace(/\/+$/, '')
  new URL(supabaseUrl)
  const serviceRoleKey = requireStoreValue('SUPABASE_SERVICE_ROLE_KEY', input.serviceRoleKey)
  const fetchImpl = input.fetch ?? fetch

  return {
    async issue(record) {
      const result = await rpcRequest({
        supabaseUrl,
        serviceRoleKey,
        fetchImpl,
        functionName: 'issue_inquiry_captcha_challenge',
        body: {
          p_tenant_id: record.tenantId,
          p_site_scope_hash: record.siteScopeHash,
          p_form_scope_hash: record.formScopeHash,
          p_challenge_hash: record.challengeHash,
          p_token_hash: record.tokenHash,
          p_expires_at: new Date(record.expiresAt).toISOString(),
        },
      })
      if (result !== true) throw new Error('CAPTCHA challenge issue RPC did not confirm replacement')
    },
    async consume(record) {
      const result = await rpcRequest({
        supabaseUrl,
        serviceRoleKey,
        fetchImpl,
        functionName: 'consume_inquiry_captcha_challenge',
        body: {
          p_tenant_id: record.tenantId,
          p_site_scope_hash: record.siteScopeHash,
          p_form_scope_hash: record.formScopeHash,
          p_challenge_hash: record.challengeHash,
          p_token_hash: record.tokenHash,
        },
      })
      return result === true
    },
  }
}

export function createSupabaseCaptchaContextFromEnv(
  env: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch,
) {
  const tenantId = assertTenantId(requireStoreValue('NEXT_PUBLIC_TENANT_ID', env.NEXT_PUBLIC_TENANT_ID))
  const siteScope = assertSiteScope(requireStoreValue('CAPTCHA_SITE_SCOPE', env.CAPTCHA_SITE_SCOPE))
  return {
    tenantId,
    siteScope,
    store: createSupabaseCaptchaStore({
      supabaseUrl: requireStoreValue('NEXT_PUBLIC_SUPABASE_URL', env.NEXT_PUBLIC_SUPABASE_URL),
      serviceRoleKey: requireStoreValue('SUPABASE_SERVICE_ROLE_KEY', env.SUPABASE_SERVICE_ROLE_KEY),
      fetch: fetchImpl,
    }),
  }
}
