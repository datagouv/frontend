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
      <template v-if="dataset">
        <li v-if="dataset.organization">
          <NuxtLinkLocale
            class="fr-breadcrumb__link"
            :to="`/beta/admin/organizations/${dataset.organization.id}/profile`"
          >
            {{ dataset.organization.name }}
          </NuxtLinkLocale>
        </li>
        <li v-if="dataset.organization">
          <NuxtLinkLocale
            class="fr-breadcrumb__link"
            :to="`/beta/admin/organizations/${dataset.organization.id}/datasets`"
          >
            {{ t('Datasets') }}
          </NuxtLinkLocale>
        </li>
        <li>
          <a
            class="fr-breadcrumb__link"
            aria-current="page"
          >
            {{ dataset.title }}
          </a>
        </li>
      </template>
    </AdminBreadcrumb>

    <div v-if="dataset">
      <div class="mb-5">
        <div class="flex items-center justify-between mb-3">
          <h1 class="fr-h3 !mb-0">
            {{ dataset.title }}
          </h1>
          <a
            :href="dataset.page"
            class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--secondary-grey-500 fr-btn--icon-left fr-icon-eye-line"
          >
            {{ t('See the dataset page') }}
          </a>
        </div>

        <div class="text-sm text-mentionGrey space-y-1.5">
          <div class="space-x-1 flex items-center">
            <RiPriceTag3Line class="inline size-3" />
            <span>{{ $t('Metadata:') }}</span>
            <Tooltip>
              <QualityScore
                class="w-32"
                :score="dataset.quality.score"
              />
              <template #tooltip>
                <QualityScoreTooltipContent :dataset="dataset" />
              </template>
            </Tooltip>
          </div>
          <div class="space-x-1">
            <RiInformationLine class="inline size-3" />
            <span>{{ $t('Informations:') }}</span>
            <span class="space-x-2">
              <Tooltip class="inline">
                <span class="space-x-0.5 text-sm">
                  <RiEyeLine class="inline size-3.5" />
                  <span>{{ summarize(dataset.metrics.views ?? 0) }}</span>
                </span>
                <template #tooltip>
                  {{ $t('Views') }}
                </template>
              </Tooltip>
              <Tooltip class="inline">
                <span class="space-x-0.5 text-sm">
                  <RiDownloadLine class="inline size-3.5" />
                  <span>{{ summarize(dataset.metrics.resources_downloads ?? 0) }}</span>
                </span>
                <template #tooltip>
                  {{ $t('Downloads') }}
                </template>
              </Tooltip>
              <Tooltip class="inline">
                <span class="space-x-0.5 text-sm">
                  <RiLineChartLine class="inline size-3.5" />
                  <span>{{ summarize(dataset.metrics.reuses) }}</span>
                </span>
                <template #tooltip>
                  {{ $t('Reuses') }}
                </template>
              </Tooltip>
            </span>
          </div>
        </div>
      </div>

      <TabLinks
        class="mb-5"
        :links="[
          { href: getDatasetAdminUrl(dataset), label: t('Metadata') },
          { href: `${getDatasetAdminUrl(dataset)}/files`, label: t('Files') },
        ]"
      />

      <NuxtPage :page-key="route => route.fullPath" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { QualityScore, summarize, type Dataset } from '@datagouv/components'
import { RiDownloadLine, RiEyeLine, RiInformationLine, RiLineChartLine, RiPriceTag3Line } from '@remixicon/vue'
import QualityScoreTooltipContent from '~/components/dataset/QualityScore/QualityScoreTooltipContent/QualityScoreTooltipContent.vue'
import TabLinks from '~/components/TabLinks.vue'

const { t } = useI18n()

const route = useRoute()
const url = computed(() => `/api/1/datasets/${route.params.id}`)
const { data: dataset } = await useAPI<Dataset>(url, { lazy: true })
</script>
