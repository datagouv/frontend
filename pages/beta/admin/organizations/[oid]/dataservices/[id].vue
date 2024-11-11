<template>
  <div>
    <Breadcrumb>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/beta/admin"
        >
          {{ t('Administration') }}
        </NuxtLinkLocale>
      </li>
      <li v-if="currentOrganization">
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/beta/admin"
        >
          {{ currentOrganization.name }}
        </NuxtLinkLocale>
      </li>
      <li v-if="currentOrganization">
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          :to="currentOrganization ? `/beta/admin/organizations/${currentOrganization.id}/dataservices`: '/beta/admin/me/dataservices'"
        >
          {{ t('Dataservices') }}
        </NuxtLinkLocale>
      </li>
      <li v-if="dataservice">
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ dataservice.title }}
        </a>
      </li>
    </Breadcrumb>

    <h1
      v-if="dataservice"
      class="fr-h3 fr-mb-5v"
    >
      {{ dataservice.title }}
    </h1>

    <nav class="flex px-8 border-b space-x-2 font-bold">
      <a
        href=""
        class="bloc bg-blue-light hover:!bg-blue-tint px-4 py-2 no-underline border !border-transparent -mb-1 outline-none !bg-none aria-current-page:bg-white aria-current-page:!border-gray-200 aria-current-page:hover:!bg-white"
        aria-current="page"
      >{{ t('Metadata') }}</a>
      <a
        href=""
        class="bloc bg-blue-light hover:!bg-blue-tint px-4 py-2 no-underline border !border-transparent -mb-1 outline-none !bg-none aria-current-page:bg-white aria-current-page:!border-gray-200 aria-current-page:hover:!bg-white"
      >{{ t('Datasets') }}</a>
    </nav>

    <DescribeDataservice
      v-model="dataservice"
      hide-producer
      @submit="save"
    >
      <button
        type="submit"
        class="fr-btn"
      >
        {{ $t("Save") }}
      </button>
    </DescribeDataservice>
  </div>
</template>

<script setup lang="ts">
import type { Dataservice } from '@datagouv/components'
import DescribeDataservice from '~/components/Dataservices/DescribeDataservice.vue'
import type { DataserviceForm } from '~/types/types'

const { currentOrganization } = useCurrentOrganization()
const { t } = useI18n()
const { $api } = useNuxtApp()

const route = useRoute()

const url = computed(() => `/api/1/dataservices/${route.params.id}`)
const { data: dataservice } = await useAPI<Dataservice, DataserviceForm>(url, {
  lazy: true,
  transform: async dataservice => ({ ...toForm(dataservice), id: dataservice.id }),
})

const save = async () => {
  console.log(dataservice.value)
  await $api(`/api/1/dataservices/${dataservice.value.id}/`, {
    method: 'PATCH',
    body: JSON.stringify(toApi(dataservice.value)),
  })
}
</script>
