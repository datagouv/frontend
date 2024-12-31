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
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          :to="`/beta/admin/site/posts`"
        >
          {{ t('Posts') }}
        </NuxtLinkLocale>
      </li>
      <template v-if="post">
        <li>
          <a
            class="fr-breadcrumb__link"
            aria-current="page"
          >
            {{ post.name }}
          </a>
        </li>
      </template>
    </Breadcrumb>

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
import TabLinks from '~/components/TabLinks.vue'
import type { Post } from '~/types/types'

const { t } = useI18n()

const route = useRoute()
const url = computed(() => `/api/1/posts/${route.params.id}`)
const { data: post } = await useAPI<Post>(url, { lazy: true })
</script>
