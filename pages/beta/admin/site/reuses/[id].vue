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
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/beta/admin/me/reuses"
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
    </Breadcrumb>

    <div v-if="reuse">
      <div class="flex items-center justify-between">
        <h1 class="fr-h3 fr-mb-5v">
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
