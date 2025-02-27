<template>
  <ReuseCard
    :certifier="config.public.title"
    :reuse
    :style
    :show-description
    :reuse-url="reuse.page"
    :organization-url="localePath(`/organizations/${reuse.organization?.slug}`)"
  />
</template>

<script setup lang="ts">
import type { Reuse } from '@datagouv/components'
import type { StyleValue } from 'vue'
import ReuseCard from '~/components/Reuses/Card/ReuseCard.vue'

withDefaults(defineProps<{
  reuse: Reuse
  style?: StyleValue
  showDescription?: boolean
}>(), {
  showDescription: true,
})

const localePath = useLocalePath()
const config = useRuntimeConfig()
</script>
