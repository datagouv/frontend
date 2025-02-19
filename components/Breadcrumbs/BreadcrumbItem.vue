<template>
  <li>
    <a
      v-if="isCurrent"
      class="fr-breadcrumb__link"
      aria-current="page"
    >
      <slot />
    </a>
    <NuxtLinkLocale
      v-else
      class="fr-breadcrumb__link"
      :to="to"
    >
      <slot />
    </NuxtLinkLocale>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  to?: string
}>()

const route = useRoute()
const localePath = useLocalePath()

const isCurrent = computed(() => !props.to || localePath(props.to) === route.fullPath)
</script>
