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
    <fieldset
      class="fr-fieldset"
      aria-labelledby="datasets-legend"
    >
      <legend
        id="datasets-legend"
        class="fr-fieldset__legend"
      >
        <h2 class="subtitle subtitle--uppercase fr-mb-3v">
          {{ t("Associated datasets") }}
        </h2>
      </legend>
      <div class="fr-fieldset__element">
        <SearchableSelect
          v-model="selectedDatasetsSuggest"
          :label="$t('Look for a dataset')"
          :placeholder="$t('Search a dataset…')"
          class="mb-6"
          :suggest="suggestDataset"
          :multiple="true"
        >
          <template #option="{ option: dataset }">
            <div class="flex items-center space-x-2">
              <img
                :src="dataset.image_url"
                alt=""
                class="size-5 rounded-full"
              >
              <span>{{ dataset.title }}</span>
            </div>
          </template>
        </SearchableSelect>
        <p class="fr-hr-or w-100 text-transform-lowercase fr-text--regular">
          <span class="fr-hr-or-text">{{ t('or') }}</span>
        </p>
        <form
          class="flex items-center space-x-4"
          @submit.prevent="loadDatasetByLink"
        >
          <InputGroup
            v-model="datasetUrl"
            :label="t('Link to the dataset')"
            :placeholder="'https://...'"
            :has-error="!!datasetUrlError"
            :error-text="datasetUrlError"
            class="w-100"
          />
          <button
            type="submit"
            class="fr-btn"
            :title="t('Add dataset')"
          >
            <RiAddLine />
          </button>
        </form>
      </div>
      <div
        ref="sortableRoot"
        class="w-100"
      >
        <div
          v-for="(dataset, index) in selectedDatasets"
          :key="dataset.id"
          class="flex items-center space-x-2"
        >
          <button
            type="button"
            class="fr-btn fr-btn--tertiary-no-outline shrink-0"
            :title="t('Drag to move this content')"
          >
            <RiDraggable class="size-8" />
          </button>
          <CardLg :dataset />
          <button
            type="button"
            class="fr-btn fr-btn--tertiary-no-outline shrink-0"
            :title="t('Remove the dataset')"
            @click="removeDataset(index)"
          >
            <RiDeleteBinLine class="size-8" />
          </button>
        </div>
      </div>
    </fieldset>
    <div class="fr-grid-row fr-grid-row--right">
      <button
        type="button"
        class="fr-btn"
        :disabled="!selectedDatasets.length || selectedDatasetsSuggest.length !== selectedDatasets.length"
        @click="submit"
      >
        {{ t("Next") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Well, type Dataset } from '@datagouv/components'
import { RiAddLine, RiDeleteBinLine, RiDraggable } from '@remixicon/vue'
import { useSortable } from '@vueuse/integrations/useSortable'
import CardLg from '~/components/dataset/card-lg.vue'
import SearchableSelect from '~/components/SearchableSelect.vue'
import type { DatasetSuggest } from '~/types/types'

const emit = defineEmits<{
  (e: 'next', datasets: Array<Dataset>): void
}>()

const sortableRootRef = useTemplateRef('sortableRoot')
const datasetsById = ref<Record<string, Dataset>>({})

const selectedDatasetsSuggest = defineModel<Array<Dataset | DatasetSuggest>>({ required: true })
const datasetUrl = ref('')
const datasetUrlError = ref<string | null>(null)
useSortable(sortableRootRef, selectedDatasetsSuggest)

const { t } = useI18n()
const { $api } = useNuxtApp()

const suggestDataset = async (query: string): Promise<Array<DatasetSuggest>> => {
  return await $api<Array<DatasetSuggest>>('/api/1/datasets/suggest/', {
    query: {
      q: query,
      size: 5,
    },
  })
}

watchEffect(async () => {
  for (const dataset of selectedDatasetsSuggest.value) {
    if (dataset.id in datasetsById.value) continue

    datasetsById.value[dataset.id] = await $api<Dataset>(`/api/1/datasets/${dataset.id}/`)
  }
})

const selectedDatasets = computed<Array<Dataset>>(() => {
  return selectedDatasetsSuggest.value.map((datasetSuggest) => {
    return datasetsById.value[datasetSuggest.id] || null
  }).filter(dataset => dataset)
})

const loadDatasetByLink = async () => {
  const matches = /\/datasets\/(.+?)\/?$/.exec(datasetUrl.value)
  if (!matches) {
    datasetUrlError.value = t('The provided URL doesn\'t look like a datasets URL.')
    return
  }
  const id = matches[1]
  try {
    const dataset = await $api<Dataset>(`/api/1/datasets/${id}/`)
    if (selectedDatasetsSuggest.value.find(suggest => suggest.id === dataset.id)) {
      datasetUrlError.value = t('The dataset is already present in the list.')
      return
    }

    datasetsById.value[dataset.id] = dataset
    selectedDatasetsSuggest.value.push(dataset)
    datasetUrlError.value = null
    datasetUrl.value = ''
  }
  catch {
    datasetUrlError.value = t('Cannot find a dataset identified by {id}.', { id })
  }
}

function removeDataset(index: number) {
  selectedDatasetsSuggest.value.splice(index, 1)
};

function submit() {
  emit('next', selectedDatasets.value)
};
</script>
