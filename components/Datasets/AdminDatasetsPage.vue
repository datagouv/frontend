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
          {{ t('Datasets') }}
        </a>
      </li>
    </Breadcrumb>
    <h1 class="fr-h3 fr-mb-5v">
      {{ t("Datasets") }}
    </h1>

    <div
      v-if="transfers && transfers.length"
      class="space-y-8 mb-8 max-w-6xl"
    >
      <TransferRequest
        v-for="transfer in transfers"
        :key="transfer.id"
        :transfer
        @done="refreshTransfers(); refreshDatasets()"
      />
    </div>

    <DatasetsMetrics
      v-if="organization && pageData && pageData.total > 0"
      class="mb-8"
      :organization
    />

    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col">
        <h2
          v-if="status === 'success' && pageData.total"
          class="subtitle subtitle--uppercase fr-m-0"
        >
          {{ t('{n} datasets', pageData.total) }}
        </h2>
      </div>
      <div class="fr-col-auto fr-grid-row fr-grid-row--middle space-x-6">
        <div class="fr-col-auto fr-grid-row fr-grid-row--middle space-x-6">
          <!-- <AdminInput
            v-model="q"
            :icon="RiSearchLine"
            :placeholder="$t('Search')"
          /> -->
        </div>
        <div v-if="status === 'success' && organization && pageData.total">
          <a
            :href="`/organizations/${organization.id}/datasets.csv`"
            class="fr-btn fr-btn--sm fr-icon-download-line fr-btn--icon-left"
          >
            {{ t('Download catalog') }}
          </a>
        </div>
      </div>
    </div>
    <AdminDatasetsTable
      v-if="pageData && pageData.total > 0"
      :datasets="pageData ? pageData.data : []"
      :loading="status === 'pending'"
      :sort-direction="direction"
      :sorted-by
      @sort="sort"
    />
    <div v-else-if="status === 'idle' || status === 'pending'">
      <AdminLoader class="size-10" />
    </div>
    <div
      v-else
      class="flex flex-col items-center"
    >
      <nuxt-img
        src="/illustrations/dataset.svg"
        class="h-20"
      />
      <p class="fr-text--bold fr-my-3v">
        {{ t(`You haven't published a dataset yet`) }}
      </p>
      <AdminPublishButton type="dataset" />
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
import { Pagination, type Dataset, type Organization, type User } from '@datagouv/components'
import { refDebounced } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// import { RiSearchLine } from '@remixicon/vue'
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
import DatasetsMetrics from './DatasetsMetrics.vue'
import AdminDatasetsTable from '~/components/AdminTable/AdminDatasetsTable/AdminDatasetsTable.vue'
import type { DatasetSortedBy, PaginatedArray, SortDirection, TransferRequest } from '~/types/types'

const props = defineProps<{
  organization?: Organization | null
  user?: User | null
}>()
const { t } = useI18n()
const config = useRuntimeConfig()

const page = ref(1)
const pageSize = ref(10)
const sortedBy = ref<DatasetSortedBy>('created')
const direction = ref<SortDirection>('desc')
const sortDirection = computed(() => `${direction.value === 'asc' ? '' : '-'}${sortedBy.value}`)
const q = ref('')
const qDebounced = refDebounced(q, 500) // TODO add 500 in config

function sort(column: DatasetSortedBy, newDirection: SortDirection) {
  sortedBy.value = column
  direction.value = newDirection
}

const datasetUrl = computed(() => {
  let url
  if (props.organization) {
    url = new URL(`/api/1/organizations/${props.organization.id}/datasets/`, config.public.apiBase)
  }
  else if (props.user) {
    url = new URL(`/api/1/datasets/`, config.public.apiBase)
    url.searchParams.set('owner', props.user.id)
  }
  else {
    url = new URL(`/api/1/datasets/`, config.public.apiBase)
  }

  url.searchParams.set('sort', sortDirection.value)
  url.searchParams.set('q', qDebounced.value)
  url.searchParams.set('page_size', pageSize.value.toString())
  url.searchParams.set('page', page.value.toString())

  return url.toString()
})

const { data: pageData, status, refresh: refreshDatasets } = await useAPI<PaginatedArray<Dataset>>(datasetUrl, { lazy: true })

const transfersUrl = computed(() => {
  const url = new URL(`/api/1/transfer/`, config.public.apiBase)
  url.searchParams.set('subject_type', 'Dataset')
  url.searchParams.set('status', 'pending')
  if (props.organization) {
    url.searchParams.set('recipient', props.organization.id)
  }
  else if (props.user) {
    url.searchParams.set('recipient', props.user.id)
  }
  else {
    return null
  }

  return url.toString()
})
const { data: transfers, refresh: refreshTransfers } = await useAPI<Array<TransferRequest>>(transfersUrl, { lazy: true })
</script>
