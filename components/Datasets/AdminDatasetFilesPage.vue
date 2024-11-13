<template>
  <div class="bg-white fr-p-3w">
    <AdminTable :loading>
      <thead>
        <tr>
          <AdminTableTh
            :sorted="sorted('title')"
            scope="col"
            @sort="(direction: SortDirection) => updateSort('title', direction)"
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
            :sorted="sorted('created')"
            scope="col"
            @sort="(direction: SortDirection) => updateSort('created', direction)"
          >
            {{ t('Created at') }}
          </AdminTableTh>
          <AdminTableTh
            :sorted="sorted('last_update')"
            scope="col"
            @sort="(direction: SortDirection) => updateSort('last_update', direction)"
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
              <NuxtLinkLocale
                class="fr-link fr-reset-link"
                to=""
              >
                <TextClamp
                  :text="resource.title"
                  :auto-resize="true"
                  :max-lines="2"
                />
              </NuxtLinkLocale>
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
  </div>
</template>

<script setup lang="ts">
import { formatDate, type DatasetV2, type Resource } from '@datagouv/components'
import { useI18n } from 'vue-i18n'
import AdminTable from '../AdminTable/Table/AdminTable.vue'
import AdminTableTh from '../AdminTable/Table/AdminTableTh.vue'
import type { AdminBadgeState, DatasetSortedBy, PaginatedArray, SortDirection } from '~/types/types'

const emit = defineEmits<{
  (event: 'sort', column: DatasetSortedBy, direction: SortDirection): void
}>()

const route = useRoute()

const { $api } = useNuxtApp()

const url = computed(() => `/api/2/datasets/${route.params.id}`)
const { data: dataset } = await useAPI<DatasetV2>(url, { lazy: true })
const resourcesPage = ref<PaginatedArray<Resource> | null>(null)
watchEffect(async () => {
  if (!dataset.value) return
  resourcesPage.value = await $api<PaginatedArray<Resource>>(dataset.value.resources.href)
})

const loading = ref(false)

const sortedBy = ref<DatasetSortedBy>('created')
const direction = ref<SortDirection>('desc')
const sortDirection = computed(() => `${direction.value === 'asc' ? '' : '-'}${sortedBy.value}`)

const { t } = useI18n()

function updateSort(column: DatasetSortedBy, direction: SortDirection) {
  emit('sort', column, direction)
}

function sorted(column: DatasetSortedBy) {
  if (sortedBy.value === column) {
    return sortDirection.value
  }
  return null
}

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
