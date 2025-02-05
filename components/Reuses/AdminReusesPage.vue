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
          {{ t('Reuses') }}
        </a>
      </li>
    </Breadcrumb>
    <h1 class="fr-h3 fr-mb-5v">
      {{ t("Reuses") }}
    </h1>
    <TransferRequestList
      v-if="props.organization || props.user"
      type="Reuse"
      :recipient="props.organization || props.user"
      @done="refresh"
    />
    <div
      v-if="pageData"
      class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle"
    >
      <div class="fr-col">
        <h2 class="subtitle subtitle--uppercase fr-m-0">
          {{ t('{n} reuses', pageData.total) }}
        </h2>
      </div>
      <div class="fr-col-auto fr-grid-row fr-grid-row--middle space-x-6">
        <AdminInput
          v-model="q"
          type="search"
          :icon="RiSearchLine"
          :placeholder="$t('Search')"
        />
      </div>
    </div>

    <LoadingBlock :status>
      <div v-if="pageData && pageData.total > 0">
        <AdminReusesTable
          :reuses="pageData ? pageData.data : []"
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
        src="/illustrations/reuse.svg"
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
          {{ t(`You haven't published a reuse yet`) }}
        </p>
        <AdminPublishButton type="reuse" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pagination, type Organization, type Reuse, type User } from '@datagouv/components'
import { refDebounced } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// import { RiSearchLine } from '@remixicon/vue'
import { RiSearchLine } from '@remixicon/vue'
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
import AdminReusesTable from '../AdminTable/AdminReusesTable/AdminReusesTable.vue'
import BrandedButton from '../BrandedButton/BrandedButton.vue'
import type { PaginatedArray, ReuseSortedBy, SortDirection } from '~/types/types'

const { t } = useI18n()

const props = defineProps<{
  organization?: Organization | null
  user?: User | null
}>()

const page = ref(1)
const pageSize = ref(20)
const sortedBy = ref<ReuseSortedBy>('created')
const direction = ref<SortDirection>('desc')
const sortDirection = computed(() => `${direction.value === 'asc' ? '' : '-'}${sortedBy.value}`)
const q = ref('')
const qDebounced = refDebounced(q, 500) // TODO add 500 in config

function sort(column: ReuseSortedBy, newDirection: SortDirection) {
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

const { data: pageData, status, refresh } = await useAPI<PaginatedArray<Reuse>>('/api/1/reuses/', { lazy: true, query: params })
</script>
