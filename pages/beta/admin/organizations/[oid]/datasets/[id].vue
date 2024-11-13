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
          :to="`beta/admin/organizations/${currentOrganization.id}/profile`"
        >
          {{ currentOrganization.name }}
        </NuxtLinkLocale>
      </li>
      <li v-if="currentOrganization">
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          :to="`/beta/admin/organizations/${currentOrganization.id}/datasets`"
        >
          {{ t('Datasets') }}
        </NuxtLinkLocale>
      </li>
      <li v-if="dataset">
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ dataset.title }}
        </a>
      </li>
    </Breadcrumb>

    <div v-if="dataset">
      <h1 class="fr-h3 fr-mb-5v">
        {{ dataset.title }}
      </h1>

      <TabLinks
        :links="[
          { href: getDatasetAdminUrl(dataset), label: t('Metadata') },
          ]"
      />

      <NuxtPage
        :page-key="route => route.fullPath"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Dataset } from '@datagouv/components'
import TabLinks from '~/components/TabLinks.vue'

const { t } = useI18n()

const route = useRoute()
const { currentOrganization } = useCurrentOrganization()
const url = computed(() => `/api/1/datasets/${route.params.id}`)
const { data: dataset } = await useAPI<Dataset>(url, { lazy: true })
</script>
