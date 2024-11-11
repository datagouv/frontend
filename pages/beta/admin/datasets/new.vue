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
    <Step2DescribeDataset
      v-if="currentStep === 2"
      v-model="datasetForm"
      @next="datasetNext"
    />
    <Step3AddFiles
      v-if="currentStep === 3"
      v-model="datasetFiles"
      @next="filesNext"
    />
    <Step4CompletePublication
      v-if="currentStep === 4"
      @next="save"
    />
  </div>
</template>

<script setup lang="ts">
import type { Dataset, Frequency, Owned, Resource } from '@datagouv/components'
import type { FetchError } from 'ofetch'
import { v4 as uuidv4 } from 'uuid'
import Step1PublishingType from '~/components/Datasets/New/Step1PublishingType.vue'
import Step2DescribeDataset from '~/components/Datasets/New/Step2DescribeDataset.vue'
import Step3AddFiles from '~/components/Datasets/New/Step3AddFiles.vue'
import Step4CompletePublication from '~/components/Datasets/New/Step4CompletePublication.vue'
import Stepper from '~/components/Stepper/Stepper.vue'
import type { DatasetForm, EnrichedLicense, NewDatasetFile, NewDatasetForApi, SpatialGranularity, SpatialZone, Tag } from '~/types/types'

const { t } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()
const { $api, $fileApi } = useNuxtApp()
const localePath = useLocalePath()

const steps = computed(() => ([
  t('Publish data on {site}', { site: config.public.title }),
  t('Describe your dataset'),
  t('Add files'),
  t('Complete your publishing'),
]))

const datasetForm = useState('dataset-form', () => ({
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
const datasetFiles = useState<Array<NewDatasetFile>>('dataset-files', () => [])
const newDataset = useState<Dataset | null>('new-dataset', () => null)
const currentStep = computed(() => parseInt(route.query.step as string) || 1)
const isCurrentStepValid = computed(() => {
  if (currentStep.value < 1) return false
  if (currentStep.value > steps.value.length) return false

  // TODO check that dataset exists

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
  moveToStep(4)
}

const prepareDatasetForApi = (form: DatasetForm, asPrivate: boolean): NewDatasetForApi => {
  // This `NewDataset` type seems really off…
  // - Why license or frequency are non-nullable strings?
  // - The API accepts the temporal coverage as an object…
  // - archived as a boolean? The API is failing on a boolean here, expecting a date or null
  return {
    organization: form.owned?.organization?.id,
    owner: form.owned?.owner?.id,
    title: form.title,
    private: asPrivate,
    description: form.description,
    acronym: form.acronym,
    tags: form.tags.map(t => t.text),
    license: form.license?.id || '',
    frequency: form.frequency?.id || '',
    temporal_coverage: (form.temporal_coverage.start && form.temporal_coverage.end) ? form.temporal_coverage as { start: string, end: string } : undefined,
    spatial: (form.spatial_granularity || form.spatial_zones)
      ? {
          zones: form.spatial_zones.length ? form.spatial_zones.map(z => z.id) : undefined,
          granularity: form.spatial_granularity ? form.spatial_granularity.id : undefined,
        }
      : undefined,

  }
}

const save = async (asPrivate: boolean) => {
  try {
    newDataset.value = newDataset.value || await $api<Dataset>('/api/1/datasets/', {
      method: 'POST',
      body: JSON.stringify(prepareDatasetForApi(datasetForm.value, asPrivate)),
    })

    const results = await Promise.allSettled(datasetFiles.value.map((_, i: number) => {
      if (datasetFiles.value[i].state === 'loaded') return

      datasetFiles.value[i].state = 'loading'
      return uploadFile(newDataset.value as Dataset, datasetFiles.value[i], 3)
    }))

    if (results.some(f => f.status === 'rejected')) {
      moveToStep(3)
    }
    else {
      navigateTo(newDataset.value.organization ? localePath(`/beta/admin/organizations/${newDataset.value.organization.id}/datasets`) : localePath('/beta/admin/me/datasets'))
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

watchEffect(() => {
  if (!isCurrentStepValid.value) {
    moveToStep(1)
  }
})
</script>
