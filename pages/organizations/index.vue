<template>
  <div class="container">
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
  </div>
</template>

<script setup lang="ts">
import type { Organization } from '@datagouv/components'
import { RiSearch2Line } from '@remixicon/vue'
import { debouncedRef } from '@vueuse/core'
import Breadcrumb from '~/components/Breadcrumb/Breadcrumb.vue'
import type { PaginatedArray } from '~/types/types'

const config = useRuntimeConfig()
const route = useRoute()
const page = ref(route.query.page ?? 1)
const q = ref()
const inputId = useId()
const qDebounced = debouncedRef(q, config.public.searchAutocompleteDebounce)

watch([page, qDebounced], async ([_newPage, newQ], [_oldPage, oldQ]) => {
  if (newQ !== oldQ) {
    page.value = 1
  }
  await navigateTo({
    ...route,
    query: {
      ...route.query,
      q: qDebounced.value,
      page: page.value,
    },
  })
  document.children[0].scrollIntoView({ behavior: 'smooth', block: 'start' })
})

const { data: organizations } = await useAPI<PaginatedArray<Organization>>(`/api/1/organizations`, { params:
  {
    q: qDebounced,
    page,
    page_size: 20,
  },
})
</script>
