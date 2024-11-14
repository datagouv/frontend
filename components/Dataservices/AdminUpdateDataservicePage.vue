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
  </div>
</template>

<script setup lang="ts">
import type { Dataservice } from '@datagouv/components'
import DescribeDataservice from '~/components/Dataservices/DescribeDataservice.vue'
import type { ContactPoint, DataserviceForm } from '~/types/types'
import { toForm, toApi } from '~/utils/dataservices'

const { t } = useI18n()
const { $api } = useNuxtApp()
const { toast } = useToast()

const route = useRoute()
const loading = ref(false)

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
</script>
