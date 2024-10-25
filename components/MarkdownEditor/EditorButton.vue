<template>
  <button
    class="fr-btn fr-btn--secondary-grey-400 fr-btn--sm fr-btn--tertiary-no-outline"
    :class="icon"
    role="menuitem"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  /**
   * The DSFR icon to show
   */
  icon: string
}>()
</script>
