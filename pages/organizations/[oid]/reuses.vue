<template>
  <div>
    <h2 class="!text-sm !mb-2.5">
      {{ $t('Organization reuses') }}
    </h2>
    <LoadingBlock :status>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          v-for="reuse in reuses.data"
          :key="reuse.id"
          :reuse
        />
      </div>
      <Pagination
        :total-results="reuses.total"
        :page="reuses.page"
        :page-size="reuses.page_size"
        :link="getLink"
      />
    </LoadingBlock>
  </div>
</template>

<script setup lang="ts">
import type { Organization, Reuse } from '@datagouv/components'
import Card from '~/components/Reuses/Card/NuxtCard.vue'
import type { PaginatedArray } from '~/types/types'

const props = defineProps<{
  organization: Organization
}>()

const { data: reuses, status } = await useAPI<PaginatedArray<Reuse>>('/api/2/reuses/search/', {
  params: { organization: props.organization.id, page_size: 15 },
})
</script>
