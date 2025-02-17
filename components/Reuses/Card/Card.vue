<template>
  <ReuseCard
    :reuse
    :style
    :show-description
    :reuse-url="reuse.page"
    :organization-url="localePath(`/organizations/${reuse.organization?.slug}`)"
  />
</template>

<script setup lang="ts">
import { ReuseCard, type Reuse } from '@datagouv/components'
import type { StyleValue } from 'vue'

withDefaults(defineProps<{
  reuse: Reuse
  style?: StyleValue
  showDescription?: boolean
}>(), {
  showDescription: true,
})

const localePath = useLocalePath()
</script>
