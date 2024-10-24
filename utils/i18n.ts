import type { Composer } from 'vue-i18n'
import type { ValidationRuleWithoutParams } from '@vuelidate/core'
import { createI18nMessage, minLength as vMinLength, not as vNot, required as vRequired, requiredIf as vRequiredIf, sameAs as vSameAs, helpers, type ValidatorWrapper } from '@vuelidate/validators'

const { withMessage } = helpers

function passLocalizedMessageWithArguments(validator: ValidatorWrapper) {
  return (message: string, ...args: Array<unknown>) => withMessage(message, validator(...args))
}

function passLocalizedMessageWithoutArguments(validator: ValidationRuleWithoutParams) {
  return (message: string) => withMessage(message, validator)
}

const t = (message: string) => message

const requiredText = t('The field {property} is required.')

export const createRequired = (i18n: Composer) => {
  const withI18nMessage = createI18nMessage({ t: i18n.t.bind(i18n) })
  return withI18nMessage(vRequired, { messagePath: () => requiredText })
}

export const createRequiredIf = (i18n: Composer) => {
  const withI18nMessage = createI18nMessage({ t: i18n.t.bind(i18n) })
  return withI18nMessage(vRequiredIf, { messagePath: () => requiredText, withArguments: true })
}

export const createMinLength = (i18n: Composer) => {
  const withI18nMessage = createI18nMessage({ t: i18n.t.bind(i18n) })
  return withI18nMessage(vMinLength, { messagePath: () => t('The {property} field has a minimum length of {min}.'), withArguments: true })
}

export const createMinLengthWarning = (i18n: Composer) => {
  const withI18nMessage = createI18nMessage({ t: i18n.t.bind(i18n) })
  return withI18nMessage(vMinLength, { messagePath: () => t(`It's advised to have a {property} of at least {min} characters.`), withArguments: true })
}

export const createSameAs = (i18n: Composer) => {
  const withI18nMessage = createI18nMessage({ t: i18n.t.bind(i18n) })
  return withI18nMessage(vSameAs, { messagePath: () => t('The value must be equal to the ${otherName} value'), withArguments: true })
}

export const requiredWithCustomMessage = passLocalizedMessageWithoutArguments(vRequired)
export const not = passLocalizedMessageWithArguments(vNot)
