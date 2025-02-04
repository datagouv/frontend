<template>
  <div
    class="bg-white border rounded"
    :class="{ 'pb-4': metricsOpen }"
  >
    <header class="p-4 flex items-center justify-between relative">
      <div>
        <h4
          :id="metricsTitleId"
          class="!mb-0 flex items-center"
        >
          <button
            type="button"
            class="fr-p-0 text-left"
            data-testid="expand-button"
            :aria-expanded="metricsOpen"
            @click="metricsOpen = ! metricsOpen"
          >
            <div class="text-gray-title font-bold text-base/6">
              {{ t('Statistics for the last 12 months') }}
            </div>
            <div class="text-gray-medium font-normal text-sm/6">
              <span v-if="new Date().getHours() > 7 - 1">{{ $t('Updated this morning') }}</span>
              <span v-else>{{ $t('Updated yesterday') }}</span>
            </div>

            <span class="absolute inset-0 z-1" />
          </button>
        </h4>
      </div>
      <div class="flex items-center">
        <p class="fr-col-auto fr-ml-3v fr-m-0">
          <a
            :disabled="!downloadStatsUrl"
            :href="downloadStatsUrl || ''"
            rel="ugc nofollow noopener"
            :title="t('Download file')"
            download="stats.csv"
            class="relative fr-btn fr-btn--sm fr-btn--icon-left fr-icon-test-tube-line fr-icon-download-line fr-icon--sm z-2"
          >
            {{ t('Download') }}
          </a>
        </p>
        <div
          class="fr-icon--sm fr-ml-4v"
          :class="{ 'fr-icon-arrow-up-s-line': metricsOpen, 'fr-icon-arrow-down-s-line': !metricsOpen }"
        />
      </div>
    </header>
    <section
      v-if="metricsOpen"
      :aria-labelledby="metricsTitleId"
      class="flex flex-col md:flex-row px-4 pb-4"
    >
      <StatBox
        :title="t('Views')"
        :data="metricsViews"
        type="line"
        :summary="metricsViewsTotal"
        class="md:w-1/3 mb-8 md:mb-0"
      />
      <StatBox
        :title="t('Downloads')"
        :data="metricsDownloads"
        type="line"
        :summary="metricsDownloadsTotal"
        class="md:w-1/3 mb-8 md:mb-0"
      />
      <StatBox
        :title="t('Reuses Visits')"
        :data="metricsReuses"
        type="line"
        :summary="metricsReusesTotal"
        class="md:w-1/3 mb-8 md:mb-0"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { StatBox, type Organization } from '@datagouv/components'

const props = defineProps<{
  organization: Organization
}>()

const { t } = useI18n()

const metricsOpen = ref(false)
const metricsTitleId = useId()

const metricsViews = ref<null | Record<string, number>>(null)
const metricsViewsTotal = ref<null | number>(null)
const metricsDownloads = ref<null | Record<string, number>>(null)
const metricsDownloadsTotal = ref<null | number>(null)
const metricsReuses = ref<null | Record<string, number>>(null)
const metricsReusesTotal = ref<null | number>(null)
watchEffect(async () => {
  if (!props.organization.id) return

  {
    // Fetching last 12 months
    const response = await fetch(`https://metric-api.data.gouv.fr/api/organizations/data/?organization_id__exact=${props.organization.id}&metric_month__sort=desc&page_size=12`)
    const page = await response.json()

    metricsViews.value = {}
    metricsDownloads.value = {}
    metricsReuses.value = {}

    for (const { metric_month, monthly_download_resource, monthly_visit_dataset, monthly_visit_reuse } of page.data) {
      metricsViews.value[metric_month] = monthly_visit_dataset
      metricsDownloads.value[metric_month] = monthly_download_resource
      metricsReuses.value[metric_month] = monthly_visit_reuse
    }
  }

  {
    // Fetching totals
    const response = await fetch(`https://metric-api.data.gouv.fr/api/organizations_total/data/?organization_id__exact=${props.organization.id}`)
    const page = await response.json()
    if (page.data[0]) {
      metricsViewsTotal.value = page.data[0].visit_dataset
      metricsDownloadsTotal.value = page.data[0].download_resource
      metricsReusesTotal.value = page.data[0].visit_reuse
    }
  }
})

const downloadStatsUrl = computed(() => {
  if (!metricsViews.value || !metricsDownloads.value || !metricsReuses.value) {
    return null
  }

  let data = 'month,visit_datasets,download_resource,visit_reuse\n'

  for (const month in metricsViews.value) {
    data += `${month},${metricsViews.value[month]},${metricsDownloads.value[month]},${metricsReuses.value[month]}\n`
  }

  return URL.createObjectURL(new Blob([data], { type: 'text/csv' }))
})
</script>
