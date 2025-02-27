<template>
  <div class="fr-p-3w bg-white">
    <SimpleBanner
      type="primary"
      class="mb-4 flex items-center space-x-2"
    >
      <RiInformationLine class="shink-0 size-6" />
      <p class="w-full mb-0">
        {{ t('It is important to associate all the datasets used, as this allows to understand the cross-references and improve the visibility of your reuse.') }}
      </p>
    </SimpleBanner>
    <DatasetsSelect v-model="datasets" />
    <div class="fr-grid-row justify-between">
      <BrandedButton
        color="secondary"
        @click="$emit('previous')"
      >
        {{ t("Previous") }}
      </BrandedButton>
      <BrandedButton
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
import { SimpleBanner, type Dataset, type DatasetV2 } from '@datagouv/components-next'
import { RiInformationLine } from '@remixicon/vue'
import type { DatasetSuggest } from '~/types/types'

defineProps<{
  loading: boolean
}>()

defineEmits<{
  previous: []
  next: []
}>()

const { t } = useI18n()

const datasets = defineModel<Array<Dataset | DatasetV2 | DatasetSuggest>>({ required: true })
</script>
