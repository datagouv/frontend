<template>
  <form
    class="group/form"
    data-input-color="blue"
  >
    <div
      ref="search"
      class="flex flex-wrap items-center justify-between"
      data-cy="search"
    >
      <SearchInput
        v-model="queryString"
        :placeholder="organization ? t('Search a dataset of the organization') : t('Ex. 2022 presidential election')"
      />
    </div>
    <div class="grid grid-cols-12 mt-2 md:mt-5">
      <div class="col-span-12 md:col-span-4 lg:col-span-3">
        <Sidemenu :button-text="t('Filters')">
          <template #title>
            {{ t('Filters') }}
          </template>
          <div class="space-y-4">
            <template v-if="!organization">
              <SearchableSelect
                v-model="facets.organization"
                :options="organizations ? organizations.data : []"
                :suggest="suggestOrganizations"
                :label="t('Organizations')"
                :placeholder="t('All organizations')"
                :get-option-id="(option) => option.id"
                :display-value="(option) => option.name"
                :filter="(option, query) => (option.name).toLocaleLowerCase().includes(query.toLocaleLowerCase())"
                :multiple="false"
                :loading="organizationsStatus === 'pending'"
              >
                <template #option="{ option }">
                  <div class="flex items-center space-x-2">
                    <Placeholder
                      :lazy="false"
                      type="organization"
                      :src="'logo_thumbnail' in option ? option.logo_thumbnail : option.image_url"
                      :size="32"
                      class="flex-none"
                    />
                    <span>{{ option.name }}</span>
                  </div>
                </template>
              </SearchableSelect>
              <SearchableSelect
                v-model="facets.organizationType"
                :options="organizationTypes"
                :label="t('Organization type')"
                :placeholder="t('All types')"
                :get-option-id="(type) => type.type"
                :display-value="(value) => value.label"
                :multiple="false"
              >
                <template #option="{ option: type }">
                  {{ type.label }}
                </template>
              </SearchableSelect>
            </template>
            <SearchableSelect
              v-model="facets.tag"
              :label="t('Tags')"
              :placeholder="t('All tags')"
              :get-option-id="(tag) => tag"
              :display-value="(value) => value"
              :suggest="suggestTags"
              :multiple="false"
            >
              <template #option="{ option: tag }">
                {{ tag }}
              </template>
            </SearchableSelect>
            <SearchableSelect
              v-model="facets.format"
              :label="t('Formats')"
              :placeholder="t('All formats')"
              :options="allowedFormats ? allowedFormats : []"
              :loading="allowedFormatsStatus === 'pending'"
              :get-option-id="(format) => format"
              :display-value="(value) => value"
              :multiple="false"
            >
              <template #option="{ option: format }">
                {{ format }}
              </template>
            </SearchableSelect>
            <SearchableSelect
              v-model="facets.license"
              :label="t('Licenses')"
              :explanation="t('Licenses define reuse rules for published datasets. See page data.gouv.fr/licences')"
              :placeholder="t('All licenses')"
              :display-value="(value) => value.title"
              :options="licenses ? licenses : []"
              :loading="licensesStatus === 'pending'"
              :multiple="false"
            >
              <template #option="{ option: license }">
                {{ license.title }}
              </template>
            </SearchableSelect>
            <SearchableSelect
              v-model="facets.schema"
              :label="t('Schema')"
              :explanation="t('Data schemas describe data models: what are the fields, how are data shown, what are the available values, etc. See schema.data.gouv.fr')"
              :display-value="(value) => value.name"
              :get-option-id="(option) => option.name"
              :placeholder="t('All schemas')"
              :options="schemas ? schemas : []"
              :loading="schemasStatus === 'pending'"
              :multiple="false"
            >
              <template #option="{ option: schema }">
                {{ schema.name }}
              </template>
            </SearchableSelect>
            <SearchableSelect
              v-model="facets.geozone"
              :label="t('Spatial coverage')"
              :placeholder="t('All coverages')"
              :suggest="suggestSpatialCoverages"
              :get-option-id="(coverage) => coverage.id"
              :display-value="(value) => value.name"
              :multiple="false"
            >
              <template #option="{ option: coverage }">
                <div class="flex-1">
                  {{ coverage.name }}
                </div>
                <code class="bg-gray-some text-gray-medium p-1">{{ coverage.code }}</code>
              </template>
            </SearchableSelect>
            <SearchableSelect
              v-model="facets.granularity"
              :label="t('Spatial granularity')"
              :placeholder="t('All granularities')"
              :get-option-id="(granularity) => granularity.id"
              :display-value="(value) => value.name"
              :multiple="false"
              :options="spatialGranularities ? spatialGranularities : []"
              :loading="spatialGranularitiesStatus === 'pending'"
            >
              <template #option="{ option: granularity }">
                {{ granularity.name }}
              </template>
            </SearchableSelect>
            <div
              v-if="isFiltered || downloadLink"
              class="mb-6 text-center"
            >
              <BrandedButton
                v-if="isFiltered"
                color="primary-soft"
                :icon="RiCloseCircleLine"
                class="w-full justify-center"
                type="button"
                @click="resetFilters"
              >
                {{ t('Reset filters') }}
              </BrandedButton>
              <BrandedButton
                v-else-if="downloadLink"
                :icon="RiDownloadLine"
                color="secondary"
                class="w-full justify-center"
                :href="downloadLink"
              >
                {{ t('Download list as CSV') }}
              </BrandedButton>
            </div>
          </div>
        </Sidemenu>
      </div>
      <section
        ref="results"
        class="col-span-12 md:col-span-8 lg:col-span-9 mt-4 md:mt-0 search-results"
        v-bind="$attrs"
      >
        <div
          v-if="searchResults?.total"
          class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle justify-between pb-2"
        >
          <p
            class="fr-col-auto my-0"
            role="status"
          >
            {{ t("{count} results", searchResults.total) }}
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
                class="fr-select !shadow-input-blue"
                name="sort"
                @change="currentPage = 1"
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
          <LoadingBlock :status="searchResultsStatus">
            <div v-if="searchResults && searchResults.data.length">
              <ul class="mt-2 p-0 border-t border-gray-default relative z-2 list-none">
                <li
                  v-for="result in searchResults.data"
                  :key="result.id"
                  class="p-0"
                >
                  <DatasetCardLg :dataset="result" />
                </li>
              </ul>
              <Pagination
                v-if="searchResults && searchResults.total > pageSize"
                :page="currentPage"
                :page-size="pageSize"
                :total-results="searchResults.total"
                class="mt-4"
                :link="getLink"
                @change="changePage"
              />
              <SearchNoResults
                v-else-if="!organization"
                class="mt-4"
                :forum-url
                @reset-filters="resetForm"
              />
            </div>
            <SearchNoResults
              v-else
              :forum-url
              @reset-filters="resetForm"
            />
          </LoadingBlock>
        </transition>
      </section>
    </div>
  </form>
