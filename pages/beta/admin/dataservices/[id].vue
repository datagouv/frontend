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
          :to="`/beta/admin/organizations/${currentOrganization.id}/profile`"
        >
          {{ currentOrganization.name }}
        </NuxtLinkLocale>
      </li>
      <li v-if="currentOrganization">
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          :to="`/beta/admin/organizations/${currentOrganization.id}/dataservices`"
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
import TabLinks from '~/components/TabLinks.vue'

const { t } = useI18n()

const route = useRoute()
const { currentOrganization } = await useOrganizations()
const url = computed(() => `/api/1/dataservices/${route.params.id}`)
const { data: dataservice } = await useAPI<Dataservice>(url, { lazy: true })
</script>
