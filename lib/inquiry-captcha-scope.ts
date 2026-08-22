export type RandomValuesCrypto = {
  getRandomValues<T extends ArrayBufferView | null>(array: T): T
}

export function createInquiryCaptchaScope(
  cryptoApi: RandomValuesCrypto = globalThis.crypto,
) {
  if (!cryptoApi?.getRandomValues) {
    throw new Error('Web Crypto getRandomValues is required for CAPTCHA scope generation')
  }
  const bytes = new Uint8Array(16)
  cryptoApi.getRandomValues(bytes)
  return `captcha_${Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('')}`
}

export function createLatestCaptchaRequestController() {
  let current: AbortController | null = null
  return {
    begin() {
      current?.abort()
      current = new AbortController()
      return current
    },
    isCurrent(controller: AbortController) {
      return current === controller && !controller.signal.aborted
    },
    abortCurrent() {
      current?.abort()
      current = null
    },
  }
}
