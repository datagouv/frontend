<template>
  <p
    v-bind="$attrs"
    :aria-describedby="id"
  >
    <slot />
  </p>
  <span
    :id="id"
    class="fr-tooltip fr-placement"
    role="tooltip"
    aria-hidden="true"
  >
    <slot name="tooltip" />
  </span>
</template>

<script setup lang="ts">
const id = useId()
</script>
