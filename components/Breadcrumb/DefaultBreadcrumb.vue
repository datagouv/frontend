<template>
  <Breadcrumb>
    <li
      v-for="(item, i) in items"
      :key="i"
    >
      <NuxtLinkLocale
        v-if="item.to"
        class="fr-breadcrumb__link"
        :to="item.to"
      >
        {{ item.label }}
      </NuxtLinkLocale>
      <a
        v-else
        class="fr-breadcrumb__link"
        aria-current="page"
      >
        {{ item.label }}
      </a>
    </li>
  </Breadcrumb>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: Array<{ label: string, to?: string } | null>
}>()

const items = computed<Array<{ label: string, to?: string }>>(() => {
  return props.items.filter(item => item) as Array<{ label: string, to?: string }>
})
</script>
