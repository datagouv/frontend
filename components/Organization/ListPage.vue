<template>
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
      v-model.trim="q"
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
      <label
        :for="selectId"
        class="flex-none text-sm"
      >{{ $t('Sort by:') }}</label>
      <select
        :id="selectId"
        v-model="sort"
        class="fr-select !shadow-input"
      >
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
    :page="organizations.page"
    :page-size="organizations.page_size"
    :total-results="organizations.total"
    @change="(p: number) => $emit('change', q, sortParam, p)"
  />
</template>

<script setup lang="ts">
import { Pagination, type Organization } from '@datagouv/components'
import { RiSearch2Line } from '@remixicon/vue'
import { debouncedRef } from '@vueuse/core'
import type { PaginatedArray, RequestStatus } from '~/types/types'

defineProps<{
  /**
   * List of organizations to show
   */
  organizations: PaginatedArray<Organization>

  /**
   * The API request status
   */
  status: RequestStatus
}>()

const emit = defineEmits<{
  change: [q: string, sort: string | undefined, page: number]
}>()

const config = useRuntimeConfig()

const inputId = useId()
const selectId = useId()

const q = ref()

const qDebounced = debouncedRef(q, config.public.searchAutocompleteDebounce)
const sort = ref('')
const sortParam = computed(() => sort.value ? sort.value : undefined)

watch([sort, qDebounced], async ([_newSort, newQ], [_oldSort, oldQ]) => {
  if (newQ !== oldQ) {
    sort.value = ''
  }

  emit('change', newQ, sortParam.value, 1)

  document.children[0].scrollIntoView({ behavior: 'smooth', block: 'start' })
})
</script>
