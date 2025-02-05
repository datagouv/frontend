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
    <OrganizationListPage
      :link="getLink"
      :organizations
      :sort
      :status
      @change="change"
    />
  </div>
</template>

<script setup lang="ts">
import type { Organization } from '@datagouv/components'
import type { LocationQueryValue } from 'vue-router'
import Breadcrumb from '~/components/Breadcrumb/Breadcrumb.vue'
import type { PaginatedArray } from '~/types/types'

const route = useRoute()
const q = ref('')
const sort = ref((route.query.sort as string | null) || undefined)
const page = ref(parseInt(route.query.page as LocationQueryValue ?? '1', 10))
const pageSize = 21

function change(newQs: string, newSort: string | undefined, newPage: number) {
  q.value = newQs
  sort.value = newSort
  page.value = newPage
  return navigateTo({
    ...route,
    query: {
      ...route.query,
      q: q.value,
      page: page.value,
      sort: sort.value,
    },
  })
}

const { data: organizations, status } = await useAPI<PaginatedArray<Organization>>(`/api/2/organizations/search/`, { params:
  {
    q,
    page,
    page_size: pageSize,
    sort,
  },
})
</script>
