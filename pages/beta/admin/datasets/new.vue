<template>
  <div>
    <Breadcrumb>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/"
        >
          {{ t('Home') }}
        </NuxtLinkLocale>
      </li>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/datasets"
        >
          {{ t('Datasets') }}
        </NuxtLinkLocale>
      </li>
      <li>
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ t('Publishing form') }}
        </a>
      </li>
    </Breadcrumb>

    <Stepper
      :steps
      :current-step
    />

    <Step1PublishingType
      v-if="currentStep === 1"
      @start="moveToStep(2)"
    />
    <DescribeDataset
      v-if="currentStep === 2"
      v-model="datasetForm"
      :submit-label="t('Next')"
      type="create"
      @submit="datasetNext"
    />
    <Step3AddFiles
      v-if="currentStep === 3"
      v-model="datasetFiles"
      @next="filesNext"
    />
    <Step4CompletePublication
      v-if="currentStep === 4 && newDataset"
      :dataset="newDataset"
      @next="updateDataset"
    />
  </div>
</template>

<script setup lang="ts">
import type { Dataset, Frequency, Owned, Resource } from '@datagouv/components'
import type { FetchError } from 'ofetch'
import { v4 as uuidv4 } from 'uuid'
import Step1PublishingType from '~/components/Datasets/New/Step1PublishingType.vue'
import DescribeDataset from '~/components/Datasets/DescribeDataset.vue'
import Step3AddFiles from '~/components/Datasets/New/Step3AddFiles.vue'
import Step4CompletePublication from '~/components/Datasets/New/Step4CompletePublication.vue'
import Stepper from '~/components/Stepper/Stepper.vue'
import type { DatasetForm, EnrichedLicense, NewDatasetFile, SpatialGranularity, SpatialZone, Tag } from '~/types/types'
import { toApi } from '~/utils/datasets'

const { t } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()
const { $api, $fileApi } = useNuxtApp()

const DATASET_FORM_STATE = 'dataset-form'
const DATASET_FILES_STATE = 'dataset-files'

const steps = computed(() => ([
  t('Publish data on {site}', { site: config.public.title }),
  t('Describe your dataset'),
  t('Add files'),
  t('Complete your publishing'),
]))

const datasetForm = useState(DATASET_FORM_STATE, () => ({
  title: '',
  acronym: '',
  description: '',
  owned: null as Owned | null,
  tags: [] as Array<Tag>,
  license: null as EnrichedLicense | null,
  temporal_coverage: { start: null, end: null },
  frequency: null as Frequency | null,
  spatial_zones: [] as Array<SpatialZone>,
  spatial_granularity: null as SpatialGranularity | null,
} as DatasetForm))
const datasetFiles = useState<Array<NewDatasetFile>>(DATASET_FILES_STATE, () => [])
const newDataset = useState<Dataset | null>('new-dataset', () => null)
const currentStep = computed(() => parseInt(route.query.step as string) || 1)
const isCurrentStepValid = computed(() => {
  if (currentStep.value < 1) return false
  if (currentStep.value > steps.value.length) return false
  if (currentStep.value === 3 && !datasetForm.value.title) return false
  if (currentStep.value > 3 && !newDataset.value) return false
  return true
})

const moveToStep = (step: number) => {
  navigateTo({ path: route.path, query: { ...route.query, step } })
}

const datasetNext = () => {
  moveToStep(3)
}

const filesNext = (files: Array<NewDatasetFile>) => {
  datasetFiles.value = files
  save()
}

async function save() {
  try {
    newDataset.value = newDataset.value || await $api<Dataset>('/api/1/datasets/', {
      method: 'POST',
      body: JSON.stringify(toApi(datasetForm.value, { private: true })),
    })

    const results = await Promise.allSettled(datasetFiles.value.map((_, i: number) => {
      if (datasetFiles.value[i].state === 'loaded') return

      datasetFiles.value[i].state = 'loading'
      return uploadFile(newDataset.value as Dataset, datasetFiles.value[i], 3)
    }))

    if (results.every(f => f.status !== 'rejected')) {
      moveToStep(4)
      clearNuxtState(DATASET_FORM_STATE)
      clearNuxtState(DATASET_FILES_STATE)
    }
  }
  catch {
    //
  }
  finally {
    //
  }
}

const uploadFile = async (newDataset: Dataset, file: NewDatasetFile, retry: number) => {
  try {
    // If this is a remote file, it's easy just send all the information to the server.
    if (file.filetype === 'remote') {
      return await $api<Resource>(`/api/1/datasets/${newDataset.id}/resources/`, {
        method: 'POST',
        body: JSON.stringify(file),
      })
    }

    // If it's a local file, first we need to send the file data as multipart/form-data
    const formData = new FormData()
    formData.set('uuid', uuidv4())
    formData.set('filename', file.file.name)
    formData.set('file', file.file)
    const newResource = await $fileApi<Resource>(`/api/1/datasets/${newDataset.id}/upload/`, {
      method: 'POST',
      body: formData,
    })

    // Then we need to update the new resource with all the metadata
    const updatedNewResource = await $api<Resource>(`/api/1/datasets/${newDataset.id}/resources/${newResource.id}/`, {
      method: 'PUT',
      body: JSON.stringify(file),
    })

    file.state = 'loaded'
    return updatedNewResource
  }
  catch (e) {
    if (retry === 0) {
      const fetchError = e as unknown as FetchError
      if ('data' in fetchError && 'message' in fetchError.data) {
        file.errorMessage = fetchError.data.message
      }
      file.state = 'failed'
      throw new Error(t('Failed to upload file {title}', { title: file.title }))
    }
    await uploadFile(newDataset, file, retry - 1)
  }
}

async function updateDataset(asPrivate: boolean) {
  if (!newDataset.value) {
    return moveToStep(3)
  }
  if (!asPrivate) {
    newDataset.value.private = false
    await $api<Dataset>(`/api/1/datasets/${newDataset.value.id}`, {
      method: 'PUT',
      body: JSON.stringify(newDataset.value),
    })
  }

  await navigateTo(newDataset.value.page, { external: true })
}

watchEffect(() => {
  if (!isCurrentStepValid.value) {
    moveToStep(1)
  }
})
</script>
