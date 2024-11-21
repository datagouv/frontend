<template>
  <component
    :is="as"
    class="fr-btn rounded-full disabled:!text-neutral-500 disabled:!border-neutral-200"
    :class="[colors, size, type]"
  >
    <component
      :is="icon"
      v-if="icon"
      class="inline mr-1 size-3"
    />
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  as?: 'a' | 'button'
  color?: 'primary' | 'neutral' | 'red'
  size?: 'sm' | 'md' | 'lg'
  level?: 'primary' | 'secondary'
  icon?: Component
}>(), {
  as: 'button',
  color: 'primary',
  size: 'md',
  level: 'primary',
})

const colors = computed(() => {
  if (props.color === 'neutral') {
    if (props.level === 'primary') {
      return '!bg-neutral-800'
    }
    else {
      return '!text-neutral-800 !border-neutral-800'
    }
  }
  if (props.color === 'red') {
    if (props.level === 'primary') {
      return '!bg-red-600'
    }
    else {
      return '!text-red-600 !border-red-600'
    }
  }
  if (props.level === 'primary') {
    return '!bg-primary'
  }
  return '!text-primary !border-primary'
})

const size = computed(() => {
  if (props.size === 'md') {
    return ''
  }
  return `fr-btn--${props.size}`
})

const type = computed(() => {
  if (props.level === 'primary') {
    return ''
  }
  return `fr-btn--${props.level} border border-solid !shadow-none`
})
</script>
