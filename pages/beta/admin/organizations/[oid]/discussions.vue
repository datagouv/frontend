<template>
  <div>
    <AdminBreadcrumb>
      <BreadcrumbItem>{{ t('Discussions') }}</BreadcrumbItem>
    </AdminBreadcrumb>

    <h1 class="fr-h3 fr-mb-5v">
      {{ t("Discussions") }}
    </h1>
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col">
        <h2
          v-if="status === 'success' && pageData.total"
          class="subtitle subtitle--uppercase fr-m-0"
        >
          {{ t('{n} discussions', pageData.total) }}
        </h2>
      </div>
      <div class="fr-col-auto fr-grid-row fr-grid-row--middle">
        <!-- Buttons -->
      </div>
    </div>

    <LoadingBlock :status>
      <div v-if="pageData && pageData.total > 0">
        <AdminDiscussionsTable
          :discussions="pageData ? pageData.data : []"
          :sort-direction="direction"
          :sorted-by
          @sort="sort"
        />
        <Pagination
          :page="page"
          :page-size="pageSize"
          :total-results="pageData.total"
          @change="(changedPage: number) => page = changedPage"
        />
      </div>
    </LoadingBlock>

    <div
      v-if="pageData && !pageData.total"
      class="flex flex-col items-center"
    >
      <nuxt-img
        src="/illustrations/discussion.svg"
        class="h-20"
      />
      <p class="fr-text--bold fr-my-3v">
        {{ t(`There is no discussion yet`) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pagination } from '@datagouv/components'
import { refDebounced } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DiscussionSortedBy, Thread } from '~/types/discussions'
import type { PaginatedArray, SortDirection } from '~/types/types'
import AdminDiscussionsTable from '~/components/AdminTable/AdminDiscussionsTable/AdminDiscussionsTable.vue'
import AdminBreadcrumb from '~/components/Breadcrumbs/AdminBreadcrumb.vue'
import BreadcrumbItem from '~/components/Breadcrumbs/BreadcrumbItem.vue'

const { t } = useI18n()
const config = useRuntimeConfig()

const page = ref(1)
const pageSize = ref(20)
const sortedBy = ref<DiscussionSortedBy>('created')
const direction = ref<SortDirection>('desc')
const sortDirection = computed(() => `${direction.value === 'asc' ? '' : '-'}${sortedBy.value}`)
const q = ref('')
const qDebounced = refDebounced(q, 500) // TODO add 500 in config

const { currentOrganization } = useOrganizations()

function sort(column: DiscussionSortedBy, newDirection: SortDirection) {
  sortedBy.value = column
  direction.value = newDirection
}

const url = computed(() => {
  const url = new URL(`/api/1/discussions/`, config.public.apiBase)
  if (!currentOrganization.value) {
    throw 'Cannot load this component outside organization URL.'
  }

  url.searchParams.set('org', currentOrganization.value.id)
  url.searchParams.set('sort', sortDirection.value)
  url.searchParams.set('q', qDebounced.value)
  url.searchParams.set('page_size', pageSize.value.toString())
  url.searchParams.set('page', page.value.toString())

  return url.toString()
})

const { data: pageData, status } = await useAPI<PaginatedArray<Thread>>(url, { lazy: true })
</script>
