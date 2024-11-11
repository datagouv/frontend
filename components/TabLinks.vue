<template>
  <nav class="flex px-8 border-b space-x-2 font-bold">
    <NuxtLinkLocale
      v-for="link in links"
      :key="link.label"
      :to="link.href"
      class="bloc bg-blue-light hover:!bg-blue-tint px-4 py-2 no-underline border-x border-t !border-transparent -mb-px outline-none !bg-none aria-current-page:bg-white aria-current-page:!border-gray-200 aria-current-page:hover:!bg-white"
      :aria-current="isCurrent(link.href) ? 'page': false"
    >
      {{ link.label }}
    </NuxtLinkLocale>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  links: Array<{ href: string, label: string }>
}>()

const route = useRoute()
const localePath = useLocalePath()

const isCurrent = (href: string) => {
  return localePath(href) === route.fullPath
}
</script>