</template>

<script setup lang="ts">
import { getOrganizationTypes, OTHER, USER, type DatasetV2, type License, type Organization, type OrganizationTypes, type RegisteredSchema } from '@datagouv/components'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiCloseCircleLine, RiDownloadLine } from '@remixicon/vue'
import { computedAsync, debouncedRef } from '@vueuse/core'
import SearchInput from '~/components/Search/SearchInput.vue'
import type { PaginatedArray, RequestStatus, SpatialGranularity, SpatialZone } from '~/types/types'
import type { DatasetSearchParams, OrganizationOrSuggest } from '~/types/form'

const props = withDefaults(defineProps<{
  allowedFormats: Array<string> | null
  allowedFormatsStatus: RequestStatus
  forumUrl: string
  licenses: Array<License> | null
  licensesStatus: RequestStatus
  organizations: PaginatedArray<Organization> | null
  organizationsStatus: RequestStatus
  schemas: Array<RegisteredSchema> | null
  schemasStatus: RequestStatus
  searchResults: PaginatedArray<DatasetV2> | null
  searchResultsStatus: RequestStatus
  spatialGranularities: Array<SpatialGranularity> | null
  spatialGranularitiesStatus: RequestStatus
  suggestOrganizations: (q: string) => Promise<Array<OrganizationOrSuggest>>
  suggestSpatialCoverages: (q: string) => Promise<Array<SpatialZone>>
  suggestTags: (q: string) => Promise<Array<string>>
  downloadLink?: string
  organization?: Organization
  sorts?: Array<{ label: string, order: string, value: string }>
}>(), {
  downloadLink: '',
  sorts: () => ([]),
})

type Facets = {
  organization?: { id: string } | null
  organizationType?: { type: OrganizationTypes }
  tag?: string
  license?: License | null
  format?: string | null
  geozone?: SpatialZone
  granularity?: SpatialGranularity | null
  schema?: RegisteredSchema | null
}

const { t } = useI18n()
const config = useRuntimeConfig()
const { toast } = useToast()

const params = defineModel<DatasetSearchParams>('params', { required: true })

