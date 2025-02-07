<template>
  <form
    class="pt-3 group/form"
    data-input-color="blue"
    @submit.prevent="search"
  >
    <div
      ref="searchRef"
      class="flex flex-wrap items-center justify-between"
      data-cy="search"
    >
      <SearchInput
        v-model="queryString"
        :placeholder="t('Ex. 2022 presidential election')"
      />
    </div>
    <div class="grid grid-cols-12 mt-2 md:mt-5">
      <div class="col-span-12 md:col-span-4 lg:col-span-3">
        <nav
          class="fr-sidemenu"
          aria-labelledby="fr-sidemenu-title"
        >
          <div class="fr-sidemenu__inner">
            <button
              class="fr-sidemenu__btn mt-2"
              hidden
              aria-controls="fr-sidemenu-wrapper"
              aria-expanded="false"
            >
              {{ t('Filter results') }}
            </button>
            <div
              id="fr-sidemenu-wrapper"
              class="fr-collapse"
            >
              <div
                id="fr-sidemenu-title"
                class="fr-sidemenu__title mb-3"
              >
                {{ t('Filters') }}
              </div>
              <div class="space-y-4">
                <div v-if="!organization">
                  <SearchOrganizationFacet
                    :v-model="facets.organization"
                  />
                </div>
                <!--   <MultiSelect
                    :initial-options="organizationTypesPromise"
                    :placeholder="t('Organization type')"
                    :search-placeholder="t('Search an organization type...')"
                    :all-option="t('All types')"
                    :values="facets.organization_badge"
                    :is-blue="true"
                    @change="(value: string) => handleFacetChange('organization_badge', value)"
                  />
                </div>
                <div>
                  <MultiSelect
                    :placeholder="t('Tags')"
                    :search-placeholder="t('Search a tag...')"
                    :all-option="t('All tags')"
                    suggest-url="/tags/suggest/"
                    :values="facets.tag"
                    :minimum-character-before-suggest="2"
                    :is-blue="true"
                    @change="(value: string) => handleFacetChange('tag', value)"
                  />
                </div>
                <div>
                  <MultiSelect
                    :placeholder="t('Formats')"
                    :search-placeholder="t('Search a format...')"
                    :all-option="t('All formats')"
                    :list-url="allowedExtensionsUrl"
                    :values="facets.format"
                    :is-blue="true"
                    @change="(value: string) => handleFacetChange('format', value)"
                  />
                </div>
                <div>
                  <MultiSelect
                    :placeholder="t('Licenses')"
                    :explanation="t('Licenses define reuse rules for published datasets. See page data.gouv.fr/licences')"
                    :search-placeholder="t('Search a license...')"
                    :all-option="t('All licenses')"
                    :list-url="licensesUrl"
                    :values="facets.license"
                    :is-blue="true"
                    @change="(value: string) => handleFacetChange('license', value)"
                  />
                </div>
                <div>
                  <SchemaSelect
                    :values="facets.schema || ''"
                    :is-blue="true"
                    @change="(value: string) => handleFacetChange('schema', value)"
                  />
                </div>
                <div>
                  <MultiSelect
                    :placeholder="t('Spatial coverage')"
                    :explanation="t('Geographic areas covered by data and for which they are relevant.')"
                    :search-placeholder="t('Search a spatial coverage...')"
                    :all-option="t('All coverages')"
                    suggest-url="/spatial/zones/suggest/"
                    entity-url="/spatial/zone/"
                    :values="facets.geozone"
                    :is-blue="true"
                    @change="(value: string) => handleFacetChange('geozone', value)"
                  />
                </div>
                <div>
                  <MultiSelect
                    :placeholder="t('Spatial granularity')"
                    :explanation="t('Finest level of geographic detail covered by data.')"
                    :search-placeholder="t('Search a granularity...')"
                    :all-option="t('All granularities')"
                    list-url="/spatial/granularities/"
                    :values="facets.granularity"
                    :is-blue="true"
                    @change="(value: string) => handleFacetChange('granularity', value)"
                  />
                </div> -->
                <div
                  v-if="isFiltered || downloadLink"
                  class="mb-6 text-center"
                >
                  <BrandedButton
                    v-if="isFiltered"
                    color="primary-soft"
                    :icon="RiCloseCircleLine"
                    class="w-full"
                    @click="resetFilters"
                  >
                    {{ t('Reset filters') }}
                  </BrandedButton>
                  <BrandedButton
                    v-else-if="downloadLink"
                    :icon="RiDownloadLine"
                    color="secondary"
                    class="w-full"
                    :href="downloadLink"
                  >
                    {{ t('Download list as CSV') }}
                  </BrandedButton>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <section
        ref="resultsRef"
        class="col-span-12 md:col-span-8 lg:col-span-9 mt-4 md:mt-0 search-results"
        v-bind="$attrs"
      >
        <div
          v-if="data?.total"
          class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle justify-between pb-2"
        >
          <p
            class="fr-col-auto my-0"
            role="status"
          >
            {{ t("{count} results", data.total) }}
          </p>
          <div class="fr-col-auto fr-grid-row fr-grid-row--middle">
            <label
              for="sort-search"
              class="fr-col-auto text-sm m-0 mr-2"
            >
              {{ t('Sort by:') }}
            </label>
            <div class="fr-col">
              <select
                id="sort-search"
                v-model="searchSort"
                class="fr-select fr-select--blue"
                name="sort"
                @change="handleSortChange"
              >
                <option value="">
                  {{ t('Relevance') }}
                </option>
                <option
                  v-for="{ value, label } in sortOptions"
                  :key="label"
                  :value="value"
                >
                  {{ label }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <transition mode="out-in">
          <div v-if="loading">
            <!-- <Loader /> -->
          </div>
          <div v-else-if="data?.data.length">
            <ul class="mt-2 border-t border-gray-default relative z-2 list-none">
              <li
                v-for="result in data.data"
                :key="result.id"
                class="p-0"
              >
                <DatasetCardLg :dataset="result" />
              </li>
            </ul>
            <Pagination
              v-if="data && data.total > pageSize"
              :page="currentPage"
              :page-size="pageSize"
              :total-results="data.total"
              class="mt-4"
              :link="getLink"
              @change="changePage"
            />
            <SearchNoResults
              v-else-if="!organization"
              @reset-filters="resetForm"
            />
          </div>
          <div
            v-else-if="!organization"
            class="mt-4"
          >
            <SearchNoResults @reset-filters="resetForm" />
          </div>
        </transition>
      </section>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { DatasetV2 } from '@datagouv/components'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import { RiCloseCircleLine, RiDownloadLine } from '@remixicon/vue'
// import Loader from '../../dataset/loader.vue'
// import SchemaSelect from '../../SchemaSelect/SchemaSelect.vue'
// import MultiSelect from '../../MultiSelect/MultiSelect.vue'
// import { getLicensesUrl } from '../../../api/licenses'
// import { getAllowedExtensionsUrl } from '../../../api/resources'
import SearchInput from '~/components/Search/SearchInput.vue'
import type { PaginatedArray } from '~/types/types'

const props = withDefaults(defineProps<{
  downloadLink?: string
  organization?: string
  sorts?: Array<{ label: string, order: string, value: string }>
}>(), {
  downloadLink: '',
  organization: '',
  sorts: () => ([]),
})

type Facets = {
  organization?: string
  organization_badge?: string
  tag?: string
  license?: string
  format?: string
  geozone?: string
  granularity?: string
  schema?: string
}

const { t } = useI18n()
// const { toast } = useToast()
const config = useRuntimeConfig()
/**
 * Update search params from URL on page load for deep linking
 */
const url = useRequestURL()
const params = new URLSearchParams(url.search)

// const allowedExtensionsUrl = getAllowedExtensionsUrl()
// const licensesUrl = getLicensesUrl()
// const organizationTypes: Array<MultiSelectOption> = getOrganizationTypes()
//   .filter(type => type.type !== OTHER && type.type !== USER)
//   .map(type => ({
//     label: type.label,
//     value: type.type,
//   }))
// const organizationTypesPromise = Promise.resolve(organizationTypes)
/**
 * Search query
 */
const queryString = ref('')

/**
 * Reuse url of the query
 */
// const { reuseUrl } = useSearchUrl(queryString)

/**
 * Query sort
 */
const searchSort = ref('')

/**
 * Current page of results
 */
const currentPage = ref(1)

/**
 * Search page size
 */
const pageSize = 20

/**
 * All other params are kept here as facets
 */
const facets = ref<Facets>({ organization: props.organization })

/**
 * Current request if any to be cancelled if a new one comes
 */
// const currentRequest = ref<CancelTokenSource | null>(null)

/**
 * Vue ref to results HTML
 */
const resultsRef = ref<HTMLElement | null>(null)

/**
 * Vue ref to results HTML
 */
const searchRef = ref<HTMLElement | null>(null)

const SAVE_TO_HISTORY = true

// const updateUrl = (save = SAVE_TO_HISTORY) => {
//   // Update URL to match current search params value for deep linking
//   const url = new URL(window.location.href)
//   const urlParams = { ...searchParameters.value }
//   if (props.organization) {
//     delete urlParams.organization
//     delete urlParams.organization_badge
//   }
//   url.search = new URLSearchParams(urlParams).toString()
//   if (save) {
//     window.history.pushState(null, '', url)
//   }
//   const linksWithQuery = document.querySelectorAll('[data-q]') as NodeListOf<HTMLAnchorElement>
//   for (const link of linksWithQuery) {
//     link.href = reuseUrl.value
//   }
// }

/**
 * Search new dataset results
 */
const search = useDebounceFn((_saveToHistory = SAVE_TO_HISTORY) => {
  // TODO : handle cancel request and debounce
  // if (currentRequest.value) currentRequest.value.cancel()
  // currentRequest.value = generateCancelToken()
  // updateUrl(saveToHistory)
  // toast.error(t('Error getting search results.'))
}, config.public.searchAutocompleteDebounce)

/**
 * Called when user type in search field
 */
watch(queryString, () => {
  currentPage.value = 1
})

/**
 * Called on every facet selector change, updates the `facets.xxx` object then searches with new values
 */
// const handleFacetChange = (facet: keyof Facets, values: string) => {
//   if (values) {
//     facets.value[facet] = values
//   }
//   else {
//     facets.value[facet] = undefined
//   }
//   if (props.organization) {
//     facets.value.organization = props.organization
//     facets.value.organization_badge = undefined
//   }
//   currentPage.value = 1
// }

/**
 * Called when user change sort
 */
const handleSortChange = () => {
  currentPage.value = 1
}

/**
 * Change current page
 */
const changePage = (page: number) => {
  currentPage.value = page
  scrollToTop()
}

const scrollToTop = () => {
  if (searchRef.value) {
    searchRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const reloadFilters = ({ page = 1, sort = '', ...params }) => {
  facets.value = { ...params, organization: props.organization || params.organization }
  currentPage.value = page
  searchSort.value = sort
}

const resetFilters = () => {
  reloadFilters({})
}

const resetForm = () => {
  reloadForm()
  scrollToTop()
}

const reloadForm = ({ q = '', ...params } = {}) => {
  queryString.value = q
  reloadFilters(params)
}

/**
 * Is any filter active ?
 * We don't count scoped search as being filtered
 */
const isFiltered = computed(() => {
  const keys = Object.keys(facets.value) as Array<keyof Facets>
  return keys.some(
    key => facets.value[key]?.length && (props.organization ? key !== 'organization' : true),
  )
})

const sortOptions = computed(() => props.sorts.map(sort => ({
  value: sort.order == 'asc' ? sort.value : '-' + sort.value,
  label: sort.label,
})))

const searchParameters = computed(() => {
  const params: Record<string, string | number> = {
    page_size: pageSize,
  }
  let key: keyof Facets
  for (key in facets.value) {
    const facet = facets.value[key]
    if (facet) {
      params[key] = facet
    }
  }
  if (currentPage.value > 1) params.page = currentPage.value.toString()
  if (queryString.value) params.q = queryString.value
  if (searchSort.value) params.sort = searchSort.value
  return params
})

const q = params.get('q')
if (q) {
  queryString.value = q
  params.delete('q')
}
const page = params.get('page')
if (page) {
  currentPage.value = parseInt(page)
  params.delete('page')
}
const sort = params.get('sort')
if (sort) {
  searchSort.value = sort
  params.delete('sort')
}

facets.value = { ...Object.fromEntries(params), organization: props.organization || params.get('organization') || '' }

const { data, status } = await useAPI<PaginatedArray<DatasetV2>>('/api/2/datasets/search/', {
  params: searchParameters,
})

const loading = computed(() => status.value === 'pending')

onMounted(() => {
  addEventListener('popstate', () => {
    // Update URL to match current search params value for deep linking
    const url = new URL(window.location.href)
    const params: Record<string, string> = {}
    for (const [key, value] of url.searchParams) {
      params[key] = value
    }
    reloadForm(params)
  })
})
</script>
