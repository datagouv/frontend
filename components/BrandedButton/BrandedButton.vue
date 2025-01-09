<template>
  <component
    :is="href ? NuxtLinkLocale: 'button'"
    class="inline-flex items-center space-x-1 rounded-full font-medium border !bg-none !no-underline"
    :class="[colors, sizes, isDisabled ? '!opacity-50' : '']"
    :disabled="isDisabled"
    :aria-disabled="isDisabled"
    :role="href ? 'link' : ''"
    :to="isDisabled ? undefined : href"
  >
    <AdminLoader
      v-if="loading"
      size="16"
      :color="color === 'primary' ? 'white' : 'primary'"
    />
    <component
      :is="icon"
      v-else-if="icon"
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

import { NuxtLinkLocale } from '#components'

const props = withDefaults(defineProps<{
  size?: 'xs' | 'sm'
  color?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  loading?: boolean
  icon?: Component
  href?: string
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

const isDisabled = computed(() => props.disabled || props.loading)

const colors = computed(() => {
  return {
    primary: `text-white bg-datagouv-dark !border-datagouv-dark ${!isDisabled.value ? 'hover:!bg-datagouv-hover hover:!border-datagouv-hover' : ''}`,
    secondary: `text-gray-plain bg-white !border-gray-plain ${!isDisabled.value ? '[&&]:hover:!bg-gray-some' : ''}`,
    danger: `!text-danger-dark bg-white !border-danger-dark ${!isDisabled.value ? '[&&]:hover:!bg-gray-some' : ''}`,
  }[props.color]
})

const sizes = computed(() => {
  return {
    sm: `text-sm leading-none ${hasText.value ? 'px-4 py-3' : 'p-2.5'}`,
    xs: `text-xs leading-[0.875rem] ${hasText.value ? 'px-4 py-2' : 'p-2'}`,
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
