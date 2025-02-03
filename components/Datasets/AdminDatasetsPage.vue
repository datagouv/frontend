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

    <TransferRequestList
      v-if="props.organization || props.user"
      type="Dataset"
      :recipient="props.organization || props.user"
      @done="refresh"
    />

    <DatasetsMetrics
      v-if="organization && pageData && pageData.total > 0"
      class="mb-8"
      :organization
    />

    <div
      v-if="pageData"
      class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle"
    >
      <div class="fr-col">
        <h2 class="subtitle subtitle--uppercase fr-m-0">
          {{ t('{n} datasets', pageData.total) }}
        </h2>
      </div>
      <div class="fr-col-auto fr-grid-row fr-grid-row--middle space-x-6">
        <div class="fr-col-auto fr-grid-row fr-grid-row--middle space-x-6">
          <AdminInput
            v-model="q"
            type="search"
            :icon="RiSearchLine"
            :placeholder="$t('Search')"
          />
        </div>
        <div v-if="organization">
          <a
            :href="pageData.total ? `/organizations/${organization.id}/datasets.csv` : undefined"
            class="fr-btn fr-btn--sm fr-icon-download-line fr-btn--icon-left"
          >
            {{ t('Download catalog') }}
          </a>
        </div>
      </div>
    </div>

    <LoadingBlock :status>
      <div v-if="pageData && pageData.total > 0">
        <AdminDatasetsTable
          :datasets="pageData ? pageData.data : []"
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
      v-if="status != 'pending' && pageData && !pageData.total"
      class="flex flex-col items-center"
    >
      <nuxt-img
        src="/illustrations/dataset.svg"
        class="h-20"
      />
      <template v-if="q">
        <p class="fr-text--bold fr-my-3v">
          {{ t(`No results for "{q}"`, { q }) }}
        </p>
        <BrandedButton
          color="primary"
          @click="q = qDebounced = ''"
        >
          {{ $t('Reset filters') }}
        </BrandedButton>
      </template>
      <template v-else>
        <p class="fr-text--bold fr-my-3v">
          {{ t(`You haven't published a dataset yet`) }}
        </p>
        <AdminPublishButton type="dataset" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pagination, type Dataset, type Organization, type User } from '@datagouv/components'
import { refDebounced } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiSearchLine } from '@remixicon/vue'
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
import TransferRequestList from '../TransferRequestList.vue'
import DatasetsMetrics from './DatasetsMetrics.vue'
import AdminDatasetsTable from '~/components/AdminTable/AdminDatasetsTable/AdminDatasetsTable.vue'
import type { DatasetSortedBy, PaginatedArray, SortDirection } from '~/types/types'

const props = defineProps<{
  organization?: Organization | null
  user?: User | null
}>()
const { t } = useI18n()

const page = ref(1)
const pageSize = ref(20)
const sortedBy = ref<DatasetSortedBy>('created')
const direction = ref<SortDirection>('desc')
const sortDirection = computed(() => `${direction.value === 'asc' ? '' : '-'}${sortedBy.value}`)
const q = ref('')
const qDebounced = refDebounced(q, 500) // TODO add 500 in config

function sort(column: DatasetSortedBy, newDirection: SortDirection) {
  sortedBy.value = column
  direction.value = newDirection
}

const params = computed(() => {
  return {
    organization: props.organization?.id,
    owner: props.user?.id,

    sort: sortDirection.value,
    q: qDebounced.value,
    page_size: pageSize.value,
    page: page.value,
  }
})

const { data: pageData, status, refresh } = await useAPI<PaginatedArray<Dataset>>('/api/1/datasets/', { lazy: true, query: params })
</script>
