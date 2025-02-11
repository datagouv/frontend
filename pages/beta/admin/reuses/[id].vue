<template>
  <div>
    <AdminBreadcrumb>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/beta/admin"
        >
          {{ t('Administration') }}
        </NuxtLinkLocale>
      </li>
      <template v-if="reuse">
        <li v-if="reuse.organization">
          <NuxtLinkLocale
            class="fr-breadcrumb__link"
            :to="`/beta/admin/organizations/${reuse.organization.id}/profile`"
          >
            {{ reuse.organization.name }}
          </NuxtLinkLocale>
        </li>
        <li v-if="reuse.organization">
          <NuxtLinkLocale
            class="fr-breadcrumb__link"
            :to="`/beta/admin/organizations/${reuse.organization.id}/reuses`"
          >
            {{ t('Reuses') }}
          </NuxtLinkLocale>
        </li>
        <li v-if="reuse">
          <a
            class="fr-breadcrumb__link"
            aria-current="page"
          >
            {{ reuse.title }}
          </a>
        </li>
      </template>
    </AdminBreadcrumb>

    <div v-if="reuse">
      <div class="flex items-center justify-between mb-5">
        <h1 class="fr-h3 !mb-0">
          {{ reuse.title }}
        </h1>
        <a
          :href="reuse.page"
          class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--secondary-grey-500 fr-btn--icon-left fr-icon-eye-line"
        >
          {{ t('See the reuse page') }}
        </a>
      </div>

      <TabLinks
        class="mb-5"
        :links="[
          { href: getReuseAdminUrl(reuse), label: t('Metadata') },
          { href: `${getReuseAdminUrl(reuse)}/datasets`, label: t('Datasets') },
        ]"
      />

      <NuxtPage
        :page-key="route => route.fullPath"
        :reuse
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Reuse } from '@datagouv/components'
import TabLinks from '~/components/TabLinks.vue'

const { t } = useI18n()

const route = useRoute()
const url = computed(() => `/api/1/reuses/${route.params.id}`)
const { data: reuse } = await useAPI<Reuse>(url, { lazy: true })
</script>
