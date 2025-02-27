<template>
  <button
    :class="`fr-btn fr-btn--tertiary-no-outline text-gray-380 fr-btn--darker-hover align-middle ${sizeClass} ${icon}`"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size: 'xs' | 'sm' | 'md' | 'lg'
  icon: string
}>(), {
  size: 'xs',
  icon: 'fr-icon-information-line',
})

const sizeClass = computed(() => {
  if (props.size === 'md') {
    return ''
  }
  if (props.size === 'xs') {
    return `fr-btn--${props.size} fr-icon--sm`
  }
  return `fr-btn--${props.size}`
})
</script>
