<template>
  <div>
    <DescribeDataset
      v-if="datasetForm"
      v-model="datasetForm"
      type="update"
      :submit-label="t('Save')"
      @submit="save"
    />
  </div>
</template>

<script setup lang="ts">
import type { Dataset, Frequency, License } from '@datagouv/components'
import DescribeDataset from '~/components/Datasets/DescribeDataset.vue'
import type { DatasetForm, EnrichedLicense, SpatialGranularity } from '~/types/types'
import { toForm, toApi } from '~/utils/datasets'

const { t } = useI18n()
const { $api } = useNuxtApp()
const config = useRuntimeConfig()

const route = useRoute()
const loading = ref(false)

const { data: frequencies } = await useAPI<Array<Frequency>>('/api/1/datasets/frequencies', { lazy: true })

const { data: allLicenses } = await useAPI<Array<License>>('/api/1/datasets/licenses', { lazy: true })

// Merge some information between database (all licenses) and config (selectable license, some recommanded, codes…)
// Maybe all these information could be better stored in database too…
const licenses = computed(() => {
  if (!allLicenses.value) return []

  const licenses = [] as Array<EnrichedLicense>
  const licensesChoices = config.public.licenses as unknown as Record<string, Array<{ value: string, recommended?: boolean, code?: string, description?: string }>>
  for (const [group, licensesInGroup] of Object.entries(licensesChoices)) {
    for (const license of licensesInGroup) {
      const found = allLicenses.value.find(({ id }) => license.value === id)
      if (!found) continue
      licenses.push({ ...found, ...license, group })
    }
  }
  return licenses
})
const { data: granularities } = await useAPI<Array<SpatialGranularity>>('/api/1/spatial/granularities/', { lazy: true })

const url = computed(() => `/api/1/datasets/${route.params.id}`)
const { data: dataset } = await useAPI<Dataset>(url, { lazy: true })
const datasetForm = ref<DatasetForm | null>(null)
watchEffect(() => {
  datasetForm.value = toForm(dataset.value, licenses.value, frequencies.value, [], granularities.value)
})

const save = async () => {
  if (!datasetForm.value) throw new Error('No dataset form')

  try {
    loading.value = true

    await $api(`/api/1/datasets/${dataset.value.id}/`, {
      method: 'PUT',
      body: JSON.stringify(toApi(datasetForm.value)),
    })
  }
  finally {
    loading.value = false
  }
}
</script>
