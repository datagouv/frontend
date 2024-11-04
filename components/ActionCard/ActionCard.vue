<template>
  <div
    class="rounded fr-p-3w fr-grid-row flex-direction-column"
    :class="{ 'h-100': stretchHeight, 'bg-contrast-blue-cumulus': isPrimary, 'border border-default-grey bg-white': !isPrimary }"
  >
    <div
      class="fr-col fr-grid-row fr-grid-row--gutters"
      :class="{ 'text-blue-400': isPrimary }"
    >
      <div class="fr-col-auto">
        <img
          class="w-100"
          :src="icon"
          alt=""
        >
      </div>
      <div class="fr-col-12 fr-col-sm fr-grid-row flex-direction-column justify-between">
        <div class="fr-mb-1w">
          <component
            :is="heading"
            class="fr-m-0 fr-mb-1w"
            :class="{ 'fr-text--bold fr-text--md': isPrimary, 'fr--h5': !isPrimary }"
          >
            {{ title }}
          </component>
          <p
            v-if="content"
            class="fr-my-1w"
          >
            {{ content }}
          </p>
          <slot v-else />
        </div>
        <div
          class="fr-grid-row"
          :class="alignment"
        >
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AxisAlignment } from '~/types/types'

const props = withDefaults(defineProps<{
  title: string
  icon: string
  actionsAlignment: AxisAlignment

  type?: 'primary' | 'default'
  heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  stretchHeight?: boolean
  content?: string
}>(), {
  heading: 'h2',
  stretchHeight: false,
  type: 'default',
})

function getMainAxisAlignment(alignment: AxisAlignment) {
  switch (alignment) {
    case 'start':
      return 'left'
    case 'center':
      return 'center'
    case 'end':
      return 'right'
  }
}

const alignment = computed(() => `fr-grid-row--${getMainAxisAlignment(props.actionsAlignment)}`)
const isPrimary = computed(() => props.type === 'primary')
</script>
