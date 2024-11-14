<template>
  <div class="bg-white fr-p-3w">
    <AdminTable :loading>
      <thead>
        <tr>
          <AdminTableTh
            scope="col"
          >
            {{ t('File name') }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Status") }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Type") }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Format") }}
          </AdminTableTh>
          <AdminTableTh
            scope="col"
          >
            {{ t('Created at') }}
          </AdminTableTh>
          <AdminTableTh
            scope="col"
          >
            {{ t('Updated at') }}
          </AdminTableTh>
        </tr>
      </thead>
      <tbody v-if="resourcesPage">
        <tr
          v-for="resource in resourcesPage.data"
          :key="resource.id"
        >
          <td>
            <AdminContentWithTooltip>
              <a
                class="fr-link fr-reset-link"
                :href="`/${locale}/admin/dataset/${dataset.id}/resource/${resource.id}`"
              >
                <TextClamp
                  :text="resource.title"
                  :auto-resize="true"
                  :max-lines="2"
                />
              </a>
            </AdminContentWithTooltip>
          </td>
          <td>
            <AdminBadge :type="getStatus(resource).type">
              {{ getStatus(resource).label }}
            </AdminBadge>
          </td>
          <td>
            {{ resource.type }}
          </td>
          <td>
            {{ resource.format }}
          </td>
          <td>
            {{ formatDate(resource.created_at) }}
          </td>
          <td>
            {{ formatDate(resource.last_modified) }}
          </td>
        </tr>
      </tbody>
    </AdminTable>
    <Pagination
      v-if="resourcesPage && resourcesPage.total > pageSize"
      :page="page"
      :page-size="pageSize"
      :total-results="resourcesPage.total"
      @change="(changedPage: number) => page = changedPage"
    />
  </div>
</template>

<script setup lang="ts">
import { formatDate, Pagination, type DatasetV2, type Resource } from '@datagouv/components'
import { useI18n } from 'vue-i18n'
import AdminTable from '../AdminTable/Table/AdminTable.vue'
import AdminTableTh from '../AdminTable/Table/AdminTableTh.vue'
import type { AdminBadgeState, PaginatedArray } from '~/types/types'

const route = useRoute()

const { $api } = useNuxtApp()
const { locale } = useI18n()

const datasetUrl = computed(() => `/api/2/datasets/${route.params.id}`)
const { data: dataset } = await useAPI<DatasetV2>(datasetUrl, { lazy: true })
const resourcesPage = ref<PaginatedArray<Resource> | null>(null)
const page = ref(1)
const pageSize = ref(10)

const resourcesUrl = computed(() => {
  if (!dataset.value) return

  const url = new URL(dataset.value.resources.href)
  url.searchParams.set('page_size', pageSize.value.toString())
  url.searchParams.set('page', page.value.toString())
  return url.toString()
})

watchEffect(async () => {
  if (!resourcesUrl.value) return
  resourcesPage.value = await $api<PaginatedArray<Resource>>(resourcesUrl.value)
})

const loading = ref(false)

const { t } = useI18n()

function getStatus(resource: Resource): { label: string, type: AdminBadgeState } {
  if (resource.extras['check:available'] === true) {
    return {
      label: t('Available'),
      type: 'info',
    }
  }

  if (resource.extras['check:available'] === false) {
    return {
      label: t('Unavailable'),
      type: 'error',
    }
  }

  return {
    label: t('Unknown'),
    type: 'warning',
  }
}
</script>
