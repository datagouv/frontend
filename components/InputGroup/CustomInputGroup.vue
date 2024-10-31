<template>
  <div
    class="fr-input-group"
    :class="inputGroupClass"
  >
    <label
      class="fr-label"
      :for="id"
    >
      {{ label }}
      <Required :required="required" />
      <span
        v-if="hintText"
        class="fr-hint-text"
      >{{ hintText }}</span>
    </label>
    <slot :aria-described-by />
    <p
      v-if="isValid"
      :id="validTextId"
      class="fr-valid-text"
    >
      {{ validText }}
    </p>
    <p
      v-else-if="props.hasError"
      :id="errorTextId"
      class="fr-error-text"
    >
      {{ errorText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Required from '~/components/Required/Required.vue'

export type InputValue = string | undefined | null

const props = withDefaults(defineProps<{
  ariaDescribedby?: string | null
  disabled?: boolean
  errorText?: string
  hasError?: boolean
  hasWarning?: boolean
  hintText?: string
  isValid?: boolean
  label: string
  required?: boolean
  validText?: string
}>(), {
  ariaDescribedby: '',
  disabled: false,
  errorText: '',
  hasError: false,
  hasWarning: false,
  hintText: '',
  isValid: false,
  required: false,
  validText: '',
})

const id = useId()

const errorTextId = useId() as string
const validTextId = useId() as string
const ariaDescribedBy = computed(() => {
  const describedBy = props.ariaDescribedby ? [props.ariaDescribedby] : []
  if (props.isValid) {
    describedBy.push(validTextId)
  }
  else if (props.hasError) {
    describedBy.push(errorTextId)
  }
  return describedBy.join(' ')
})

const inputGroupClass = computed(() => {
  return {
    'fr-input-group--disabled': props.disabled,
    'fr-input-group--error': props.hasError,
    'fr-input-group--warning': !props.hasError && props.hasWarning,
    'fr-input-group--valid': props.isValid,
  }
})
</script>
