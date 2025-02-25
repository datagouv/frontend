<template>
  <li>
    <p
      v-if="passed"
      class="fr-my-0"
    >
      <span
        class="fr-icon-check-line"
        aria-hidden="true"
      />
      {{ messagePassed }}
    </p>
    <p
      v-else
      class="fr-my-0 text-mention-grey"
    >
      <span
        class="fr-icon-warning-line"
        aria-hidden="true"
      />
      {{ messageFailed }}
    </p>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  passed: boolean
  messagePassed: string
  messageFailed: string
}>()
</script>
