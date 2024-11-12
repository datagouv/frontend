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
import type { Dataset, Reuse } from '@datagouv/components'
import type { DatasetSuggest } from '~/types/types'

const { t } = useI18n()
const { $api } = useNuxtApp()

const route = useRoute()
const url = computed(() => `/api/1/reuses/${route.params.id}`)
const { data: reuse } = await useAPI<Reuse>(url, { lazy: true })
const datasets = ref<Array<Dataset | DatasetSuggest>>([])
watchEffect(async () => {
  if (!reuse.value) return
  datasets.value = reuse.value.datasets
})

const submit = async () => {
  await $api(`/api/1/reuses/${reuse.value.id}/`, {
    method: 'PUT',
    body: JSON.stringify({
      datasets: datasets.value.map(({ id }) => id),
    }),
  })
}
</script>
