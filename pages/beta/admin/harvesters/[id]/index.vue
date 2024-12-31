<template>
  <LoadingBlock :status>
    <div v-if="pageData && pageData.total > 0">
      <AdminTable>
        <thead>
          <tr>
            <AdminTableTh scope="col">
              {{ $t("Job ID") }}
            </AdminTableTh>
            <AdminTableTh scope="col">
              {{ $t("Status") }}
            </AdminTableTh>
            <AdminTableTh scope="col">
              {{ $t("Started at") }}
            </AdminTableTh>
            <AdminTableTh scope="col">
              {{ $t("Ended at") }}
            </AdminTableTh>
            <AdminTableTh
              scope="col"
              class="w-16"
            >
              <Tooltip class="ml-auto">
                <RiDatabase2Line class="size-3.5" />
                <template #tooltip>
                  {{ $t('Datasets') }}
                </template>
              </Tooltip>
            </AdminTableTh>
            <AdminTableTh
              scope="col"
              class="w-16"
            >
              <Tooltip class="ml-auto">
                <RiRobot2Line class="size-3.5" />
                <template #tooltip>
                  {{ $t('Dataservices') }}
                </template>
              </Tooltip>
            </AdminTableTh>
          </tr>
        </thead>
        <tbody v-if="pageData">
          <tr
            v-for="job in pageData.data"
            :key="job.id"
          >
            <td>
              <AdminContentWithTooltip>
                <NuxtLinkLocale
                  class="fr-link fr-reset-link"
                  :href="getHarvesterAdminUrl(harvester)"
                >
                  {{ job.id }}
                </NuxtLinkLocale>
              </AdminContentWithTooltip>
            </td>
            <td>
              <JobBadge :job />
            </td>
            <td>{{ job.started ? formatDate(job.started, 'LLL') : formatDate(job.created, 'LLL') }}</td>
            <td>{{ job.ended ? formatDate(job.ended, 'LLL') : '—' }}</td>
            <td class="!text-right font-mono">
              {{ job.items.filter((i) => i.dataset).length }}
            </td>
            <td class="!text-right font-mono">
              {{ job.items.filter((i) => i.dataservice).length }}
            </td>
          </tr>
        </tbody>
      </AdminTable>
      <Pagination
        :page="page"
        :page-size="pageSize"
        :total-results="pageData.total"
        @change="(changedPage: number) => page = changedPage"
      />
    </div>
  </LoadingBlock>
</template>

<script setup lang="ts">
import { formatDate, Pagination } from '@datagouv/components'
import { RiDatabase2Line, RiRobot2Line } from '@remixicon/vue'
import AdminTable from '~/components/AdminTable/Table/AdminTable.vue'
import AdminTableTh from '~/components/AdminTable/Table/AdminTableTh.vue'
import JobBadge from '~/components/Harvesters/JobBadge.vue'
import type { HarvesterJob, HarvesterSource } from '~/types/harvesters'
import type { PaginatedArray } from '~/types/types'

const page = ref(1)
const pageSize = ref(10)

const route = useRoute()
const sourceUrl = computed(() => `/api/1/harvest/source/${route.params.id}`)
const { data: harvester } = await useAPI<HarvesterSource>(sourceUrl, { lazy: true })

const jobsUrl = computed(() => `/api/1/harvest/source/${route.params.id}/jobs`)
const jobsParams = computed(() => {
  return {
    page: page.value,
    page_size: pageSize.value,
  }
})

const { data: pageData, status } = await useAPI<PaginatedArray<HarvesterJob>>(jobsUrl, { lazy: true, query: jobsParams })
</script>
