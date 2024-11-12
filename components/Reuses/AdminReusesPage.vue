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
      <li v-if="currentOrganization">
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          :to="`beta/admin/organizations/${currentOrganization.id}/profile`"
        >
          {{ currentOrganization.name }}
        </NuxtLinkLocale>
      </li>
      <li>
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ t('Reuses') }}
        </a>
      </li>
    </Breadcrumb>
    <h1 class="fr-h3 fr-mb-5v">
      {{ t("Reuses") }}
    </h1>
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col">
        <h2
          v-if="status === 'success' && pageData.total"
          class="subtitle subtitle--uppercase fr-m-0"
        >
          {{ t('{n} reuses', pageData.total) }}
        </h2>
      </div>
      <div class="fr-col-auto fr-grid-row fr-grid-row--middle">
        <!-- Buttons -->
      </div>
    </div>
    <AdminReusesTable
      v-if="status === 'pending' || (status === 'success' && pageData.total > 0)"
      :reuses="status === 'success' ? pageData.data : []"
      :loading="status === 'pending'"
      :sort-direction="direction"
      :sorted-by
      @sort="sort"
    />
    <div
      v-else
      class="flex flex-col items-center"
    >
      <nuxt-img
        src="/illustrations/reuse.svg"
        class="h-20"
      />
      <p class="fr-text--bold fr-my-3v">
        {{ t(`You haven't published a reuse yet`) }}
      </p>
      <AdminPublishButton type="reuse" />
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
import { Pagination, type Reuse } from '@datagouv/components'
import { refDebounced } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
import AdminReusesTable from '../AdminTable/AdminReusesTable/AdminReusesTable.vue'
import type { PaginatedArray, ReuseSortedBy, SortDirection } from '~/types/types'

const { t } = useI18n()
const config = useRuntimeConfig()

const page = ref(1)
const pageSize = ref(10)
const sortedBy = ref<ReuseSortedBy>('created')
const direction = ref<SortDirection>('desc')
const sortDirection = computed(() => `${direction.value === 'asc' ? '' : '-'}${sortedBy.value}`)
const q = ref('')
const qDebounced = refDebounced(q, 500) // TODO add 500 in config

const { currentOrganization } = useCurrentOrganization()
const me = useMe()

function sort(column: ReuseSortedBy, newDirection: SortDirection) {
  sortedBy.value = column
  direction.value = newDirection
}

const url = computed(() => {
  const url = new URL(`/api/1/reuses/`, config.public.apiBase)
  if (currentOrganization.value) {
    url.searchParams.set('organization', currentOrganization.value.id)
  }
  else {
    url.searchParams.set('owner', me.value.id)
  }

  url.searchParams.set('sort', sortDirection.value)
  url.searchParams.set('q', qDebounced.value)
  url.searchParams.set('page_size', pageSize.value.toString())
  url.searchParams.set('page', page.value.toString())

  return url.toString()
})

const { data: pageData, status } = await useAPI<PaginatedArray<Reuse>>(url, { lazy: true })
</script>
