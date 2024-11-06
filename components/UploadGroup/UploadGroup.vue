<template>
  <div
    class="fr-upload-group"
    :class="containerClass"
  >
    <label
      v-show="showLabel"
      class="fr-label fr-mb-1w"
      :for="id"
    >
      {{ label }}
      <Required :required="required" />
    </label>
    <PaddedContainer
      ref="dropFilesHere"
      color="alt-grey"
      class="fr-grid-row fr-grid-row--middle flex-direction-column border border-default-grey border-dashed text-mention-grey fr-text--bold"
      :class="{ 'border-plain-error': hasError }"
    >
      {{ $t('Drag and drop files') }}
      <p class="fr-hr-or w-50 text-transform-lowercase fr-text--regular fr-mt-3v">
        <span class="fr-hr-or-text">{{ $t('or') }}</span>
      </p>
      <input
        :id="id"
        ref="input"
        class="fr-upload hidden"
        type="file"
        :aria-describedby="ariaDescribedBy"
        :accept="accept"
        :multiple="multiple"
        :required="required"
        :disabled="disabled"
        @change="change"
      >
      <button
        type="button"
        :disabled="disabled"
        class="fr-btn fr-btn--secondary fr-btn--secondary-grey-500"
        :title="$t('Browse')"
        :aria-controls="id"
        @click="open"
      >
        {{ $t('Browse') }}
      </button>
    </PaddedContainer>
    <p
      v-if="hintText"
      :id="hintTextId"
      class="fr-hint-text fr-mb-1w"
    >
      {{ hintText }}
    </p>
    <p
      v-if="isValid"
      :id="validTextId"
      class="fr-valid-text fr-my-0"
    >
      {{ validText }}
    </p>
    <p
      v-else-if="props.hasError"
      :id="errorTextId"
      class="fr-error-text fr-my-0"
    >
      {{ errorText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDropZone } from '@vueuse/core'
import PaddedContainer from '~/components/PaddedContainer/PaddedContainer.vue'
import Required from '~/components/Required/Required.vue'

const props = withDefaults(defineProps<{
  accept?: string
  disabled?: boolean
  errorText?: string
  hasError?: boolean
  hintText?: string
  groupClass?: string
  isValid?: boolean
  label: string
  multiple?: boolean
  required?: boolean
  showLabel?: boolean
  validText?: string
}>(), {
  disabled: false,
  errorText: '',
  hasError: false,
  hintText: '',
  groupClass: '',
  isValid: false,
  multiple: false,
  required: false,
  showLabel: false,
  validText: '',
})

const emit = defineEmits<{
  change: [value: File[]]
  click: []
}>()

const id = useId()

const inputRef = useTemplateRef<HTMLInputElement>('input')

const dropFilesHereRef = useTemplateRef<HTMLDivElement>('dropFilesHere')

const errorTextId = computed(() => id + '-desc-error')
const validTextId = computed(() => id + '-desc-valid')
const hintTextId = computed(() => id + '-desc-hint')
const ariaDescribedBy = computed(() => {
  let describedBy = ''
  if (props.hintText) {
    describedBy += hintTextId.value
  }
  if (props.isValid) {
    describedBy += ' ' + validTextId.value
  }
  else if (props.hasError) {
    describedBy += ' ' + errorTextId.value
  }
  return describedBy
})

const containerClass = computed(() => {
  return {
    [props.groupClass]: true,
    'fr-input-group--disabled': props.disabled,
    'fr-input-group--error': props.hasError,
    'fr-input-group--valid': props.isValid,
  }
})

const open = () => {
  inputRef.value?.click()
}

const onChange = (files: File[] | null) => {
  emit('change', files ?? [])
}

/**
 * Handle input file change event
 */
const change = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  const files = Array.from(target?.files ?? [])
  if (!props.disabled) {
    onChange(files)
  }
}

useDropZone(dropFilesHereRef, onChange)
</script>
