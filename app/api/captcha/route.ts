import {
  createSupabaseCaptchaContextFromEnv,
  issueCaptchaChallenge,
  type CaptchaChallengeStore,
} from '../../../lib/inquiry-captcha'

export const dynamic = 'force-dynamic'

type CaptchaRouteDependencies = {
  env?: Record<string, string | undefined>
  secret?: string
  tenantId?: string
  siteScope?: string
  store?: CaptchaChallengeStore
  fetch?: typeof fetch
  now?: () => number
}

const FORM_SCOPE_PATTERN = /^[A-Za-z0-9_-]{16,160}$/
const NO_STORE_HEADERS = { 'Cache-Control': 'no-store, max-age=0' }
const SERVICE_UNAVAILABLE = { error: '验证码服务暂时不可用，请稍后重试' }

export function createCaptchaGetHandler(dependencies: CaptchaRouteDependencies = {}) {
  return async function GET(request: Request) {
    const scope = new URL(request.url).searchParams.get('scope')?.trim() ?? ''
    if (!FORM_SCOPE_PATTERN.test(scope)) {
      return Response.json(
        { error: '验证码请求无效' },
        { status: 400, headers: NO_STORE_HEADERS },
      )
    }

    const env = dependencies.env ?? process.env
    const secret = (dependencies.secret ?? env.CAPTCHA_SECRET)?.trim()
    if (!secret) {
      return Response.json(SERVICE_UNAVAILABLE, { status: 503, headers: NO_STORE_HEADERS })
    }

    try {
      const context = dependencies.store
        ? {
            tenantId: dependencies.tenantId ?? '',
            siteScope: dependencies.siteScope ?? '',
            store: dependencies.store,
          }
        : createSupabaseCaptchaContextFromEnv(env, dependencies.fetch ?? fetch)
      const { svg, token, expiresAt } = await issueCaptchaChallenge({
        secret,
        scope,
        now: dependencies.now?.(),
        ...context,
      })
      return Response.json(
        { svg, token, expiresAt },
        { headers: NO_STORE_HEADERS },
      )
    } catch {
      return Response.json(SERVICE_UNAVAILABLE, { status: 503, headers: NO_STORE_HEADERS })
    }
  }
}

export const GET = createCaptchaGetHandler()
