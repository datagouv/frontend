<template>
  <component
    :is="as"
    class="inline-flex items-center space-x-1 rounded-full font-medium border disabled:opacity-75 !bg-none !no-underline"
    :class="[colors, sizes]"
    :disabled="disabled || loading"
  >
    <AdminLoader
      v-if="loading"
      size="16"
      class="text-sm mr-1"
      :color="color === 'primary' ? 'white' : 'primary'"
    />
    <component
      :is="icon"
      v-if="icon"
      class="size-4"
    />
    <span
      v-if="hasText"
      class="whitespace-nowrap"
    ><slot /></span>
  </component>
</template>

<script setup lang="ts">
import type {
  Component,
  Slot,
  VNode,
} from 'vue'

import {
  Comment,
  Text,
} from 'vue'

const props = withDefaults(defineProps<{
  as?: 'a' | 'button'
  size?: 'xs' | 'sm'
  color: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  loading?: boolean
  icon?: Component
}>(), {
  as: 'button',
  color: 'primary',
  size: 'sm',
  level: 'primary',
})

const slots = useSlots()

const hasText = computed(() => {
  return hasSlotContent(slots.default)
})

const colors = computed(() => {
  return {
    primary: 'text-white bg-datagouv-dark !border-datagouv-dark hover:enabled:!bg-datagouv-hover hover:enabled:!border-datagouv-hover',
    secondary: 'text-gray-plain bg-white !border-gray-plain hover:enabled:!bg-gray-some',
    danger: '!text-danger-dark bg-white !border-danger-dark hover:enabled:!bg-gray-some',
  }[props.color]
})

const sizes = computed(() => {
  return {
    sm: `text-sm ${hasText.value ? 'px-4 py-3' : 'p-2.5'}`,
    xs: `text-xs ${hasText.value ? 'px-4 py-2' : 'p-2'}`,
  }[props.size]
})

function hasSlotContent(slot: Slot | undefined, slotProps = {}): boolean {
  if (!slot) return false

  return slot(slotProps).some((vnode: VNode) => {
    if (vnode.type === Comment) return false

    if (Array.isArray(vnode.children) && !vnode.children.length) return false

    return (
      vnode.type !== Text
      || (typeof vnode.children === 'string' && vnode.children.trim() !== '')
    )
  })
}
</script>
