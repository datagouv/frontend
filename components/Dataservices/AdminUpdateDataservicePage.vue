<template>
  <div>
    <DescribeDataservice
      v-if="dataserviceForm"
      v-model="dataserviceForm"
      type="update"
      @submit="save"
    >
      <template #button>
        <button
          type="submit"
          class="fr-btn"
          :disabled="loading"
        >
          {{ t("Save") }}
        </button>
      </template>
      <div class="mt-5 space-y-5">
        <TransferBanner
          type="Dataservice"
          :subject="dataserviceSubject"
          :label="$t('Transfer dataservice')"
        />
        <BannerAction
          type="danger"
          :title="$t('Delete the dataservice')"
        >
          {{ $t("Be careful, this action can't be reverse.") }}
          <template #button>
            <ModalWithButton
              :title="$t('Are you sure you want to delete this dataservice ?')"
              size="lg"
            >
              <template #button="{ attrs, listeners }">
                <BrandedButton
                  color="danger"
                  size="xs"
                  :icon="RiDeleteBin6Line"
                  v-bind="attrs"
                  v-on="listeners"
                >
                  {{ $t('Delete') }}
                </BrandedButton>
              </template>
              <p class="fr-text--bold">
                {{ $t("This action can't be reverse.") }}
              </p>
              <template #footer>
                <div class="flex-1 fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                  <BrandedButton
                    color="danger"
                    :disabled="loading"
                    @click="deleteDataservice"
                  >
                    {{ $t("Delete the dataservice") }}
                  </BrandedButton>
                </div>
              </template>
            </ModalWithButton>
          </template>
        </BannerAction>
      </div>
    </DescribeDataservice>
  </div>
</template>

<script setup lang="ts">
import type { Dataservice } from '@datagouv/components'
import { RiDeleteBin6Line } from '@remixicon/vue'
import DescribeDataservice from '~/components/Dataservices/DescribeDataservice.vue'
import type { ContactPoint, DataserviceForm, LinkToSubject } from '~/types/types'
import { toForm, toApi } from '~/utils/dataservices'

const { t } = useI18n()
const { $api } = useNuxtApp()
const { toast } = useToast()

const route = useRoute()
const loading = ref(false)

const localePath = useLocalePath()

const url = computed(() => `/api/1/dataservices/${route.params.id}`)
const { data: dataservice } = await useAPI<Dataservice>(url, { lazy: true })
const dataserviceSubject = computed<Dataservice & LinkToSubject>(() => {
  return {
    ...dataservice.value,
    page: dataservice.value.self_web_url,
  }
})
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
      body: JSON.stringify(toApi(dataserviceForm.value, { private: dataserviceForm.value.private })),
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
    if (route.params.oid) {
      await navigateTo(localePath(`/beta/admin/organizations/${route.params.oid}/dataservices`), { replace: true })
    }
    else {
      await navigateTo(localePath('/beta/admin/me/dataservices'), { replace: true })
    }
  }
  finally {
    loading.value = false
  }
}
</script>
