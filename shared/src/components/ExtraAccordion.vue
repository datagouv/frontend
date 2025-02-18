<template>
  <div>
    <header
      class="fr-grid-row fr-grid-row--middle fr-pb-3w fr-mb-3w border-bottom border-default-grey"
    >
      <div class="fr-col">
        <component
          :is="titleLevel"
          class="subtitle subtitle--uppercase fr-m-0"
        >
          {{ titleText }}
        </component>
      </div>
      <div class="fr-col-auto">
        <button
          role="button"
          :aria-expanded="expanded"
          :aria-controls="accordionId"
          class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-btn--secondary-grey-500"
          :class="{ 'fr-icon-arrow-up-s-line': expanded, 'fr-icon-arrow-down-s-line': !expanded }"
          data-testid="button"
          @click="expand"
        >
          <template v-if="expanded">
            {{ $t('Close details') }}
          </template>
          <template v-else>
            {{ buttonText }}
          </template>
        </button>
      </div>
    </header>
    <div
      :id="accordionId"
      class="accordion-content"
    >
      <div class="fr-pb-3w fr-mb-3w border-bottom border-default-grey">
        <div
          class="fr-grid-row fr-grid-row--gutters fr-text--sm fr-m-0"
          data-testid="extra-list"
        >
          <div
            v-for="(value, key) in extra"
            :key="key"
            class="fr-col-12 fr-col-sm-6 fr-col-md-4"
          >
            <h3 class="subtitle fr-mb-1v">
              {{ key }}
            </h3>
            <p class="fr-text--sm fr-m-0 text-mention-grey overflow-wrap-anywhere">
              {{ value }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import useAccordion from '../../composables/useAccordion'

const accordionId = useId()

const { expanded, expand } = useAccordion(accordionId)

defineProps<{
  buttonText: string
  titleText: string
  extra: Record<string, any>
  titleLevel: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
}>()
</script>
