<template>
  <span
    v-if="required"
    class="required-field-star"
  >*</span>
</template>

<script setup lang="ts">
defineProps<{
  required: boolean
}>()
</script>
