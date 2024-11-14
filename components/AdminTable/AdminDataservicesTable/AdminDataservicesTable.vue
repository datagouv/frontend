<template>
  <AdminTable :loading>
    <thead>
      <tr>
        <AdminTableTh
          :sorted="sorted('title')"
          scope="col"
          @sort="(direction: SortDirection) => $emit('sort', 'title', direction)"
        >
          {{ t("Dataservice title") }}
        </AdminTableTh>
        <AdminTableTh>
          {{ t("Status") }}
        </AdminTableTh>
        <AdminTableTh>
          {{ t("Access") }}
        </AdminTableTh>
        <AdminTableTh>
          {{ t("Created at") }}
        </AdminTableTh>
        <AdminTableTh>
          {{ t("Rate Limiting") }}
        </AdminTableTh>
        <AdminTableTh>
          {{ t("Availability") }}
        </AdminTableTh>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="dataservice in dataservices"
        :key="dataservice.id"
      >
        <td>
          <AdminContentWithTooltip>
            <NuxtLinkLocale
              class="fr-link fr-reset-link"
              :to="getDataserviceAdminUrl(dataservice)"
            >
              <TextClampClient
                :text="dataservice.title"
                :auto-resize="true"
                :max-lines="2"
              />
            </NuxtLinkLocale>
          </AdminContentWithTooltip>
        </td>
        <td>
          <AdminBadge :type="getStatus(dataservice).type">
            {{ getStatus(dataservice).label }}
          </AdminBadge>
        </td>
        <td>
          <AdminBadge :type="getAccess(dataservice).type">
            {{ getAccess(dataservice).label }}
          </AdminBadge>
        </td>
        <td>{{ formatDate(dataservice.created_at) }}</td>
        <td>{{ dataservice.rate_limiting }}</td>
        <td><span v-if="dataservice.availability">{{ dataservice.availability }}%</span></td>
      </tr>
    </tbody>
  </AdminTable>
</template>

<script setup lang="ts">
import { formatDate } from '@datagouv/components'
import type { Dataservice } from '@datagouv/components'
import { useI18n } from 'vue-i18n'
import AdminBadge from '../../../components/AdminBadge/AdminBadge.vue'
import AdminTable from '../../../components/AdminTable/Table/AdminTable.vue'
import AdminTableTh from '../../../components/AdminTable/Table/AdminTableTh.vue'
import AdminContentWithTooltip from '../../../components/AdminContentWithTooltip/AdminContentWithTooltip.vue'
import type { AdminBadgeState, DataserviceSortedBy, SortDirection } from '~/types/types'

const props = defineProps<{
  dataservices: Array<Dataservice>
  loading: boolean
  sortedBy: DataserviceSortedBy
  sortDirection: SortDirection
}>()

defineEmits<{
  (event: 'sort', column: DataserviceSortedBy, direction: SortDirection): void
}>()

const { t } = useI18n()
const config = useRuntimeConfig()

function sorted(column: DataserviceSortedBy) {
  if (props.sortedBy === column) {
    return props.sortDirection
  }
  return null
}

function getStatus(dataservice: Dataservice): { label: string, type: AdminBadgeState } {
  if (dataservice.private) {
    return {
      label: t('Private'),
      type: 'default',
    }
  }
  else {
    return {
      label: t('Public'),
      type: 'info',
    }
  }
}

function getAccess(dataservice: Dataservice): { label: string, type: AdminBadgeState } {
  if (dataservice.is_restricted) {
    return {
      label: t('Restricted'),
      type: 'warning',
    }
  }
  else {
    return {
      label: t('Open'),
      type: 'success',
    }
  }
}
</script>
