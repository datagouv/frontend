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
          to="/dataservices"
        >
          {{ t('Dataservices') }}
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

    <Step1DescribeDataservice
      v-if="currentStep === 1"
      v-model="datasetForm"
      @next="dataserviceNext"
    />
    <Step2AddDatasets
      v-if="currentStep === 2"
      v-model="datasets"
      @next="datasetsNext"
    />
    <Step3CompletePublication
      v-if="currentStep === 3"
      @next="save"
    />
  </div>
</template>

<script setup lang="ts">
import type { Dataset } from '@datagouv/components'
import Step1DescribeDataservice from '~/components/Dataservices/New/Step1DescribeDataservice.vue'
import Step2AddDatasets from '~/components/Dataservices/New/Step2AddDatasets.vue'
import Step3CompletePublication from '~/components/Dataservices/New/Step3CompletePublication.vue'
import Stepper from '~/components/Stepper/Stepper.vue'
import type { DataserviceForm, DatasetSuggest } from '~/types/types'

const { t } = useI18n()
const route = useRoute()

const steps = computed(() => ([
  t('Describe your dataservice'),
  t('Link datasets'),
  t('Complete your publishing'),
]))

const datasetForm = useState('dataset-form', () => ({
  owned: null,
  title: '',
  acronym: '',
  description: '',
  authorization_request_url: '',
  availability: '',
  base_api_url: '',
  datasets: [],
  endpoint_description_url: '',
  has_token: false,
  is_restricted: false,
  license: null,
  private: true,
  rate_limiting: '',
  contact_point: null,
} as DataserviceForm))

const datasets = useState<Array<Dataset | DatasetSuggest>>('dataservice-datasets', () => [])

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

const dataserviceNext = () => {
  moveToStep(2)
}
const datasetsNext = (selectedDatasets: Array<Dataset>) => {
  datasets.value = selectedDatasets
  moveToStep(3)
}
const save = async (asPrivate: boolean) => {
  console.log('here')
}

watchEffect(() => {
  if (!isCurrentStepValid.value) {
    moveToStep(1)
  }
})
</script>
