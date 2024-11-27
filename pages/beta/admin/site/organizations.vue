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
      <li>
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ t('Organizations') }}
        </a>
      </li>
    </Breadcrumb>
    <h1 class="fr-h3 fr-mb-5v">
      {{ t("Organizations") }}
    </h1>
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col">
        <h2
          v-if="status === 'success' && pageData.total"
          class="subtitle subtitle--uppercase fr-m-0"
        >
          {{ t('{n} organizations', pageData.total) }}
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
            {{ t("Created at") }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Datasets") }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Dataservices") }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Reuses") }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Members") }}
          </AdminTableTh>
        </tr>
      </thead>
      <tbody v-if="pageData">
        <tr
          v-for="organization in pageData.data"
          :key="organization.id"
        >
          <td>
            <div class="flex items-center space-x-2">
              <Placeholder
                type="organization"
                :src="organization.logo_thumbnail"
                :size="20"
              />
              <AdminContentWithTooltip>
                <TextClamp
                  :text="organization.name"
                  :auto-resize="true"
                  :max-lines="2"
                />
              </AdminContentWithTooltip>
            </div>
          </td>
          <td>{{ formatDate(organization.created_at) }}</td>
          <td>{{ organization.metrics.datasets || 0 }}</td>
          <td>{{ organization.metrics.dataservices || 0 }}</td>
          <td>{{ organization.metrics.reuses || 0 }}</td>
          <td>{{ organization.metrics.members || 0 }}</td>
        </tr>
      </tbody>
    </AdminTable>
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
import type { DiscussionSortedBy, PaginatedArray, SortDirection } from '~/types/types'
import Breadcrumb from '~/components/Breadcrumb/Breadcrumb.vue'
import AdminTable from '~/components/AdminTable/Table/AdminTable.vue'
import AdminTableTh from '~/components/AdminTable/Table/AdminTableTh.vue'
import Placeholder from '~/components/Placeholder/Placeholder.vue'

const { t } = useI18n()
const config = useRuntimeConfig()

const page = ref(1)
const pageSize = ref(10)
const sortedBy = ref<DiscussionSortedBy>('created')
const direction = ref<SortDirection>('desc')
const sortDirection = computed(() => `${direction.value === 'asc' ? '' : '-'}${sortedBy.value}`)
const q = ref('')
const qDebounced = refDebounced(q, 500) // TODO add 500 in config

const url = computed(() => {
  const url = new URL(`/api/1/organizations`, config.public.apiBase)

  url.searchParams.set('deleted', 'true')
  url.searchParams.set('sort', sortDirection.value)
  url.searchParams.set('q', qDebounced.value)
  url.searchParams.set('page_size', pageSize.value.toString())
  url.searchParams.set('page', page.value.toString())

  return url.toString()
})

const { data: pageData, status } = await useAPI<PaginatedArray<Organization>>(url, { lazy: true })
</script>
