<template>
  <SearchPage
    v-model:params="params"
    :allowed-formats
    :allowed-formats-status
    :data-search-feedback-form-url="config.public.dataSearchFeedbackFormUrl"
    :licenses
    :licenses-status
    :organizations
    :organizations-status
    :schemas
    :schemas-status
    :search-results
    :search-results-status
    :spatial-granularities
    :spatial-granularities-status
    :suggest-organizations
    :suggest-spatial-coverages
    :suggest-tags
  />
</template>

<script setup lang="ts">
import type { DatasetV2, License, Organization, RegisteredSchema } from '@datagouv/components'
import { useUrlSearchParams } from '@vueuse/core'
import type { DatasetSearchParams, OrganizationSuggest } from '~/types/form'
import type { PaginatedArray, SpatialGranularity, SpatialZone, Tag } from '~/types/types'

const { $api } = useNuxtApp()

const config = useRuntimeConfig()

/**
 * Update search params from URL on page load for deep linking
 */
const url = useRequestURL()
const params = useUrlSearchParams<DatasetSearchParams>('history', {
  initialValue: Object.fromEntries(url.searchParams.entries()),
  removeNullishValues: true,
  removeFalsyValues: true,
})

const nonFalsyParams = computed(() => {
  const filteredParams = Object.entries(toValue(params)).filter(([_k, v]) => v)
  return Object.fromEntries(filteredParams)
})

const { data: searchResults, status: searchResultsStatus } = await useAPI<PaginatedArray<DatasetV2>>('/api/2/datasets/search/', {
  params: nonFalsyParams,
})

const { data: allowedFormats, status: allowedFormatsStatus } = await useAPI<Array<string>>('/api/1/datasets/extensions/')

const { data: spatialGranularities, status: spatialGranularitiesStatus } = await useAPI<Array<SpatialGranularity>>('/api/1/spatial/granularities/')

const { data: schemas, status: schemasStatus } = await useAPI<Array<RegisteredSchema>>('api/1/datasets/schemas/')

const { data: licenses, status: licensesStatus } = await useAPI<Array<License>>('api/1/datasets/licenses/')

const { data: organizations, status: organizationsStatus } = await useAPI<PaginatedArray<Organization>>('/api/1/organizations/?sort=-followers')

async function suggestOrganizations(q: string) {
  return await $api<Array<OrganizationSuggest>>('/api/1/organizations/suggest/', {
    query: {
      q,
      size: 20,
    },
  })
}

async function suggestSpatialCoverages(query: string) {
  return await $api<Array<SpatialZone>>('/api/1/spatial/zones/suggest/', {
    query: {
      q: query,
      size: 20,
    },
  })
}

async function suggestTags(query: string) {
  const tags = await $api<Array<Tag>>('/api/1/tags/suggest/', {
    query: {
      q: query,
      size: 20,
    },
  })
  return tags.map(tag => tag.text)
}
</script>
