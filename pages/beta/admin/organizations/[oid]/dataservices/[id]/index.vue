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
      >
        {{ t("Save") }}
      </button>
    </DescribeDataservice>
  </div>
</template>

<script setup lang="ts">
import type { Dataservice } from '@datagouv/components'
import DescribeDataservice from '~/components/Dataservices/DescribeDataservice.vue'
import type { DataserviceForm } from '~/types/types'
import { toForm, toApi } from '~/utils/dataservices'

const { t } = useI18n()
const { $api } = useNuxtApp()

const route = useRoute()

const url = computed(() => `/api/1/dataservices/${route.params.id}`)
const { data: dataservice } = await useAPI<Dataservice>(url, { lazy: true })
const dataserviceForm = ref<DataserviceForm | null>(null)
watchEffect(() => {
  dataserviceForm.value = toForm(dataservice.value)
})

const save = async () => {
  if (!dataserviceForm.value) throw new Error('No dataservice form')

  await $api(`/api/1/dataservices/${dataservice.value.id}/`, {
    method: 'PATCH',
    body: JSON.stringify(toApi(dataserviceForm.value)),
  })
}
</script>
