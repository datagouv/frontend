<template>
  <Disclosure
    as="div"
    class="fr-accordion"
    data-type="accordion"
  >
    <h3 class="fr-accordion__title !mb-0">
      <DisclosureButton
        class="fr-accordion__btn !text-neutral-900"
        :aria-expanded="expanded"
        :aria-controls="accordionId"
        @click="toggle"
      >
        <component
          :is="icon"
          v-if="hasState"
          class="fr-mr-2w"
          :class="iconColor"
          size="24px"
        />
        {{ title }}
      </DisclosureButton>
    </h3>
    <DisclosurePanel
      v-show="expanded"
      :id="accordionId"
      class="px-4 pt-4 pb-6"
      static
    >
      <slot />
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RiCheckLine, RiCloseLine, RiErrorWarningLine, RiInformationLine, RiSubtractLine } from '@remixicon/vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
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
      return RiCloseLine
    case 'info':
      return RiInformationLine
    case 'success':
      return RiCheckLine
    case 'warning':
      return RiErrorWarningLine
    case 'disabled':
    default:
      return RiSubtractLine
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
