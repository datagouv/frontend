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

    <div v-if="dataservice">
      <h1 class="fr-h3 fr-mb-5v">
        {{ dataservice.title }}
      </h1>

      <TabLinks
        :links="[
          { href: getDataserviceAdminUrl(dataservice), label: t('Metadata') },
          { href: `${getDataserviceAdminUrl(dataservice)}/datasets`, label: t('Datasets') },
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
import TabLinks from '~/components/TabLinks.vue'

const { t } = useI18n()

const route = useRoute()
const { currentOrganization } = useCurrentOrganization()
const url = computed(() => `/api/1/dataservices/${route.params.id}`)
const { data: dataservice } = await useAPI<Dataservice>(url, { lazy: true })
</script>
