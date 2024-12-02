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
      <li v-if="organization">
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          :to="`/beta/admin/organizations/${organization.id}/profile`"
        >
          {{ organization.name }}
        </NuxtLinkLocale>
      </li>
      <li>
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ t('Harvesters') }}
        </a>
      </li>
    </Breadcrumb>
    <h1 class="fr-h3 fr-mb-5v">
      {{ t("Harvesters") }}
    </h1>
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col">
        <h2
          v-if="status === 'success' && pageData.total"
          class="subtitle subtitle--uppercase fr-m-0"
        >
          {{ t('{n} harvesters', pageData.total) }}
        </h2>
      </div>
      <div class="fr-col-auto fr-grid-row fr-grid-row--middle">
        <!-- Buttons -->
      </div>
    </div>
    <AdminTable
      v-if="status === 'pending' || (status === 'success' && pageData.total > 0)"
      :loading="status === 'pending'"
    >
      <thead>
        <tr>
          <AdminTableTh scope="col">
            {{ t("Name") }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Status") }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Created at") }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Last run") }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Datasets") }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Dataservices") }}
          </AdminTableTh>
        </tr>
      </thead>
      <tbody v-if="pageData">
        <tr
          v-for="harvester in pageData.data"
          :key="harvester.id"
        >
          <td>
            <AdminContentWithTooltip>
              <a
                class="fr-link fr-reset-link"
                :href="getHarvesterLinkToAdmin(harvester)"
              >
                <TextClamp
                  :text="harvester.name"
                  :auto-resize="true"
                  :max-lines="2"
                />
              </a>
            </AdminContentWithTooltip>
          </td>
          <td>
            <AdminBadge size="xs" :type="getStatus(harvester).type">
              {{ getStatus(harvester).label }}
            </AdminBadge>
          </td>
          <td>{{ formatDate(harvester.created_at) }}</td>
          <td>
            <template v-if="harvester.last_job?.ended">
              {{ formatDate(harvester.last_job.ended) }}
            </template>
            <template v-else>
              {{ t('Not yet') }}
            </template>
          </td>
          <td>
            {{ getHarvesterDatasets(harvester) }}
          </td>
          <td>
            {{ getHarvesterDataservices(harvester) }}
          </td>
        </tr>
      </tbody>
    </AdminTable>
    <div
      v-else
      class="flex flex-col items-center"
    >
      <!-- <nuxt-img
          src="/illustrations/reuse.svg"
          class="h-20"
        /> -->
      <p class="fr-text--bold fr-my-3v">
        {{ t(`There is no harvesters yet`) }}
      </p>
    </div>
    <Pagination
      v-if="status === 'success' && pageData.total > pageSize"
      :page="page"
      :page-size="pageSize"
      :total-results="pageData.total"
      @change="(changedPage: number) => page = changedPage"
    />
  </div>
</template>

<script setup lang="ts">
import { formatDate, Pagination, type Organization } from '@datagouv/components'
import { refDebounced } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AdminBadgeState, AdminBadgeType, DiscussionSortedBy, PaginatedArray, SortDirection } from '~/types/types'
import Breadcrumb from '~/components/Breadcrumb/Breadcrumb.vue'
import AdminTable from '~/components/AdminTable/Table/AdminTable.vue'
import AdminTableTh from '~/components/AdminTable/Table/AdminTableTh.vue'
import type { HarvesterJob, HarvesterSource } from '~/types/harvesters'

const props = defineProps<{
  organization?: Organization | null
}>()
const { t } = useI18n()
const config = useRuntimeConfig()
const { $api } = useNuxtApp()

const page = ref(1)
const pageSize = ref(10)
const sortedBy = ref<DiscussionSortedBy>('created')
const direction = ref<SortDirection>('desc')
const sortDirection = computed(() => `${direction.value === 'asc' ? '' : '-'}${sortedBy.value}`)
const q = ref('')
const qDebounced = refDebounced(q, 500) // TODO add 500 in config

const url = computed(() => {
  const url = new URL(`/api/1/harvest/sources/`, config.public.apiBase)

  if (props.organization) {
    url.searchParams.set('owner', props.organization.id)
  }

  url.searchParams.set('deleted', 'true')
  url.searchParams.set('sort', sortDirection.value)
  url.searchParams.set('q', qDebounced.value)
  url.searchParams.set('page_size', pageSize.value.toString())
  url.searchParams.set('page', page.value.toString())

  return url.toString()
})

const { data: pageData, status } = await useAPI<PaginatedArray<HarvesterSource>>(url, { lazy: true })

const jobs = ref<Record<string, HarvesterJob>>({})
const jobsPromises = ref<Record<string, Promise<void>>>({})

watchEffect(async () => {
  if (!pageData.value) return

  for (const source of pageData.value.data) {
    if (!source.last_job) continue
    if (source.last_job.id in jobsPromises.value) continue

    jobsPromises.value[source.last_job.id] = $api<HarvesterJob>(`/api/1/harvest/job/${source.last_job.id}/`)
      .then((job) => {
        jobs.value[source.last_job.id] = job // Working because there is no conflicts between IDs from different types
      })
  }

  await Promise.all(Object.values(jobsPromises.value))
})

function getHarvesterLinkToAdmin(harvester: HarvesterSource) {
  return `${config.public.apiBase}/en/admin/harvester/${harvester.id}/`
}

function getHarvesterDataservices(harvester: HarvesterSource) {
  if (!harvester.last_job || !jobs.value[harvester.last_job.id]) {
    return 0
  }
  return jobs.value[harvester.last_job.id].items.filter(item => item.dataservice).length
}

function getHarvesterDatasets(harvester: HarvesterSource) {
  if (!harvester.last_job || !jobs.value[harvester.last_job.id]) {
    return 0
  }
  return jobs.value[harvester.last_job.id].items.filter(item => item.dataset).length
}

function getStatus(harvester: HarvesterSource): { label: string, type: AdminBadgeType } {
  switch (harvester.last_job?.status) {
    case 'pending':
      return {
        label: t('Pending'),
        type: 'secondary',
      }
    case 'initializing':
      return {
        label: t('Initializing'),
        type: 'primary',
      }
    case 'initialized':
      return {
        label: t('Initialized'),
        type: 'secondary',
      }
    case 'processing':
      return {
        label: t('Processing'),
        type: 'primary',
      }
    case 'done':
      return {
        label: t('Done'),
        type: 'success',
      }
    case 'done-errors':
      return {
        label: t('Done with errors'),
        type: 'warning',
      }
    case 'failed':
      return {
        label: t('Failed'),
        type: 'danger',
      }
    default:
      return {
        label: t('No job yet'),
        type: 'secondary',
      }
  }
}
</script>
