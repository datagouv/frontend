<template>
  <div>
    <Breadcrumb>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/"
        >
          {{ t("Home") }}
        </NuxtLinkLocale>
      </li>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/dataservices"
        >
          {{ t("Dataservices") }}
        </NuxtLinkLocale>
      </li>
      <li>
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ t("Publishing form") }}
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
import type { Dataservice, Dataset } from '@datagouv/components'
import Step1DescribeDataservice from '~/components/Dataservices/New/Step1DescribeDataservice.vue'
import Step2AddDatasets from '~/components/Dataservices/New/Step2AddDatasets.vue'
import Step3CompletePublication from '~/components/Dataservices/New/Step3CompletePublication.vue'
import Stepper from '~/components/Stepper/Stepper.vue'
import type {
  ContactPoint,
  DataserviceForm,
  DatasetSuggest,
  NewDataserviceForApi,
} from '~/types/types'

const { t } = useI18n()
const route = useRoute()
const { $api } = useNuxtApp()
const localePath = useLocalePath()

const steps = computed(() => [
  t('Describe your dataservice'),
  t('Link datasets'),
  t('Complete your publishing'),
])

const datasetForm = useState(
  'dataset-form',
  () =>
    ({
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
    } as DataserviceForm),
)

const datasets = useState<Array<Dataset | DatasetSuggest>>(
  'dataservice-datasets',
  () => [],
)

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

const prepareDataserviceForApi = (
  form: DataserviceForm,
  contactPoint: ContactPoint | null,
  asPrivate: boolean,
): NewDataserviceForApi => {
  return {
    organization: form.owned?.organization?.id,
    owner: form.owned?.owner?.id,
    title: form.title,
    private: asPrivate,
    description: form.description,
    acronym: form.acronym,
    datasets: datasets.value.map(({ id }) => id),
    contact_point: contactPoint ? contactPoint.id : null,
    is_restricted: form.is_restricted,
    has_token: form.has_token,
    base_api_url: form.base_api_url || null,
    authorization_request_url: form.authorization_request_url || null,
    endpoint_description_url: form.endpoint_description_url || null,
    rate_limiting: form.rate_limiting,
    availability: form.availability ? parseFloat(form.availability) : null,
  }
}

const save = async (asPrivate: boolean) => {
  let contactPoint = null
  if (
    datasetForm.value.contact_point
    && datasetForm.value.owned?.organization
  ) {
    if (!('id' in datasetForm.value.contact_point)) {
      contactPoint = await $api<ContactPoint>('/api/1/datasets/', {
        method: 'POST',
        body: JSON.stringify({
          name: datasetForm.value.contact_point.name,
          email: datasetForm.value.contact_point.email,
          contact_form: datasetForm.value.contact_point.contact_form,
          organization: datasetForm.value.owned.organization.id,
        }),
      })
    }
    else {
      contactPoint = datasetForm.value.contact_point
    }
  }

  const dataservice = await $api<Dataservice>('/api/1/dataservices/', {
    method: 'POST',
    body: JSON.stringify(prepareDataserviceForApi(datasetForm.value, contactPoint, asPrivate)),
  })

  navigateTo(localePath(`/dataservices/${dataservice.id}`))
}

watchEffect(() => {
  if (!isCurrentStepValid.value) {
    moveToStep(1)
  }
})
</script>
