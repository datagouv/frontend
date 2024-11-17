<template>
    <AdminTable :loading>
      <thead>
        <AdminTableTh
          @sort="(direction: SortDirection) => $emit('sort', 'title', direction)"
          :sorted="sorted('title')"
          scope="col"
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
          {{ t("Rate limiting") }}
        </AdminTableTh>
        <AdminTableTh>
          {{ t("Availability") }}
        </AdminTableTh>
      </thead>
      <tbody>
        <tr v-for="dataservice in dataservices">
          <td>
            <AdminContentWithTooltip>
              <a class="fr-link fr-reset-link" @click="editDataservice(dataservice)">
                <TextClamp :text="dataservice.title" :auto-resize="true" :max-lines="2"/>
              </a>
            </AdminContentWithTooltip>
          </td>
          <td><AdminBadge :type="(getStatus(dataservice)).type">{{ getStatus(dataservice).label }}</AdminBadge></td>
          <td><AdminBadge :type="(getAccess(dataservice)).type">{{ getAccess(dataservice).label }}</AdminBadge></td>
          <td>{{ formatDate(dataservice.created_at) }}</td>
          <td>{{ dataservice.rate_limiting }}</td>
          <td><span v-if="dataservice.availability">{{ dataservice.availability }}%</span></td>
        </tr>
      </tbody>
    </AdminTable>
  </template>
  
<script setup lang="ts">
  import { formatDate } from '@datagouv/components/ts';
  import type { Dataservice } from '@datagouv/components/ts';
  import TextClamp from 'vue3-text-clamp';
  import { useI18n } from 'vue-i18n';
  import AdminBadge from '../AdminBadge/AdminBadge.vue';
  import AdminTable from '../AdminTable/Table/AdminTable.vue';
  import AdminTableTh from '../AdminTable/Table/AdminTableTh.vue';
  import AdminContentWithTooltip from '../AdminContentWithTooltip/AdminContentWithTooltip.vue';
  import type { AdminBadgeState, DataserviceSortedBy, SortDirection } from '~/types/types.d.ts';
  
  const props = defineProps<{
    dataservices: Array<Dataservice>;
    loading: boolean;
    sortedBy: DataserviceSortedBy;
    sortDirection: SortDirection;
  }>();
  
  const emit = defineEmits<{
    (event: 'sort', column: DataserviceSortedBy, direction: SortDirection): void
    (event: 'edit', dataservice: Dataservice): void
  }>();
  
  const { t } = useI18n();
  
  function sorted(column: DataserviceSortedBy) {
    if(props.sortedBy === column) {
      return props.sortDirection;
    }
    return null;
  }
  
  function editDataservice(dataservice: Dataservice){
    emit('edit', dataservice)
  }
  
  function getStatus(dataservice: Dataservice): {label: string, type: AdminBadgeState} {
    if (dataservice.private) {
      return {
        label: t("Draft"),
        type: "default",
      };
    } else {
      return {
        label: t("Public"),
        type: "info"
      };
    }
  }
  
  function getAccess(dataservice: Dataservice): {label: string, type: AdminBadgeState} {
    if (dataservice.is_restricted) {
      return {
        label: t("Restricted"),
        type: "warning",
      };
    } else {
      return {
        label: t("Open"),
        type: "success"
      };
    }
  }
</script>
  