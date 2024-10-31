<template>
  <HeadlessDisclosure
    as="div"
    class="fr-accordion"
    data-type="accordion"
  >
    <h3 class="fr-accordion__title !mb-0">
      <HeadlessDisclosureButton
        class="fr-accordion__btn !text-neutral-900"
        :aria-expanded="expanded"
        :aria-controls="accordionId"
        @click="toggle"
      >
        <Icon
          v-if="hasState"
          class="fr-mr-2w"
          :class="iconColor"
          :name="icon"
          aria-hidden="true"
          :size="24"
        />
        {{ title }}
      </HeadlessDisclosureButton>
    </h3>
    <HeadlessDisclosurePanel
      v-show="expanded"
      :id="accordionId"
      class="px-4 pt-4 pb-6"
      static
    >
      <slot />
    </HeadlessDisclosurePanel>
  </HeadlessDisclosure>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AccordionState } from '~/types/form'
import { key, type AccordionRegister } from '~/components/Accordion/injectionKey'

const props = withDefaults(defineProps<{
  id: string | undefined
  title: string
  state?: AccordionState
}>(), {
  state: 'default',
})

const register = inject(key) as AccordionRegister

const { expanded, toggle, unregister } = register()

const accordionId = props.id || useId()
const hasState = computed(() => props.state !== 'default')
const icon = computed(() => {
  switch (props.state) {
    case 'error':
      return 'ri:close-line'
    case 'info':
      return 'ri:information-line'
    case 'success':
      return 'ri:check-line'
    case 'warning':
      return 'ri:error-warning-line'
    case 'disabled':
    default:
      return 'ri:subtract-line'
  }
})
const iconColor = computed(() => {
  switch (props.state) {
    case 'error':
      return 'text-red-700'
    case 'info':
      return 'text-neutral-900'
    case 'success':
      return 'text-green-700'
    case 'warning':
      return 'text-amber-700'
    case 'disabled':
    default:
      return 'text-neutral-500'
  }
})
onUnmounted(unregister)
</script>
