<template>
  <DataservicesSearchPage
    v-model:params="params"
    :forum-url="config.public.forumUrl"
    :organizations
    :organizations-status
    :search-results
    :search-results-status
    :suggest-organizations
  />
</template>

<script setup lang="ts">
import type { Dataservice, Organization } from '@datagouv/components'
import { useUrlSearchParams } from '@vueuse/core'
import type { DatasetSearchParams, OrganizationSuggest } from '~/types/form'
import type { PaginatedArray } from '~/types/types'

defineProps<{
  organization: Organization
}>()

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

const { data: searchResults, status: searchResultsStatus } = await useAPI<PaginatedArray<Dataservice>>('/api/2/dataservices/search/', {
  params: nonFalsyParams,
})
watchEffect(() => console.log(searchResultsStatus.value))

const { data: organizations, status: organizationsStatus } = await useAPI<PaginatedArray<Organization>>('/api/1/organizations/?sort=-followers')

async function suggestOrganizations(q: string) {
  return await $api<Array<OrganizationSuggest>>('/api/1/organizations/suggest/', {
    query: {
      q,
      size: 20,
    },
  })
}
</script>
