import { enUS, es as esES, fr as frFR } from 'date-fns/locale'
import type { Composer } from 'vue-i18n'
import { createI18nMessage, minLength as vMinLength, required as vRequired } from '@vuelidate/validators'

const dateLocales = { frFR, enUS, esES }

const isLangKey = (value: string): value is keyof typeof dateLocales => {
  return Object.keys(dateLocales).includes(value)
}

export function getDatepickerLocale(lang: keyof typeof dateLocales | string) {
  if (isLangKey(lang)) {
    return dateLocales[lang]
  }
  return undefined
}

// Re-export from `shared` to simplify migration, TODO change?
export { formatDate, formatFromNow, formatRelativeIfRecentDate } from '@datagouv/components-next'

const t = (message: string) => message

const requiredText = t('The field {property} is required.')

export const createRequired = (i18n: Composer) => {
  const withI18nMessage = createI18nMessage({ t: i18n.t.bind(i18n) })
  return withI18nMessage(vRequired, { messagePath: () => requiredText })
}

export const createMinLengthWarning = (i18n: Composer) => {
  const withI18nMessage = createI18nMessage({ t: i18n.t.bind(i18n) })
  return withI18nMessage(vMinLength, { messagePath: () => t(`It's advised to have a {property} of at least {min} characters.`), withArguments: true })
}
