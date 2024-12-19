<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    :class="markdownClasses"
    v-html="formatMarkdown(content, minHeading)"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  content: string
  minHeading?: 1 | 2 | 3 | 4 | 5 | 6
}>(), {
  minHeading: 3,
})
</script>
