<template>
  <div>
    <DescribeDataservice
      v-if="dataserviceForm"
      v-model="dataserviceForm"
      type="update"
      @submit="save"
    >
      <button
        type="submit"
        class="fr-btn"
        :disabled="loading"
      >
        {{ t("Save") }}
      </button>
    </DescribeDataservice>
    <AdminDangerZone
        class="mt-5"
      >
        <div class="fr-col">
          <p class="fr-m-0 text-neutral-800">
            {{ $t('Delete the dataservice') }}
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
            :title="$t('Are you sure you want to delete this dataservice ?')"
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
                  @click="deleteDataservice"
                >
                  {{ $t("Delete the dataservice") }}
                </BrandedButton>
              </div>
            </template>
          </Modal>
        </div>
      </AdminDangerZone>
  </div>
</template>

<script setup lang="ts">
import type { Dataservice } from '@datagouv/components'
import DescribeDataservice from '~/components/Dataservices/DescribeDataservice.vue'
import type { ContactPoint, DataserviceForm } from '~/types/types'
import { toForm, toApi } from '~/utils/dataservices'
import { RiDeleteBin6Line } from '@remixicon/vue'
import BrandedButton from '../BrandedButton/BrandedButton.vue'

const { t } = useI18n()
const { $api } = useNuxtApp()
const { toast } = useToast()

const route = useRoute()
const loading = ref(false)

const config = useRuntimeConfig()
const modalId = useId()
const modalTitleId = useId()

const openedDeleteModal = ref(false)

function openDeleteModal() {
  openedDeleteModal.value = true
}

function closeDeleteModal() {
  openedDeleteModal.value = false
}

const url = computed(() => `/api/1/dataservices/${route.params.id}`)
const { data: dataservice } = await useAPI<Dataservice>(url, { lazy: true })
const dataserviceForm = ref<DataserviceForm | null>(null)
watchEffect(() => {
  dataserviceForm.value = toForm(dataservice.value)
})

const save = async () => {
  if (!dataserviceForm.value) throw new Error('No dataservice form')

  try {
    loading.value = true

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

    await $api(`/api/1/dataservices/${dataservice.value.id}/`, {
      method: 'PATCH',
      body: JSON.stringify(toApi(dataserviceForm.value)),
    })

    toast.success(t('Dataservice updated!'))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }
  finally {
    loading.value = false
  }
}

async function deleteDataservice() {
  loading.value = true
  try {
    await $api(`/api/1/dataservices/${route.params.id}`, {
      method: 'DELETE',
    })
    navigateTo(`${config.public.apiBase}/en/beta/admin`, { external: true })
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
    navigateTo(`${config.public.apiBase}/en/beta/admin/organizations/${route.params.oid}/datasets`, { external: true })
  }
  finally {
    loading.value = false
  }
}
</script>
