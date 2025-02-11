<template>
  <div>
    <AdminBreadcrumb>
      <BreadcrumbItem :to="`/beta/admin/site/posts`">
        {{ t('Posts') }}
      </BreadcrumbItem>
      <BreadcrumbItem v-if="post">
        {{ post.name }}
      </BreadcrumbItem>
    </AdminBreadcrumb>

    <div v-if="post">
      <div class="flex items-center justify-between mb-5">
        <h1 class="fr-h3 !mb-0">
          {{ post.name }}
        </h1>
        <a
          :href="post.page"
          class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--secondary-grey-500 fr-btn--icon-left fr-icon-eye-line"
        >
          {{ t('See the post page') }}
        </a>
      </div>

      <TabLinks
        class="mb-5"
        :links="[
          { href: `/beta/admin/posts/${post.id}`, label: t('Metadata') },
          { href: `/beta/admin/posts/${post.id}/content`, label: t('Content') },
        ]"
      />

      <NuxtPage :page-key="route => route.fullPath" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminBreadcrumb from '~/components/Breadcrumbs/AdminBreadcrumb.vue'
import BreadcrumbItem from '~/components/Breadcrumbs/BreadcrumbItem.vue'
import TabLinks from '~/components/TabLinks.vue'
import type { Post } from '~/types/posts'

const { t } = useI18n()

const route = useRoute()
const url = computed(() => `/api/1/posts/${route.params.id}`)
const { data: post } = await useAPI<Post>(url, { lazy: true })
</script>
