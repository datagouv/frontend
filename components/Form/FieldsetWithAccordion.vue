<template>
  <div>
    <slot />
    <Teleport
      v-if="accordionGroup"
      :to="accordionGroup"
    >
      <Accordion
        :id="accordionId"
        :title="helpTitle"
      >
        <slot name="helpText" />
      </Accordion>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import Accordion from '../Accordion/Accordion.vue'

defineProps<{
  accordionGroup: HTMLElement | null
  helpTitle: string
}>()

const accordionId = useId()
</script>
