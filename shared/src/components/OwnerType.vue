<template>
  <p :class="`${colorClass} fr-text--${size} fr-my-0`">
    <OwnerTypeIcon :type="type" /> {{ name }}
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { findOrganizationType, type OrganizationTypes, type UserType } from '../main'
import OwnerTypeIcon from './OwnerTypeIcon.vue'

const props = withDefaults(defineProps<{
  type: OrganizationTypes | UserType
  size?: 'sm' | 'xs'
  color?: 'black' | 'grey'
}>(), {
  size: 'sm',
  color: 'grey',
})

const colorClass = computed(() => {
  return {
    black: 'text-grey-500',
    grey: 'text-mention-grey',
  }[props.color]
})

const name = computed(() => findOrganizationType(props.type).label)
</script>
