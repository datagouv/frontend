<template>
  <component
    :is="as"
    class="fr-accordions-group"
  >
    <slot ref="" />
  </component>
</template>

<script setup lang="ts">
import { key } from '~/components/Accordion/injectionKey'

withDefaults(defineProps<{
  as?: string
}>(), {
  as: 'div',
})

const opened = ref<symbol | null>(null)

provide(key, () => {
  const id = Symbol()

  return {
    expanded: computed(() => opened.value === id),

    toggle() {
      opened.value = id
    },

    unregister() {
      if (opened.value === id) {
        opened.value = null
      }
    },
  }
})
</script>
