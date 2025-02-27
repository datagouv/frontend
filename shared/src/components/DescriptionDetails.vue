<template>
  <dd
    class="fr-text--sm fr-ml-0 fr-mt-0 fr-mb-2w text-mention-grey h-4w fr-grid-row fr-grid-row--middle"
  >
    <div
      v-if="withEllipsis"
      class="text-overflow-ellipsis"
    >
      <slot />
    </div>
    <slot v-else />
  </dd>
</template>

<script setup lang="ts">
type Props = {
  withEllipsis?: boolean
}

withDefaults(defineProps<Props>(), {
  withEllipsis: true,
})
</script>
