export type ValidationFunction<T> = (value: T, t) => string | null

type ValidationsRules<Type> = {
  [Property in keyof Type]?: Array<ValidationFunction<Type[Property]>>;
}
type ValidationsMessages<Type> = {
  [Property in keyof Type]?: Array<string>;
}

export function useForm<T>(initialValues: T, errorsRules: ValidationsRules<T> = {}, warningsRules: ValidationsRules<T> = {}) {
  const { t } = useI18n()

  const form = ref({ ...initialValues })
  const errors = ref({} as ValidationsMessages<T>)
  const warnings = ref({} as ValidationsMessages<T>)

  const touch = (key: keyof T) => {
    errors.value[key] = []

    for (const rule of errorsRules[key] || []) {
      const result = rule(form.value[key], t)
      if (result) errors.value[key].push(result)
    }

    warnings.value[key] = []
    for (const rule of warningsRules[key] || []) {
      const result = rule(form.value[key], t)
      if (result) warnings.value[key].push(result)
    }
  }

  const getFirst = (bag: ValidationsMessages<T>, key: keyof T): string | null => {
    if (!bag[key]) return null
    if (!bag[key].length) return null

    return bag[key][0]
  }
  const getFirstError = (key: keyof T): string | null => getFirst(errors.value, key)
  const getFirstWarning = (key: keyof T): string | null => getFirst(warnings.value, key)

  return { form, errors, warnings, touch, getFirstError, getFirstWarning }
}

export function required<T>(message: string | null = null): ValidationFunction<T> {
  return (value: T, t) => {
    if (!value || (Array.isArray(value) && !value.length)) return message || t('The field is required')

    return null
  }
}

export function minLength<T extends string>(min: number, message: string | null = null): ValidationFunction<T> {
  return (value: T, t) => {
    if (value.length >= min) return null

    return message || t('The field is too short')
  }
}
