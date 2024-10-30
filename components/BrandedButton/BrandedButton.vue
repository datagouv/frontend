<template>
  <component
    :is="as"
    class="fr-btn disabled:!text-neutral-500 disabled:!border-neutral-200"
    :class="[colors, size, type]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  as?: 'a' | 'button'
  color?: 'primary' | 'neutral' | 'red'
  size?: 'sm' | 'md' | 'lg'
  type: 'primary' | 'secondary'
}>(), {
  as: 'button',
  color: 'primary',
  size: 'md',
  type: 'primary',
})

const colors = computed(() => {
  if (props.color === 'neutral') {
    if (props.type === 'primary') {
      return '!bg-neutral-800'
    }
    else {
      return '!text-neutral-800 !border-neutral-800'
    }
  }
  if (props.color === 'red') {
    if (props.type === 'primary') {
      return '!bg-red-600'
    }
    else {
      return '!text-red-600 !border-red-600'
    }
  }
  if (props.type === 'primary') {
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
  if (props.type === 'primary') {
    return ''
  }
  return `fr-btn--${props.type} border !shadow-none`
})
</script>
