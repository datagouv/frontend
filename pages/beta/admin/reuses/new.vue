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
          to="/reuses"
        >
          {{ t("Reuses") }}
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

    <DescribeReuse
      v-if="currentStep === 1"
      v-model="reuseForm"
      type="create"
      @submit="reuseNext"
    >
      <template #button>
        <button
          type="submit"
          class="fr-btn"
        >
          {{ $t("Next") }}
        </button>
      </template>
    </DescribeReuse>

    <Step2AddDatasets
      v-if="currentStep === 2"
      v-model="datasets"
      :loading
      @previous="moveToStep(1)"
      @next="datasetsNext"
    />
    <Step3CompletePublication
      v-if="currentStep === 3 && newReuse"
      :loading
      :reuse="newReuse"
      @next="updateReuse"
    />
    <div class="h-64" />
  </div>
</template>

<script setup lang="ts">
import type { Dataset, Reuse } from '@datagouv/components'
import DescribeReuse from '~/components/Reuses/DescribeReuse.vue'
import Step2AddDatasets from '~/components/Reuses/New/Step2AddDatasets.vue'
import Step3CompletePublication from '~/components/Reuses/New/Step3CompletePublication.vue'
import Stepper from '~/components/Stepper/Stepper.vue'
import type {
  DatasetSuggest,
  ReuseForm,
} from '~/types/types'
import { toApi } from '~/utils/reuses'

const { t } = useI18n()
const route = useRoute()
const { $api, $fileApi } = useNuxtApp()

const steps = computed(() => [
  t('Describe your reuse'),
  t('Link datasets'),
  t('Complete your publishing'),
])

const REUSE_FORM_STATE = 'reuse-form'
const REUSE_DATASET_STATE = 'reuse-datasets'

const reuseForm = useState(
  REUSE_FORM_STATE,
  () =>
    ({
      owned: null,
      title: '',
      url: '',
      type: null,
      topic: null,
      description: '',
      tags: [],
      image: null,
    } as ReuseForm),
)

const loading = useState<boolean>(
  'reuse-loading',
  () => false,
)

const datasets = useState<Array<Dataset | DatasetSuggest>>(
  REUSE_DATASET_STATE,
  () => [],
)

const newReuse = useState<Reuse | null>('new-reuse', () => null)

const currentStep = computed(() => parseInt(route.query.step as string) || 1)
const isCurrentStepValid = computed(() => {
  if (currentStep.value < 1) return false
  if (currentStep.value > steps.value.length) return false
  if (currentStep.value === 2 && (!reuseForm.value || !reuseForm.value.title)) return false
  if (currentStep.value > 2 && !newReuse.value) return false

  return true
})

function moveToStep(step: number) {
  return navigateTo({ path: route.path, query: { ...route.query, step } })
}

function reuseNext() {
  moveToStep(2)
}

function datasetsNext() {
  save()
}

async function save() {
  try {
    loading.value = true
    newReuse.value = await $api<Reuse>('/api/1/reuses/', {
      method: 'POST',
      body: JSON.stringify(toApi(reuseForm.value, { private: true, datasets: datasets.value })),
    })

    if (reuseForm.value.image && typeof reuseForm.value.image !== 'string') {
      const formData = new FormData()
      formData.set('file', reuseForm.value.image)
      await $fileApi(`/api/1/reuses/${newReuse.value.id}/image/`, {
        method: 'POST',
        body: formData,
      })
    }

    await moveToStep(3)
    clearNuxtState(REUSE_FORM_STATE)
    clearNuxtState(REUSE_DATASET_STATE)
  }
  finally {
    loading.value = false
  }
}

async function updateReuse(asPrivate: boolean) {
  if (!newReuse.value) {
    return moveToStep(3)
  }
  if (!asPrivate) {
    try {
      loading.value = true
      newReuse.value.private = false
      await $api<Reuse>(`/api/1/reuses/${newReuse.value.id}/`, {
        method: 'PUT',
        body: JSON.stringify(newReuse.value),
      })
    }
    finally {
      loading.value = false
    }
  }

  await navigateTo(newReuse.value.page, { external: true })
}

watchEffect(() => {
  if (!isCurrentStepValid.value) {
    moveToStep(1)
  }
})
</script>
