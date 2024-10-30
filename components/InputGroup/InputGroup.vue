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
    <textarea
      v-if="type === 'textarea'"
      :id="id"
      class="fr-input"
      :class="{ 'fr-input--error': hasError, 'fr-input--warning': !hasError && hasWarning, 'fr-input--valid': isValid }"
      :aria-describedby="ariaDescribedBy"
      :autocomplete
      :disabled
      :type
      :value="(modelValue as string | undefined)"
      :placeholder
      :required
      :spellcheck
      @change="change"
    />
    <div
      v-else-if="type === 'date'"
      class="fr-mt-1w"
    >
      <ClientOnly>
        <Datepicker
          :id="id"
          class="fr-input"
          :class="{ 'fr-input--error': hasError, 'fr-input--valid': isValid }"
          :aria-describedby="ariaDescribedBy"
          :disabled="disabled"
          :model-value="(modelValue as Date | undefined)"
          :locale="dateLocale"
          input-format="P"
          @change="change"
        />
      </ClientOnly>
    </div>
    <ClientOnly v-else-if="type === 'range'">
      <RangePicker
        :model-value="modelValue"
        @change="change"
      />
    </ClientOnly>
    <MarkdownEditor
      v-else-if="type === 'markdown'"
      :id="id"
      class="fr-mt-1w"
      :class="{ 'fr-input--error': hasError, 'fr-input--warning': !hasError && hasWarning, 'fr-input--valid': isValid }"
      :aria-describedby="ariaDescribedBy"
      :disabled="disabled"
      :value="(modelValue as string | undefined)"
      :placeholder="placeholder"
      :required="required"
      @change="change"
    />
    <input
      v-else
      :id="id"
      class="fr-input"
      :class="{ 'fr-input--error': hasError, 'fr-input--valid': isValid }"
      :aria-describedby="ariaDescribedBy"
      :autocomplete
      :disabled
      :type
      :placeholder
      :value="modelValue"
      :required
      :spellcheck
      @change="change"
    >
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
import { computed, type InputTypeHTMLAttribute } from 'vue'
import Datepicker from 'vue3-datepicker'
import MarkdownEditor from '~/components/MarkdownEditor/MarkdownEditor.vue'
import RangePicker from '~/components/RangePicker/RangePicker.vue'
import Required from '~/components/Required/Required.vue'

export type InputValue = string | undefined | null

export type AllowedInputType = 'date' | 'markdown' | 'range' | 'textarea' | InputTypeHTMLAttribute

const emit = defineEmits<{
  'change': [value: InputValue]
  'update:modelValue': [value: InputValue]
}>()

const props = withDefaults(defineProps<{
  ariaDescribedby?: string
  autocomplete?: string
  disabled?: boolean
  errorText?: string
  hasError?: boolean
  hasWarning?: boolean
  hintText?: string
  isValid?: boolean
  label: string
  modelValue?: string | Date
  placeholder?: string
  required?: boolean
  spellcheck?: boolean
  type?: AllowedInputType
  validText?: string
}>(), {
  ariaDescribedby: '',
  autocomplete: undefined,
  disabled: false,
  errorText: '',
  hasError: false,
  hasWarning: false,
  hintText: '',
  isValid: false,
  modelValue: undefined,
  placeholder: '',
  required: false,
  spellcheck: undefined,
  type: 'text',
  validText: '',
})

const id = useId()
defineExpose({ id })

const nuxtApp = useNuxtApp()

const errorTextId = computed(() => id + '-desc-error')
const validTextId = computed(() => id + '-desc-valid')
const ariaDescribedBy = computed(() => {
  let describedBy = props.ariaDescribedby ? props.ariaDescribedby + ' ' : ''
  if (props.isValid) {
    describedBy += validTextId.value
  }
  else if (props.hasError) {
    describedBy += errorTextId.value
  }
  return describedBy
})

const inputGroupClass = computed(() => {
  return {
    'fr-input-group--disabled': props.disabled,
    'fr-input-group--error': props.hasError,
    'fr-input-group--warning': !props.hasError && props.hasWarning,
    'fr-input-group--valid': props.isValid,
  }
})

const dateLocale = getDatepickerLocale(nuxtApp.$i18n.locale)

function change(event: Event | string | null) {
  let value: InputValue
  if (event instanceof Event) {
    const target = event.target as HTMLSelectElement | HTMLInputElement | null
    value = target?.value
  }
  else {
    value = event
  }

  emit('update:modelValue', value)
  emit('change', value)
}
</script>
