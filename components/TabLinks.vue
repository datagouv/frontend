<template>
  <div class="flex justify-start">
    <nav class="flex space-x-1 font-medium rounded border border-neutral-300">
      <NuxtLinkLocale
        v-for="link in links"
        :key="link.label"
        :to="link.href"
        class="block rounded !bg-none !bg-transparent !border border-transparent hover:!bg-white/50 hover:border-neutral-300/50 -m-px px-3 py-1 no-underline outline-none aria-current-page:border aria-current-page:!border-primary aria-current-page:text-primary"
        :aria-current="isCurrent(link.href) ? 'page': false"
      >
        {{ link.label }}
      </NuxtLinkLocale>
    </nav>
  </div>
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
