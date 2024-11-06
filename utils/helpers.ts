export function humanJoin(array: Array<string>): string {
  const nuxtApp = useNuxtApp()
  if (!array.length) return ''
  if (array.length === 1) return array[0]

  const last = array.pop()
  return `${array.join(', ')} ${nuxtApp.$i18n.t('and')} ${last}`
}
