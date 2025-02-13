<template>
  <p :class="`${colorClass} ${sizeClass} !mb-0`">
    <OwnerTypeIcon :type="type" /> {{ name }}
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { findOrganizationType, OwnerTypeIcon, type OrganizationTypes } from '@datagouv/components'

const props = withDefaults(defineProps<{
  type: OrganizationTypes | 'user'
  size?: 'base' | 'sm' | 'xs'
  color?: 'black' | 'gray'
}>(), {
  size: 'sm',
  color: 'gray',
})

const colorClass = computed(() => {
  switch (props.color) {
    case 'black':
      return 'text-gray-title'
    case 'gray':
      return 'text-gray-medium'
  }
  return 'text-gray-default'
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return '!text-sm'
    case 'xs':
      return '!text-xs'
  }
  return '!text-base'
})

const name = computed(() => findOrganizationType(props.type).label)
</script>
