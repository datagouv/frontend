export type ValidationFunction<T> = (value: T, t: (key: string, values?: Record<string, unknown>) => string) => string | null

export type KeysOfUnion<T> = T extends T ? keyof T : never

export type ValidationsRules<Type> = {
  [Property in KeysOfUnion<Type>]?: Array<ValidationFunction<Type[Property]>>;
}
export type ValidationsMessages<Type> = {
  [Property in KeysOfUnion<Type>]?: Array<string>;
}

export function useForm<T>(initialValues: MaybeRef<T>, errorsRules: ValidationsRules<T> = {}, warningsRules: ValidationsRules<T> = {}) {
  const { t } = useI18n()

  const form = toRef(initialValues)
  const errors = ref({} as ValidationsMessages<T>)
  const warnings = ref({} as ValidationsMessages<T>)

  const removeErrorsAndWarnings = () => {
    errors.value = {}
    warnings.value = {}
  }

  const touch = (key: KeysOfUnion<T>) => {
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

  const getFirst = (bag: ValidationsMessages<T>, key: KeysOfUnion<T>): string | null => {
    if (!bag[key]) return null
    if (!bag[key].length) return null

    return bag[key][0]
  }
  const getFirstError = (key: KeysOfUnion<T>): string | null => getFirst(errors.value, key)
  const getFirstWarning = (key: KeysOfUnion<T>): string | null => getFirst(warnings.value, key)

  const validate = () => {
    for (const key of Object.keys(form.value)) {
      touch(key as KeysOfUnion<T>)
    }
    for (const key of Object.keys(form.value)) {
      if (getFirstError(key as KeysOfUnion<T>)) return false
    }

    return true
  }

  return { form, errors, warnings, touch, getFirstError, getFirstWarning, validate, removeErrorsAndWarnings }
}

export function required<T>(message: string | null = null): ValidationFunction<T> {
  return (value: T, t) => {
    if (!value || (Array.isArray(value) && !value.length)) return message || t('The field is required')

    return null
  }
}

export function requiredIf<T>(condition: Ref<boolean>, message: string | null = null): ValidationFunction<T> {
  return (value: T, t) => {
    if (!condition.value) return null
    if (!value || (Array.isArray(value) && !value.length)) return message || t('The field is required')

    return null
  }
}

export function minLength<T extends string | undefined>(min: number, message: string | null = null): ValidationFunction<T> {
  return (value: T, t) => {
    if (value && value.length >= min) return null

    return message || t('The field should be of at least {min} characters', { min })
  }
}
