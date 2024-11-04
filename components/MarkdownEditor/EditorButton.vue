<template>
  <button
    class="text-neutral-700 h-8 p-2 rounded-full leading-none hover:!bg-neutral-200"
    role="menuitem"
  >
    <Icon :name="icon" />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  /**
   * The icon to show
   */
  icon: string
}>()
</script>
