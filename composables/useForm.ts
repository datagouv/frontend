export type ValidationFunction<T> = (value: T, key: string, t: (key: string, values?: Record<string, unknown>) => string) => string | null

export type KeysOfUnion<T> = T extends T ? keyof T : never

export type ValidationsRules<Type> = {
  [Property in KeysOfUnion<Type>]?: Array<ValidationFunction<Type[Property]>>;
}
export type ValidationsMessages<Type> = {
  [Property in KeysOfUnion<Type>]?: Array<string>;
}

export type FormInfo<T> = ReturnType<typeof useForm<T>>['formInfo']

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
      const result = rule(form.value[key], key.toString(), t)
      if (result) errors.value[key].push(result)
    }

    warnings.value[key] = []
    for (const rule of warningsRules[key] || []) {
      const result = rule(form.value[key], key.toString(), t)
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

  const warningsAsList = computed<Array<string>>(() => {
    return Object.keys(errors.value).flatMap(key => errors.value[key] || [])
  })
  const errorsAsList = computed<Array<string>>(() => {
    return Object.keys(errors.value).flatMap(key => errors.value[key] || [])
  })

  const validate = () => {
    for (const key of Object.keys(form.value)) {
      touch(key as KeysOfUnion<T>)
    }
    for (const key of Object.keys(form.value)) {
      if (getFirstError(key as KeysOfUnion<T>)) return false
    }

    return true
  }

  const formInfo = { errors, warnings, touch, getFirstError, getFirstWarning, validate, removeErrorsAndWarnings, warningsAsList, errorsAsList }
  return { form, formInfo, ...formInfo }
}

export function required<T>(message: string | null = null): ValidationFunction<T> {
  return (value: T, key: string, t) => {
    if (!value || (Array.isArray(value) && !value.length)) return message || t('The field {property} is required.', { property: t(key) })

    return null
  }
}

export function requiredIf<T>(condition: Ref<boolean>, message: string | null = null): ValidationFunction<T> {
  return (value: T, key: string, t) => {
    if (!condition.value) return null
    if (!value || (Array.isArray(value) && !value.length)) return message || t('The field {property} is required.', { property: t(key) })

    return null
  }
}

export function minLength<T extends string | undefined>(min: number, message: string | null = null): ValidationFunction<T> {
  return (value: T, key: string, t) => {
    if (value && value.length >= min) return null

    return message || t('The field {property} should be of at least {min} characters', { property: t(key), min })
  }
}

export function url<T extends string | undefined>(message: string | null = null): ValidationFunction<T> {
  return (value: T, key: string, t) => {
    if (!value) return null
    try {
      new URL(value)
      return null
    }
    catch {
      return message || t('The field {property} should be a valid URL', { property: t(key) })
    }
  }
}

export function email<T extends string | undefined>(message: string | null = null): ValidationFunction<T> {
  return (value: T, key: string, t) => {
    if (!value) return null
    if (/^\S+@\S+\.\S+$/.exec(value)) return null

    return message || t('The field {property} should be a valid email', { property: t(key) })
  }
}
