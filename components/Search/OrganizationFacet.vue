<template>
  <SearchableSelect
    v-model="model"
    :options="data.data"
    :suggest
    :label="t('Organizations')"
    :placeholder="t('All organizations')"
    :get-option-id="(option) => option.id"
    :display-value="(option) => option.name"
    :filter="(option, query) => (option.name).toLocaleLowerCase().includes(query.toLocaleLowerCase())"
    :multiple="false"
  >
    <template #option="{ option }">
      <div class="flex items-center space-x-2">
        <Placeholder
          type="organization"
          :src="'logo_thumbnail' in option ? option.logo_thumbnail : option.image_url"
          :size="32"
        />
        <span>{{ option.name }}</span>
      </div>
    </template>
  </SearchableSelect>
</template>

<script setup lang="ts">
import type { Organization } from '@datagouv/components'
import type { PaginatedArray } from '~/types/types'

type OrganizationWithSuggest = Organization | { id: string, image_url: string, name: string }

const { t } = useI18n()
const model = defineModel<OrganizationWithSuggest | null>()
const { $api } = useNuxtApp()

async function suggest(q: string) {
  return await $api<Array<OrganizationWithSuggest>>('/api/1/organizations/suggest/', {
    query: {
      q,
      size: 20,
    },
  })
}

const { data } = await useAPI<PaginatedArray<OrganizationWithSuggest>>('/api/1/organizations/?sort=-followers')
</script>
