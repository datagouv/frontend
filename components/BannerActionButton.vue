<template>
  <button
    class="
        flex items-center space-x-1 rounded-full border bg-white text-sm/4 px-3 py-2
        group-data-[banner-action-type=primary]:text-datagouv-dark
        group-data-[banner-action-type=primary]:border-datagouv-dark
        group-data-[banner-action-type=danger]:text-danger-dark
        group-data-[banner-action-type=danger]:border-danger-dark
        group-data-[banner-action-type=warning]:text-warning-dark
        group-data-[banner-action-type=warning]:border-warning-dark
    "
  >
    <component
      :is="icon"
      class="size-3"
    />
    <span>
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
}>()
</script>
