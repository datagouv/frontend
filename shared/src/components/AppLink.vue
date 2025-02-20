<template>
  <component
    :is="config?.appLink"
    v-if="config && config.appLink"
    :to
  >
    <slot />
  </component>
  <a
    v-else-if="isExternal"
    :href="to"
  >
    <slot />
  </a>
  <RouterLink
    v-else
    :to
  ><slot /></RouterLink>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { configKey } from '../main'

const config = inject(configKey)
const { locale } = useI18n()

const props = defineProps<{
  to: string
}>()

const isExternal = computed(() => props.to.startsWith('http'))
const to = computed(() => {
  // If the `appLink` component is override, the override is responsible of the locale management
  if (config && config.appLink) return props.to

  // If it's an external link, no locale management needed.
  if (isExternal.value) return props.to

  // TODO harden this for path not starting with "/"
  return `/${locale.value}${props.to}`
})
</script>
