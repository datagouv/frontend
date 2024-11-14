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

    <DescribeDataservice
      v-if="currentStep === 1"
      v-model="dataserviceForm"
      type="create"
      @submit="dataserviceNext"
    >
      <button
        type="submit"
        class="fr-btn"
      >
        {{ $t("Next") }}
      </button>
    </DescribeDataservice>
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
import DescribeDataservice from '~/components/Dataservices/DescribeDataservice.vue'
import Step2AddDatasets from '~/components/Dataservices/New/Step2AddDatasets.vue'
import Step3CompletePublication from '~/components/Dataservices/New/Step3CompletePublication.vue'
import Stepper from '~/components/Stepper/Stepper.vue'
import type {
  ContactPoint,
  DataserviceForm,
  DatasetSuggest,
} from '~/types/types'
import { toApi } from '~/utils/dataservices'

const { t } = useI18n()
const route = useRoute()
const { $api } = useNuxtApp()
const localePath = useLocalePath()

const steps = computed(() => [
  t('Describe your dataservice'),
  t('Link datasets'),
  t('Complete your publishing'),
])

const dataserviceForm = useState(
  'dataservice-form',
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
      business_documentation_url: '',
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

  // TODO check that dataservice exists

  return true
})

const moveToStep = (step: number) => {
  navigateTo({ path: route.path, query: { ...route.query, step } })
}

const dataserviceNext = () => {
  moveToStep(2)
}
const datasetsNext = () => {
  moveToStep(3)
}

const save = async (asPrivate: boolean) => {
  if (
    dataserviceForm.value.contact_point
    && dataserviceForm.value.owned?.organization
    && !('id' in dataserviceForm.value.contact_point)
  ) {
    dataserviceForm.value.contact_point = await $api<ContactPoint>('/api/1/contacts/', {
      method: 'POST',
      body: JSON.stringify({
        name: dataserviceForm.value.contact_point.name,
        email: dataserviceForm.value.contact_point.email,
        contact_form: dataserviceForm.value.contact_point.contact_form,
        organization: dataserviceForm.value.owned.organization.id,
      }),
    })
  }

  const dataservice = await $api<Dataservice>('/api/1/dataservices/', {
    method: 'POST',
    body: JSON.stringify(toApi(dataserviceForm.value, {
      datasets: datasets.value,
      private: asPrivate,
    })),
  })

  navigateTo(localePath(`/dataservices/${dataservice.id}`))
}

watchEffect(() => {
  if (!isCurrentStepValid.value) {
    moveToStep(1)
  }
})
</script>
