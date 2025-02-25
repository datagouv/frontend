export function trackEvent(values: Array<unknown>): void {
  globalThis._paq?.push(['trackEvent', ...values])
}
