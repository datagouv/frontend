<template>
  <li class="fr-sidemenu__item">
    <div
      class="fr-enlarge-link relative text-[var(--text-action-high-grey)] flex flex-row items-center w-full mb-2 py-1 px-1.5 has-[:aria-current]:rounded-sm has-[:aria-current]:bg-neutral-100 has-[:aria-current]:font-extrabold"
    >
      <Icon
        :name="icon"
        class="fr-mr-1w text-sm"
        aria-hidden="true"
      />
      <NuxtLinkLocale :to="to">
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
import TextClamp from 'vue3-text-clamp'
import type { RouteLocationRaw } from 'vue-router'

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
