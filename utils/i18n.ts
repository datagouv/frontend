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

export function formatDate(date: Date | string, options: Intl.DateTimeFormatOptions = {}) {
  date = new Date(date)
  if (!('dateStyle' in options)) {
    options.dateStyle = 'long'
  }
  const locale = useNuxtApp().$i18n.locale.value
  return new Intl.DateTimeFormat(locale, options).format(date)
}

const SECONDS_IN_A_DAY = 3600 * 24

/**
 * Format date as relative from now.
 * It displays "today" or Intl.RelativeTimeFormat content, based on date.
 */
export const formatFromNow = (date: Date | string) => {
  const { t, locale } = useI18n()
  if (!('RelativeTimeFormat' in Intl)) {
    return t('on {date}', { date: formatDate(date) })
  }
  const today = new Date()
  today.setHours(0)
  today.setMinutes(0)
  today.setSeconds(0)
  const dateWithoutTime = new Date(date)
  dateWithoutTime.setHours(0)
  dateWithoutTime.setMinutes(0)
  dateWithoutTime.setSeconds(0)
  // Get the diff in second between today and the provided date
  const diff = Math.round((dateWithoutTime.getTime() - today.getTime()) / 1000)
  const units: Array<{ unit: Intl.RelativeTimeFormatUnit, seconds: number, changeAfter: number }> = [
    {
      unit: 'day',
      seconds: SECONDS_IN_A_DAY,
      changeAfter: 30,
    },
    {
      unit: 'month',
      seconds: SECONDS_IN_A_DAY * 30,
      changeAfter: 12,
    },
    {
      unit: 'year',
      seconds: SECONDS_IN_A_DAY * 365,
      changeAfter: Infinity,
    },
  ]
  const correctUnit = units.find((unit) => {
    const diffInUnit = Math.abs(diff / unit.seconds)
    return diffInUnit < unit.changeAfter
  })!
  return new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' }).format(Math.round(diff / correctUnit?.seconds), correctUnit?.unit)
}

/**
 * Format date relative form now if date is less than a month ago.
 * Otherwise, show a formatted date.
 */
export const formatRelativeIfRecentDate = (date: Date | string) => {
  const { t } = useI18n()
  const today = new Date()
  today.setHours(0)
  today.setMinutes(0)
  today.setSeconds(0)
  const dateWithoutTime = new Date(date)
  dateWithoutTime.setHours(0)
  dateWithoutTime.setMinutes(0)
  dateWithoutTime.setSeconds(0)
  const diff = Math.abs(dateWithoutTime.getTime() - today.getTime())
  if (Math.round(diff / (SECONDS_IN_A_DAY * 30)) >= 1) {
    return t('on {date}', { date: formatDate(date) })
  }
  return formatFromNow(date)
}

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
