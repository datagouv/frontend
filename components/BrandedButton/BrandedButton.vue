<template>
  <component
    :is="href ? NuxtLinkLocale: 'button'"
    class="inline-flex items-center space-x-1 rounded-full font-medium border !bg-none !no-underline"
    :class="[colors, sizes, isDisabled ? '!opacity-50' : '']"
    :disabled="isDisabled"
    aria-disabled="isDisabled"
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
import { bannerActionTypeKey } from '~/components/BannerAction.vue'

import { NuxtLinkLocale } from '#components'

type ColorType = 'primary' | 'primary-soft' | 'secondary' | 'warning' | 'danger'

const props = defineProps<{
  size?: 'xs' | 'sm'
  color?: ColorType
  disabled?: boolean
  loading?: boolean
  icon?: Component
  href?: string
}>()

const slots = useSlots()

const size = computed(() => {
  if (props.size) return props.size
  if (bannerActionType) return 'xs'
  return 'sm'
})

const color = computed<ColorType>(() => {
  if (props.color) return props.color
  if (bannerActionType) {
    return {
      primary: 'primary-soft' as ColorType,
      warning: 'warning' as ColorType,
      danger: 'danger' as ColorType,
    }[bannerActionType]
  }
  return 'primary'
})

const hasText = computed(() => {
  return hasSlotContent(slots.default)
})
const bannerActionType = inject(bannerActionTypeKey, null)

const isDisabled = computed(() => props.disabled || props.loading)

const colors = computed(() => {
  return {
    'primary': `text-white bg-datagouv-dark !border-datagouv-dark ${!isDisabled.value ? 'hover:!bg-datagouv-hover hover:!border-datagouv-hover' : ''}`,
    'primary-soft': `text-datagouv-dark bg-white !border-datagouv-dark ${!isDisabled.value ? '[&&]:hover:!bg-gray-some' : ''}`,
    'secondary': `text-gray-plain bg-white !border-gray-plain ${!isDisabled.value ? '[&&]:hover:!bg-gray-some' : ''}`,
    'warning': `text-warning-dark bg-white !border-warning-dark ${!isDisabled.value ? '[&&]:hover:!bg-gray-some' : ''}`,
    'danger': `!text-danger-dark bg-white !border-danger-dark ${!isDisabled.value ? '[&&]:hover:!bg-gray-some' : ''}`,
  }[color.value]
})

const sizes = computed(() => {
  return {
    sm: `text-sm leading-none ${hasText.value ? 'px-4 py-3' : 'p-2.5'}`,
    xs: `text-xs leading-[0.875rem] ${hasText.value ? 'px-4 py-2' : 'p-2'}`,
  }[size.value]
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
