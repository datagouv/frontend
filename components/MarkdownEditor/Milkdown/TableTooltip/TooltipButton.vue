<template>
  <button
    class="fr-btn fr-btn--secondary fr-btn--sm bg-white"
    :class="iconClass"
    @click="emit('click')"
  >
    <div
      v-if="svg"
      v-html="svg"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon: string
  svg?: never
} | {
  icon?: never
  svg: string
}>()

const iconClass = props.icon ? props.icon : 'fr-icon-svg'

const emit = defineEmits<{ click: [] }>()
</script>
