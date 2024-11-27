<template>
  <div class="relative">
    <div class="absolute left-0 top-0 bottom-0 flex items-center justify-center pl-4">
      <component
        :is="icon"
        class="size-4"
      />
    </div>
    <input
      v-bind="$attrs"
      v-model="model"
      type="text"
      class="border !border-gray-700 rounded-full pl-10 pr-4 py-1 placeholder-gray-800 text-sm"
    >
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineOptions({
  inheritAttrs: false,
})
defineProps<{
  icon: Component
}>()
const model = defineModel<string>()
</script>
