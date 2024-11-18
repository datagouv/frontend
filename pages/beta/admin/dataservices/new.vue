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
      v-if="currentStep === 3 && newDataservice"
      :dataservice="newDataservice"
      @next="updateDataservice"
    />
    <div class="h-64" />
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
import { toApi, toForm } from '~/utils/dataservices'

const { t } = useI18n()
const route = useRoute()
const { $api } = useNuxtApp()

const steps = computed(() => [
  t('Describe your dataservice'),
  t('Link datasets'),
  t('Complete your publishing'),
])

const DATASERVICE_FORM_STATE = 'dataservice-form'
const DATASERVICE_DATASETS_STATE = 'dataservice-datasets'

const dataserviceForm = useState(
  DATASERVICE_FORM_STATE,
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
  DATASERVICE_DATASETS_STATE,
  () => [],
)

const newDataservice = useState<Dataservice | null>('new-dataservice', () => null)

const currentStep = computed(() => parseInt(route.query.step as string) || 1)
const isCurrentStepValid = computed(() => {
  if (currentStep.value < 1) return false
  if (currentStep.value > steps.value.length) return false
  if (currentStep.value === 2 && (!dataserviceForm.value || !dataserviceForm.value.title)) return false
  if (currentStep.value > 2 && !newDataservice.value) return false

  return true
})

function moveToStep(step: number) {
  return navigateTo({ path: route.path, query: { ...route.query, step } })
}

const dataserviceNext = () => {
  moveToStep(2)
}
async function datasetsNext() {
  await save()
}

async function save() {
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

  newDataservice.value = await $api<Dataservice>('/api/1/dataservices/', {
    method: 'POST',
    body: JSON.stringify(toApi(dataserviceForm.value, {
      datasets: datasets.value,
      private: true,
    })),
  })

  await moveToStep(3)

  clearNuxtState(DATASERVICE_FORM_STATE)
  clearNuxtState(DATASERVICE_DATASETS_STATE)
}

async function updateDataservice(asPrivate: boolean) {
  if (!newDataservice.value) {
    return moveToStep(3)
  }
  if (!asPrivate) {
    await $api<Dataservice>(`/api/1/dataservices/${newDataservice.value.id}/`, {
      method: 'PATCH',
      body: JSON.stringify(toApi(toForm(newDataservice.value), {
        private: false,
      })),
    })
  }

  await navigateTo(newDataservice.value.self_web_url, { external: true })
}

watchEffect(() => {
  if (!isCurrentStepValid.value) {
    moveToStep(1)
  }
})
</script>
