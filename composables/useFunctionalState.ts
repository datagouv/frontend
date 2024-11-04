import useVuelidate, { type ErrorObject } from '@vuelidate/core'
import { toValue } from 'vue'
import type { AccordionFunctionalState, PublishingFormAccordionState } from '~/types/form'

export default function useFunctionalState<T, U>(data: MaybeRef<{ [key in keyof U]: unknown }>, requiredRules: T, warningRules: U, scope: string | boolean = false) {
  // TODO: typing
  const v$ = useVuelidate(requiredRules, data, { $scope: scope })
  const vWarning$ = useVuelidate(warningRules, data, { $scope: 'warning' })

  /**
   * Get the error messages if any for given field
   */
  const getErrorText = (field: string) => {
    if (!v$.value[field]) return

    if (vWarning$.value[field].$dirty) {
      v$.value[field].$touch()
    }
    return v$.value[field].$errors
      .map((error: ErrorObject) => error.$message)
      .join('\n')
  }

  /**
   * Get the warning messages if any for given field
   */
  const getWarningText = (field: string) => {
    if (!vWarning$.value[field]) return

    return vWarning$.value[field].$errors
      .map((error: ErrorObject) => error.$message)
      .join('\n')
  }

  /**
   * Validate all required rules
   */
  const validateRequiredRules = (): Promise<boolean> => {
    vWarning$.value.$validate()
    v$.value.$validate()
    return v$.value.$validate()
  }

  const reset = () => {
    vWarning$.value.$reset()
    v$.value.$reset()
  }

  return {
    getErrorText,
    getFunctionalState,
    getWarningText,
    hasError,
    hasWarning,
    reset,
    validateRequiredRules,
    v$,
    vWarning$,
  }
}

export const getFunctionalState = (dirty: boolean, failRequired: boolean, failWarning: boolean): AccordionFunctionalState => {
  if (!dirty) {
    return 'disabled'
  }
  if (failRequired) {
    return 'error'
  }
  if (failWarning) {
    return 'warning'
  }
  return 'success'
}

export const hasError = (object: MaybeRefOrGetter<Record<string, PublishingFormAccordionState>>, field: string) => toValue(object)[field] === 'error'

export const hasWarning = (object: MaybeRefOrGetter<Record<string, PublishingFormAccordionState>>, field: string) => toValue(object)[field] === 'warning'
