<template>
  <div>
    <Breadcrumb>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/beta/admin"
        >
          {{ t('Administration') }}
        </NuxtLinkLocale>
      </li>
      <li>
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ t('Posts') }}
        </a>
      </li>
    </Breadcrumb>
    <h1 class="fr-h3 fr-mb-5v">
      {{ t("Posts") }}
    </h1>
    <div v-if="pageData && pageData.total" class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col">
        <h2 class="subtitle subtitle--uppercase fr-m-0">
          {{ t('{n} posts', pageData.total) }}
        </h2>
      </div>
      <div class="fr-col-auto fr-grid-row fr-grid-row--middle">
        <!-- Buttons -->
      </div>
    </div>

    <LoadingBlock :status>
      <div v-if="pageData && pageData.total">
        <AdminTable>
          <thead>
            <tr>
              <AdminTableTh scope="col">
                {{ t("Title") }}
              </AdminTableTh>
              <AdminTableTh scope="col">
                {{ t("Status") }}
              </AdminTableTh>
              <AdminTableTh scope="col">
                {{ t("Created at") }}
              </AdminTableTh>
              <AdminTableTh scope="col">
                {{ t("Updated at") }}
              </AdminTableTh>
              <AdminTableTh scope="col">
              </AdminTableTh>
            </tr>
          </thead>
          <tbody v-if="pageData">
            <tr
              v-for="post in pageData.data"
              :key="post.id"
            >
              <td>
                <a v-if="post.published" :href="post.page" class="link">{{ post.name }}</a>
                <span v-else>{{ post.name }}</span>
              </td>
              <td>
                <AdminBadge
                  size="xs"
                  :type="getStatus(post).type"
                >
                  {{ getStatus(post).label }}
                </AdminBadge>
              </td>
              <td>{{ formatDate(post.created_at) }}</td>
              <td>{{ formatDate(post.last_modified) }}</td>
              <td></td>
            </tr>
          </tbody>
        </AdminTable>
        <Pagination
          :page="page"
          :page-size="pageSize"
          :total-results="pageData.total"
          @change="(changedPage: number) => page = changedPage"
        />
      </div>
    </LoadingBlock>
  </div>
</template>

<script setup lang="ts">
import { formatDate, Pagination, type User } from '@datagouv/components'
import { refDebounced } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiMailLine } from '@remixicon/vue'
import type { AdminBadgeType, DiscussionSortedBy, PaginatedArray, Post, SortDirection } from '~/types/types'
import Breadcrumb from '~/components/Breadcrumb/Breadcrumb.vue'
import AdminTable from '~/components/AdminTable/Table/AdminTable.vue'
import AdminTableTh from '~/components/AdminTable/Table/AdminTableTh.vue'

const { t } = useI18n()

const page = ref(1)
const pageSize = ref(10)
const sortedBy = ref<DiscussionSortedBy>('created')
const direction = ref<SortDirection>('desc')
const sortDirection = computed(() => `${direction.value === 'asc' ? '' : '-'}${sortedBy.value}`)
const q = ref('')
const qDebounced = refDebounced(q, 500) // TODO add 500 in config

const params = computed(() => {
  return {
    with_drafts: true,
  }
})

const { data: pageData, status } = await useAPI<PaginatedArray<Post>>('/api/1/posts/', { lazy: true, query: params })

function getStatus(post: Post): { label: string, type: AdminBadgeType } {
  if (post.published) {
    return {
      label: t('Published {date}', { date: formatDate(post.published) }),
      type: 'success',
    }
  }
  else {
    return {
      label: t('Draft'),
      type: 'secondary',
    }
  }
}
</script>
