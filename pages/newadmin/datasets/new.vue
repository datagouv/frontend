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

    {{ JSON.stringify(datasetForm) }}

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
      @next="filesNext"
    />
  </div>
</template>

<script setup lang="ts">
import Step1PublishingType from '~/components/Datasets/New/Step1PublishingType.vue'
import Step2DescribeDataset from '~/components/Datasets/New/Step2DescribeDataset.vue'
import Step3AddFiles from '~/components/Datasets/New/Step3AddFiles.vue'
import Stepper from '~/components/Stepper/Stepper.vue'
import type { DatasetForm, NewDatasetFile } from '~/types/types'

const { t } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()

const steps = computed(() => ([
  t('Publish data on {site}', { site: config.public.title }),
  t('Describe your dataset'),
  t('Add files'),
  t('Complete your publishing'),
]))

const datasetForm = useState('dataset-form', () => null as DatasetForm | null)
const datasetFiles = useState('dataset-files', () => [] as Array<NewDatasetFile>)
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

const datasetNext = (dataset: DatasetForm) => {
  // datasetForm.value = dataset
  moveToStep(3)
}

const filesNext = (files: Array<NewDatasetFile>) => {
  datasetFiles.value = files
  moveToStep(4)
}

watchEffect(() => {
  if (!isCurrentStepValid.value) {
    moveToStep(1)
  }
})
</script>
