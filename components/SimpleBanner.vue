<template>
  <div
    class="w-full rounded p-3"
    :class="classes"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'primary'
}>()

const classes = computed(() => {
  return {
    primary: 'bg-datagouv-lightest text-datagouv-dark',
  }[props.type]
})
</script>