const organizationTypes = getOrganizationTypes()
  .filter(type => type.type !== OTHER && type.type !== USER)

/**
 * Search query
 */
const queryString = ref(params.value.q ?? '')

const deboucedQuery = debouncedRef(queryString, config.public.searchAutocompleteDebounce)

/**
 * Query sort
 */
const searchSort = ref(params.value.sort ?? '')

/**
 * Current page of results
 */
const currentPage = ref(params.value.page ? parseInt(params.value.page) : 1)

/**
 * Search page size
 */
const pageSize = 20

// Initialize facets from params
const organizationFromParams = computed(() => props.organizations?.data.find(org => org.id === params.value.organization))

const organizationFromSuggest = computedAsync<OrganizationOrSuggest | null>(async () => {
  if (!props.organization && !organizationFromParams.value && params.value.organization) {
    const suggested = await props.suggestOrganizations(params.value.organization)
    if (suggested && suggested.length > 0) {
      return suggested[0]
    }
  }
  return null
}, null)

const organizationTypeFromParams = organizationTypes.find(type => type.type === params.value.organization_badge) as (Omit<ReturnType<typeof getOrganizationTypes>[number], 'type'> & { type: OrganizationTypes }) | undefined

const licenseFromParams = computed(() => props.licenses?.find(license => license.id === params.value.license))

const schemaFromParams = computed(() => props.schemas?.find(schema => schema.name === params.value.schema))

let spatialCoverageFromSuggest: SpatialZone | undefined
if (params.value.geozone) {
  const suggested = await props.suggestSpatialCoverages(params.value.geozone)
  if (suggested && suggested.length > 0) {
    spatialCoverageFromSuggest = suggested[0]
  }
}

const granularityFromParams = computed(() => props.spatialGranularities?.find(granularity => granularity.id === params.value.granularity))

const facets = ref<Facets>({
  organization: null,
  organizationType: organizationTypeFromParams,
  tag: params.value.tag,
  format: params.value.format,
  license: null,
  schema: null,
  geozone: spatialCoverageFromSuggest,
  granularity: null,
})

watchEffect(() => {
  facets.value.organization = props.organization ?? organizationFromParams.value ?? organizationFromSuggest.value
  facets.value.license = licenseFromParams.value
  facets.value.schema = schemaFromParams.value
  facets.value.granularity = granularityFromParams.value
})

/**
 * Vue ref to results HTML
 */
const searchRef = useTemplateRef('search')

/**
 * Called when user type in search field
 */
watch([deboucedQuery, facets], () => {
  currentPage.value = 1
}, { deep: true })

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

function reloadFilters() {
  for (const key in facets.value) {
    facets.value[key as keyof Facets] = undefined
  }
  if (props.organization) {
    facets.value.organization = props.organization
  }
  currentPage.value = 1
  searchSort.value = ''
}

const resetFilters = () => {
  reloadFilters()
}

const resetForm = () => {
  queryString.value = ''
  reloadFilters()
}

/**
 * Is any filter active ?
 * We don't count scoped search as being filtered
 */
const isFiltered = computed(() => {
  const keys = Object.keys(facets.value) as Array<keyof Facets>
  return keys.some(
    key => key in facets.value && facets.value[key] && (props.organization ? key !== 'organization' : true),
  )
})
const sortOptions = [
  { label: t('Creation date'), value: '-created' },
  { label: t('Last update'), value: '-last_update' },
  { label: t('Number of followers'), value: '-followers' },
  { label: t('Number of reuses'), value: '-reuses' },
]

// Update model params
watchEffect(() => {
  params.value.page_size = pageSize.toFixed()
  if (!props.organization) {
    params.value.organization = facets.value.organization?.id ?? undefined
    params.value.organization_badge = facets.value.organizationType?.type ?? undefined
  }
  params.value.tag = facets.value.tag
  params.value.format = facets.value.format ?? undefined
  params.value.organization_badge = facets.value.organizationType?.type ?? undefined
  params.value.license = facets.value.license?.id ?? undefined
  params.value.schema = facets.value.schema?.name ?? undefined
  params.value.geozone = facets.value.geozone?.id ?? undefined
  params.value.granularity = facets.value.granularity?.id ?? undefined
  if (currentPage.value > 1) params.value.page = currentPage.value.toString()
  params.value.q = deboucedQuery.value ?? undefined
  params.value.sort = searchSort.value ?? null
  return params
})

watch(() => props.searchResultsStatus, () => {
  if (props.searchResultsStatus === 'error') {
    toast.error(t(`The search request failed`))
  }
})
</script>
