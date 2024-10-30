<template>
  <span
    v-if="required"
    class="text-primary"
  >*</span>
</template>

<script setup lang="ts">
defineProps<{
  required: boolean
}>()
</script>
