<template>
  <NuxtImg
    :loading="lazy ? 'lazy' : 'eager'"
    :src="path"
    :alt="alternativeTextForDefinedImageOnly"
    :width="size"
    :height="size"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  alt?: string
  lazy?: boolean
  size?: number
  src?: string | null
  type: string
}>(), {
  lazy: true,
})
const alternativeTextForDefinedImageOnly = computed(() => props.src ? props.alt : '')
const path = computed(() => props.src ? props.src : `/placeholders/${props.type}.png`)
</script>
