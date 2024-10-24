<template>
  <section class="fr-accordion">
    <h3 class="fr-accordion__title">
      <button
        class="fr-accordion__btn text-grey-500"
        :aria-expanded="opened"
        :aria-controls="accordionId"
      >
        <Icon
          v-if="hasState"
          class="fr-mr-2w"
          :class="iconColor"
          :name="icon"
          aria-hidden="true"
        />
        {{ title }}
      </button>
    </h3>
    <div
      :id="accordionId"
      class="fr-collapse"
    >
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AccordionState } from '~/types/form'

const props = withDefaults(defineProps<{
  id: string
  title: string
  opened: boolean
  state: AccordionState
}>(), {
  opened: false,
  state: 'default',
})

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
      return 'text-default-error'
    case 'info':
      return 'text-title-grey'
    case 'success':
      return 'text-default-success'
    case 'warning':
      return 'text-default-warning'
    case 'disabled':
    default:
      return 'text-disabled-grey'
  }
})
</script>
