<template>
  <li class="fr-sidemenu__item">
    <div
      class="fr-enlarge-link relative text-[var(--text-action-high-grey)] flex flex-row items-center w-full mb-2 py-1 px-1.5 has-[[aria-current=page]]:rounded-sm has-[[aria-current=page]]:bg-neutral-100 has-[[aria-current=page]]:font-extrabold"
    >
      <Icon
        :name="icon"
        class="fr-mr-1w text-sm"
        aria-hidden="true"
      />
      <NuxtLinkLocale
        :to="to"
        :aria-current="(route.name === localeRoute(to)?.name && route.params.oid === localeRoute(to)?.params.oid) ? 'page' : false"
      >
        <TextClamp
          :text="label"
          :auto-resize="true"
          :max-lines="1"
        />
      </NuxtLinkLocale>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const route = useRoute()
const localeRoute = useLocaleRoute()

defineProps<{
  label: string
  icon: string
  to: RouteLocationRaw
}>()
</script>

<style scoped>
.fr-sidemenu__link[aria-current]:not([aria-current=false])::before {
  width: 0;
}

.fr-sidemenu__link:has(> [aria-current]):hover {
  background-color: var(--background-alt-grey-hover);
}

.fr-sidemenu__link:has(> [aria-current]):active {
  background-color: var(--background-alt-grey-active);
}
</style>
