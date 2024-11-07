<template>
  <img
    loading="lazy"
    :src="path"
    :alt="alternativeTextForDefinedImageOnly"
    :width="size"
    :height="size"
    v-bind="$attrs"
  >
</template>

<script setup lang="ts">
const props = defineProps<{
  type: string
  src?: string | null
  alt?: string
  size?: number
}>()
const alternativeTextForDefinedImageOnly = computed(() => props.src ? props.alt : '')
const path = computed(() => props.src ? props.src : `/placeholders/${props.type}.png`)
</script>
