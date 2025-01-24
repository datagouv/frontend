<template>
  <div class="container mb-16">
    <Breadcrumb>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          :external="true"
          to="/"
        >
          {{ $t('Home') }}
        </NuxtLinkLocale>
      </li>
      <li>
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ $t('Organizations') }}
        </a>
      </li>
    </Breadcrumb>
    <h1 class="!mb-2">
      {{ $t('Organizations') }}
    </h1>
    <label
      :for="inputId"
      class="block mb-3"
    >
      {{ $t('Search among {count} organizations on {site}', {
        count: organizations.total,
        site: config.public.title,
      }) }}
    </label>
    <div class="w-full flex mb-5">
      <input
        :id="inputId"
        class="flex-1 px-4 py-2 bg-gray-lower rounded-tl shadow-input"
        type="search"
        :placeholder="$t('Search...')"
      >
      <BrandedButton
        class="!rounded-none !rounded-tr"
        :icon="RiSearch2Line"
        size="lg"
      >
        {{ $t('Search') }}
      </BrandedButton>
    </div>
    <div class="flex justify-between items-center mb-6">
      <p class="mb-0">
        {{ $t('{count} results', { count: organizations.total }) }}
      </p>
      <div class="flex items-center gap-1">
        <label :for="selectId" class="flex-none text-sm">{{ $t('Sort by:') }}</label>
        <select :id="selectId" v-model="sort" class="fr-select !shadow-input">
          <option value="">
            Relevance
          </option>
          <option value="-created">
            Newest
          </option>
          <option value="created">
            Oldest
          </option>
          <option value="-followers">
            Followers
          </option>
          <option value="-reuses">
            Reuses
          </option>
        </select>
      </div>
    </div>
    <LoadingBlock :status>
      <div class="grid gap-2 grid-cols-2 mb-16">
        <OrganizationCard
          v-for="organization in organizations.data"
          :key="organization.id"
          class="col-span-1"
          :organization
        />
      </div>
    </LoadingBlock>
    <Pagination
      :page
      :page-size="pageSize"
      :total-results="organizations.total"
      @change="p => page = p"
    />
  </div>
</template>

<script setup lang="ts">
import { Pagination, type Organization } from '@datagouv/components'
import { RiSearch2Line } from '@remixicon/vue'
import { debouncedRef } from '@vueuse/core'
import type { LocationQueryValue } from 'vue-router'
import Breadcrumb from '~/components/Breadcrumb/Breadcrumb.vue'
import type { PaginatedArray } from '~/types/types'

const config = useRuntimeConfig()
const route = useRoute()
const page = ref(parseInt(route.query.page as LocationQueryValue ?? "1", 10))
const pageSize = 20
const q = ref()
const sort = ref("")
const sortParam = computed(() => sort.value? sort.value : undefined)
const inputId = useId()
const selectId = useId()
const qDebounced = debouncedRef(q, config.public.searchAutocompleteDebounce)

watch([page, sort, qDebounced], async ([_newPage, newSort, newQ], [_oldPage, oldSort, oldQ]) => {
  if (newQ !== oldQ) {
    page.value = 1
    sort.value = ""
  }
  if (newSort !== oldSort) {
    page.value = 1
  }
  await navigateTo({
    ...route,
    query: {
      ...route.query,
      q: qDebounced.value,
      page: page.value,
      sort: sortParam.value,
    },
  })
  document.children[0].scrollIntoView({ behavior: 'smooth', block: 'start' })
})

const { data: organizations, status } = await useAPI<PaginatedArray<Organization>>(`/api/1/organizations/`, { params:
  {
    q: qDebounced,
    page,
    page_size: pageSize,
    sort: sortParam,
  },
})
</script>
