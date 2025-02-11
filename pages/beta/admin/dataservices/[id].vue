<template>
  <div>
    <AdminBreadcrumb>
      <BreadcrumbItem
        v-if="currentOrganization"
        :to="`/beta/admin/organizations/${currentOrganization.id}/dataservices`"
      >
        {{ t('Dataservices') }}
      </BreadcrumbItem>
      <BreadcrumbItem v-if="dataservice">
        {{ dataservice.title }}
      </BreadcrumbItem>
    </AdminBreadcrumb>

    <div v-if="dataservice">
      <div class="flex items-center justify-between mb-5">
        <h1 class="fr-h3 !mb-0">
          {{ dataservice.title }}
        </h1>
        <a
          :href="dataservice.self_web_url"
          class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--secondary-grey-500 fr-btn--icon-left fr-icon-eye-line"
        >
          {{ t('See the dataservice page') }}
        </a>
      </div>

      <TabLinks
        class="mb-5"
        :links="[
          { href: getDataserviceAdminUrl(dataservice), label: t('Metadata') },
          { href: `${getDataserviceAdminUrl(dataservice)}/datasets`, label: t('Associated datasets') },
        ]"
      />

      <NuxtPage
        :page-key="route => route.fullPath"
        :dataservice
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Dataservice } from '@datagouv/components'
import AdminBreadcrumb from '~/components/Breadcrumbs/AdminBreadcrumb.vue'
import BreadcrumbItem from '~/components/Breadcrumbs/BreadcrumbItem.vue'
import TabLinks from '~/components/TabLinks.vue'

const { t } = useI18n()

const route = useRoute()
const { currentOrganization } = useCurrentOwned()
const url = computed(() => `/api/1/dataservices/${route.params.id}`)
const { data: dataservice } = await useAPI<Dataservice>(url, { lazy: true })
</script>
