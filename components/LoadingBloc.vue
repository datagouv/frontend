<template>
  <div class="relative">
    <div :class="{ 'opacity-50': loading }">
      <slot />
    </div>
    <div
      v-if="loading"
      class="absolute inset-0 flex justify-center items-center "
    >
      <AdminLoader class="size-32" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string
}>()

const loading = computed(() => {
  return props.status === 'idle' || props.status === 'pending'
})
</script>
