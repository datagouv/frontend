<template>
  <div class="flex justify-start">
    <nav class="flex space-x-1 font-medium rounded border border-neutral-300">
      <NuxtLinkLocale
        v-for="link in links"
        :key="link.label"
        :to="link.href"
        class="group block rounded !bg-none !bg-transparent !border border-transparent  -m-px no-underline outline-none aria-current-page:border aria-current-page:!border-primary aria-current-page:text-primary p-1"
        :aria-current="isCurrent(link.href) ? 'page': false"
      >
        <span class="rounded  px-2 ">
          {{ link.label }}
        </span>
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

<style scoped>
.group:not([aria-current='page']):hover span {
  /* Could maybe be replaced by group-hover-not-aria-current-page:bg-white/50 ? */
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
