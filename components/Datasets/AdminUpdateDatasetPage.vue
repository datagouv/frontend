<template>
  <div>
    <DescribeDataset
      v-if="datasetForm"
      v-model="datasetForm"
      type="update"
      :submit-label="t('Save')"
      @submit="save"
    />
    <AdminDangerZone
        class="mt-5"
      >
        <div class="fr-col">
          <p class="fr-m-0 text-neutral-800">
            {{ $t('Delete the dataset') }}
          </p>
          <p class="fr-m-0 fr-text--xs text-red-600">
            {{ $t("Be careful, this action can't be reverse.") }}
          </p>
        </div>
        <div class="fr-col-auto">
          <BrandedButton
            color="red"
            size="sm"
            type="secondary"
            :aria-controls="modalId"
            :icon="RiDeleteBin6Line"
            @click="openDeleteModal"
          >
            {{ $t('Delete') }}
          </BrandedButton>
          <Modal
            :id="modalId"
            :opened="openedDeleteModal"
            :aria-labelledby="modalTitleId"
            role="dialog"
            :title="$t('Are you sure you want to delete this dataset ?')"
            size="lg"
            @close="closeDeleteModal"
          >
            <p class="fr-text--bold">
              {{ $t("This action can't be reverse.") }}
            </p>
            <template #footer>
              <div class="flex-1 fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                <BrandedButton
                  color="red"
                  type="secondary"
                  role="button"
                  :disabled="loading"
                  @click="deleteDataset"
                >
                  {{ $t("Delete the dataset") }}
                </BrandedButton>
              </div>
            </template>
          </Modal>
        </div>
      </AdminDangerZone>
  </div>
</template>

<script setup lang="ts">
import type { Dataset, Frequency, License } from '@datagouv/components'
import DescribeDataset from '~/components/Datasets/DescribeDataset.vue'
import type { DatasetForm, EnrichedLicense, SpatialGranularity } from '~/types/types'
import { toForm, toApi } from '~/utils/datasets'
import { RiDeleteBin6Line } from '@remixicon/vue'
import BrandedButton from '../BrandedButton/BrandedButton.vue'

const { t } = useI18n()
const { $api } = useNuxtApp()
const config = useRuntimeConfig()

const route = useRoute()
const loading = ref(false)

const modalId = useId()
const modalTitleId = useId()

const localePath = useLocalePath()

const openedDeleteModal = ref(false)

function openDeleteModal() {
  openedDeleteModal.value = true
}

function closeDeleteModal() {
  openedDeleteModal.value = false
}

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

const save = async () => {
  if (!datasetForm.value) throw new Error('No dataset form')

  try {
    loading.value = true

    await $api(`/api/1/datasets/${dataset.value.id}/`, {
      method: 'PUT',
      body: JSON.stringify(toApi(datasetForm.value)),
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
