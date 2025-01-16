<template>
  <AdminTable>
    <thead>
      <AdminTableTh
        :sorted="sorted('title')"
        scope="col"
        @sort="(direction: SortDirection) => $emit('sort', 'title', direction)"
      >
        {{ t("Resource title") }}
      </AdminTableTh>
      <AdminTableTh class="w-44">
        {{ t("Status") }}
      </AdminTableTh>
      <AdminTableTh class="w-14">
        {{ t("Format") }}
      </AdminTableTh>
      <AdminTableTh
        class="w-32"
        :sorted="sorted('created_at_internal')"
        scope="col"
        @sort="(direction: SortDirection) => $emit('sort', 'created_at_internal', direction)"
      >
        {{ t("Created at") }}
      </AdminTableTh>
      <AdminTableTh
        class="w-32"
        :sorted="sorted('last_modified_internal')"
        scope="col"
        @sort="(direction: SortDirection) => $emit('sort', 'last_modified_internal', direction)"
      >
        {{ t("Modified at") }}
      </AdminTableTh>
    </thead>
    <tbody>
      <tr v-for="communityResource in communityResources">
        <td>
          <AdminContentWithTooltip class="fr-text--bold">
            <a
              class="fr-link fr-reset-link"
              :href="getCommunityResourceLinkToAdmin(communityResource)"
            >
              <TextClamp
                :text="communityResource.title"
                :auto-resize="true"
                :max-lines="2"
              />
            </a>
          </AdminContentWithTooltip>
          <p v-if="communityResource.dataset">
            <LinkToSubject
              type="Dataset"
              :subject="communityResource.dataset"
            />
          </p>
        </td>
        <td>
          <AdminBadge
            size="xs"
            :type="getStatus(communityResource).type"
          >
            {{ getStatus(communityResource).label }}
          </AdminBadge>
        </td>
        <td>
          <code class="fr-p-1v font-mono bg-grey-100 fr-text--sm text-mention-grey rounded">{{ communityResource.format }}</code>
        </td>
        <td>{{ formatDate(communityResource.created_at) }}</td>
        <td>{{ formatDate(communityResource.last_modified) }}</td>
      </tr>
    </tbody>
  </AdminTable>
</template>

<script setup lang="ts">
import { formatDate } from '@datagouv/components'
import type { CommunityResource } from '@datagouv/components'
import { useI18n } from 'vue-i18n'
import AdminBadge from '../../../components/AdminBadge/AdminBadge.vue'
import AdminTable from '../../../components/AdminTable/Table/AdminTable.vue'
import AdminTableTh from '../../../components/AdminTable/Table/AdminTableTh.vue'
import AdminContentWithTooltip from '../../../components/AdminContentWithTooltip/AdminContentWithTooltip.vue'
import type { AdminBadgeType, CommunityResourceSortedBy, SortDirection } from '~/types/types'

const props = defineProps<{
  communityResources: Array<CommunityResource>
  sortedBy: CommunityResourceSortedBy
  sortDirection: SortDirection
}>()

defineEmits<{
  (event: 'sort', column: CommunityResourceSortedBy, direction: SortDirection): void
}>()

const config = useRuntimeConfig()
const { t } = useI18n()

function sorted(column: CommunityResourceSortedBy) {
  if (props.sortedBy === column) {
    return props.sortDirection
  }
  return null
}

function getCommunityResourceLinkToAdmin(communityResource: CommunityResource) {
  return `${config.public.apiBase}/en/admin/dataset/${communityResource.dataset.id}/community-resource/${communityResource.id}/`
}

function getStatus(communityResource: CommunityResource): { label: string, type: AdminBadgeType } {
  const checked = communityResource.extras && 'check:available' in communityResource.extras
  if (checked && communityResource.extras['check:available'] === false) {
    return {
      label: t('Unavailable'),
      type: 'danger',
    }
  }
  else if (checked) {
    return {
      label: t('Available'),
      type: 'primary',
    }
  }
  else {
    return {
      label: t('Not checked yet'),
      type: 'secondary',
    }
  }
}
</script>
