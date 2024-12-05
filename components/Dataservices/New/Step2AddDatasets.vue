<template>
  <div class="fr-p-3w bg-white">
    <Well
      color="blue-cumulus"
      weight="regular"
      class="fr-mb-2w"
    >
      <div class="fr-grid-row">
        <div class="fr-col-auto fr-mr-3v">
          <span
            class="fr-icon-info-line"
            aria-hidden="true"
          />
        </div>
        <div class="fr-col">
          <p class="fr-m-0 fr-text--xs">
            {{ t('It is important to associate all the datasets used, as this allows to understand the cross-references and improve the visibility of your reuse.') }}
          </p>
        </div>
      </div>
    </Well>
    <DatasetsSelect v-model="datasets" />
    <div class="fr-grid-row justify-between">
      <BrandedButton
        color="secondary"
        @click="$emit('previous')"
      >
        {{ t("Previous") }}
      </BrandedButton>
      <BrandedButton
        :disabled="!datasets.length"
        :loading
        color="secondary"
        @click="$emit('next')"
      >
        {{ t("Next") }}
      </BrandedButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Well, type Dataset } from '@datagouv/components'
import type { DatasetSuggest } from '~/types/types'

defineProps<{
  loading: boolean
}>()

defineEmits<{
  previous: []
  next: []
}>()

const { t } = useI18n()

const datasets = defineModel<Array<Dataset | DatasetSuggest>>({ required: true })
</script>
