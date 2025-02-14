<template>
  <div>
    <div class="flex flex-wrap">
      <h2 class="!text-sm !mb-2.5 w-full flex-none sm:flex-1">
        {{ $t('Statistics from the last 12 months') }}
      </h2>
      <div>
        <BrandedButton
          color="secondary"
          :disabled="!downloadStatsUrl"
          :href="downloadStatsUrl || ''"
          :title="$t('Download file')"
          download="stats.csv"
          :icon="RiDownloadLine"
          size="xs"
        >
          {{ $t('Download statistics as CSV') }}
        </BrandedButton>
      </div>
    </div>
    <section
      class="flex flex-col md:flex-row px-4 pb-4"
    >
      <StatBox
        :title="$t('Views')"
        :data="metricsViews"
        type="line"
        :summary="metricsViewsTotal"
        class="md:w-1/3 mb-8 md:mb-0"
      />
      <StatBox
        :title="$t('Downloads')"
        :data="metricsDownloads"
        type="line"
        :summary="metricsDownloadsTotal"
        class="md:w-1/3 mb-8 md:mb-0"
      />
      <StatBox
        :title="$t('Reuses Visits')"
        :data="metricsReuses"
        type="line"
        :summary="metricsReusesTotal"
        class="md:w-1/3 mb-8 md:mb-0"
      />
    </section>
    <SectionCollapse
      :title="$t('Members')"
      :button-text="$t('See members')"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(member, index) in organization.members"
          :key="member.user.id"
          class="flex flex-wrap gap-4 px-6"
          :class="{ 'border-l border-gray-default': index % 3 }"
        >
          <div>
            <Avatar
              :user="member.user"
              :size="60"
              class="flex-none rounded-full"
            />
          </div>
          <div class="flex-1">
            <p class="!mb-0">
              {{ member.user.first_name }} {{ member.user.last_name }}
            </p>
            <p class="!mb-0">
              <AdminBadge
                type="default"
                size="sm"
              >
                {{ member.role }}
              </AdminBadge>
            </p>
          </div>
        </div>
      </div>
    </SectionCollapse>
    <SectionCollapse
      :title="$t('Technical information')"
      :button-text="$t('See technical information')"
    >
      <DescriptionList class="mb-2">
        <div>
          <DescriptionListTerm>{{ $t('Latest update') }}</DescriptionListTerm>
          <DescriptionListDetails>{{ formatDate(organization.last_modified) }}</DescriptionListDetails>
        </div>
        <div>
          <DescriptionListTerm>{{ $t('ID') }}</DescriptionListTerm>
          <DescriptionListDetails class="flex items-center gap-2">
            {{ organization.id }}
            <CopyButton
              class="!-mt-0.5"
              :label="$t('Copy organization ID')"
              :copied-label="$t('Organization ID copied')"
              :text="organization.id"
              :hide-label="true"
            />
          </DescriptionListDetails>
        </div>
      </DescriptionList>
      <DescriptionList>
        <div>
          <DescriptionListTerm>{{ $t('Creation date') }}</DescriptionListTerm>
          <DescriptionListDetails>{{ formatDate(organization.created_at) }}</DescriptionListDetails>
        </div>
      </DescriptionList>
    </SectionCollapse>
  </div>
</template>

<script setup lang="ts">
import { Avatar, CopyButton, StatBox, type Organization } from '@datagouv/components'
import { RiDownloadLine } from '@remixicon/vue'

const props = defineProps<{
  organization: Organization
}>()

const metricsViews = ref<null | Record<string, number>>(null)
const metricsViewsTotal = ref<null | number>(null)
const metricsDownloads = ref<null | Record<string, number>>(null)
const metricsDownloadsTotal = ref<null | number>(null)
const metricsReuses = ref<null | Record<string, number>>(null)
const metricsReusesTotal = ref<null | number>(null)
watchEffect(async () => {
  const metrics = await getOrganizationMetrics(props.organization.id)
  metricsDownloads.value = metrics.downloads
  metricsDownloadsTotal.value = metrics.downloadsTotal
  metricsReuses.value = metrics.reusesViews
  metricsReusesTotal.value = metrics.reusesViewsTotal
  metricsViews.value = metrics.datasetsViews
  metricsViewsTotal.value = metrics.datasetsViewsTotal
})

const downloadStatsUrl = computed(() => {
  if (!metricsViews.value || !metricsDownloads.value || !metricsReuses.value) {
    return null
  }

  return createOrganizationMetricsUrl(metricsViews.value, metricsDownloads.value, metricsReuses.value)
})
</script>
