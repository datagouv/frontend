<template>
  <component
    :is="(resource.filetype === 'remote' ? getResourceFormatIcon(resource.format) : null) || File"
    class="text-gray-800 shrink-0"
  />
</template>

<script setup lang="ts">
import type { Resource } from '../../types/resources'
import File from '../Icons/File.vue'
import { getResourceFormatIcon } from '../../functions/resources'

defineProps<{
  resource: Pick<Resource, 'filetype' | 'format'>
}>()
</script>
