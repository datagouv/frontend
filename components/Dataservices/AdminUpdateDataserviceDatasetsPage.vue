<template>
  <div
    v-if="datasets"
    class="fr-p-3w bg-white"
  >
    <DatasetsSelect v-model="datasets" />
    <div class="fr-grid-row fr-grid-row--right">
      <button
        type="button"
        class="fr-btn"
        :disabled="!datasets.length"
        @click="submit"
      >
        {{ t("Save") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Dataservice, Dataset } from '@datagouv/components'
import type { DatasetSuggest, PaginatedArray } from '~/types/types'

const { t } = useI18n()
const { $api } = useNuxtApp()
const { toast } = useToast()

const route = useRoute()
const url = computed(() => `/api/1/dataservices/${route.params.id}`)
const { data: dataservice } = await useAPI<Dataservice>(url, { lazy: true })
const datasets = ref<Array<Dataset | DatasetSuggest>>([])
const datasetsPage = ref<PaginatedArray<Dataset> | null>(null)
watchEffect(async () => {
  if (!dataservice.value) return
  datasetsPage.value = await $api<PaginatedArray<Dataset>>(`/api/1/datasets/?dataservice=${dataservice.value.id}`)
  // TODO use page data to see if there is others datasets linked and add a warning message?
  datasets.value = datasetsPage.value.data
})

const submit = async () => {
  await $api(`/api/1/dataservices/${dataservice.value.id}/`, {
    method: 'PATCH',
    body: JSON.stringify({
      datasets: datasets.value.map(({ id }) => id),
    }),
  })

  toast.success(t('Dataservice updated!'))
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}
</script>
