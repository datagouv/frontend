<template>
  <div>
    <DescribeDataset
      v-if="datasetForm"
      v-model="datasetForm"
      type="update"
      :submit-label="t('Save')"
      @submit="save"
    >
      <div class="mt-5 space-y-5">
        <TransferBanner
          type="Dataset"
          :subject="dataset"
          :label="$t('Transfer dataset')"
        />

        <BannerAction
          type="danger"
          :title="$t('Delete the dataset')"
        >
          {{ $t("Be careful, this action can't be reverse.") }}

          <template #button>
            <ModalWithButton
              :title="$t('Are you sure you want to delete this dataset ?')"
              size="lg"
            >
              <template #button="{ attrs, listeners }">
                <BannerActionButton
                  :icon="RiDeleteBin6Line"
                  v-bind="attrs"
                  v-on="listeners"
                >
                  {{ $t('Delete') }}
                </BannerActionButton>
              </template>
              <p class="fr-text--bold">
                {{ $t("This action can't be reverse.") }}
              </p>
              <template #footer>
                <div class="flex-1 fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                  <BrandedButton
                    color="danger"
                    :disabled="loading"
                    @click="deleteDataset"
                  >
                    {{ $t("Delete the dataset") }}
                  </BrandedButton>
                </div>
              </template>
            </ModalWithButton>
          </template>
        </BannerAction>
      </div>
    </DescribeDataset>
  </div>
</template>

<script setup lang="ts">
import type { Dataset, Frequency, License } from '@datagouv/components'
import { RiDeleteBin6Line } from '@remixicon/vue'
import DescribeDataset from '~/components/Datasets/DescribeDataset.vue'
import type { DatasetForm, EnrichedLicense, SpatialGranularity } from '~/types/types'
import { toForm, toApi } from '~/utils/datasets'

const { t } = useI18n()
const { $api } = useNuxtApp()
const config = useRuntimeConfig()

const route = useRoute()
const loading = ref(false)

const localePath = useLocalePath()

const { setCurrentOrganization } = await useOrganizations()

const { toast } = useToast()

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
  if (dataset.value && licenses.value && frequencies.value && granularities.value) {
    datasetForm.value = toForm(dataset.value, licenses.value, frequencies.value, [], granularities.value)
  }
})

watchEffect(() => {
  if (dataset.value && dataset.value.organization) {
    setCurrentOrganization(dataset.value.organization)
  }
})

const save = async () => {
  if (!datasetForm.value) throw new Error('No dataset form')

  try {
    loading.value = true

    await $api(`/api/1/datasets/${dataset.value.id}/`, {
      method: 'PUT',
      body: JSON.stringify(toApi(datasetForm.value, { private: datasetForm.value.private })),
    })

    toast.success(t('Dataset updated!'))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }
  finally {
    loading.value = false
  }
}

async function deleteDataset() {
  loading.value = true
  try {
    await $api(`/api/1/datasets/${route.params.id}`, {
      method: 'DELETE',
    })
    if (route.params.oid) {
      await navigateTo(localePath(`/beta/admin/organizations/${route.params.oid}/datasets`), { replace: true })
    }
    else {
      await navigateTo(localePath('/beta/admin/me/datasets'), { replace: true })
    }
  }
  finally {
    loading.value = false
  }
}
</script>
