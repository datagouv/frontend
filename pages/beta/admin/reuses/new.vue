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
      <button
        type="submit"
        class="fr-btn"
      >
        {{ $t("Next") }}
      </button>
    </DescribeReuse>

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

const reuseForm = useState(
  'reuse-form',
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

const datasets = useState<Array<Dataset | DatasetSuggest>>(
  'reuse-datasets',
  () => [],
)

const currentStep = computed(() => parseInt(route.query.step as string) || 1)
const isCurrentStepValid = computed(() => {
  if (currentStep.value < 1) return false
  if (currentStep.value > steps.value.length) return false

  // TODO check that reuse exists

  return true
})

const moveToStep = (step: number) => {
  navigateTo({ path: route.path, query: { ...route.query, step } })
}

const reuseNext = () => {
  moveToStep(2)
}
const datasetsNext = () => {
  moveToStep(3)
}

const save = async (asPrivate: boolean) => {
  const reuse = await $api<Reuse>('/api/1/reuses/', {
    method: 'POST',
    body: JSON.stringify(toApi(reuseForm.value, { private: asPrivate, datasets: datasets.value })),
  })

  if (reuseForm.value.image && typeof reuseForm.value.image !== 'string') {
    const formData = new FormData()
    formData.set('file', reuseForm.value.image)
    await $fileApi(`/api/1/reuses/${reuse.id}/image`, {
      method: 'POST',
      body: formData,
    })
  }

  await navigateTo(reuse.page, { external: true })
}

watchEffect(() => {
  if (!isCurrentStepValid.value) {
    moveToStep(1)
  }
})
</script>
