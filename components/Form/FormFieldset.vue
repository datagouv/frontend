<template>
  <fieldset
    class="fr-fieldset"
    :aria-labelledby="legendId"
  >
    <legend
      :id="legendId"
      class="fr-fieldset__legend"
    >
      <h2 class="text-sm font-bold uppercase mb-3">
        {{ legend }}
      </h2>
    </legend>

    <slot />
  </fieldset>
</template>

<script setup lang="ts">
const legendId = useId()

defineProps<{
  legend: string
}>()
</script>
