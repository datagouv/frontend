<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container mb-24">
    <div class="flex items-center">
      <Breadcrumb class="flex-1">
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
          <NuxtLinkLocale
            class="fr-breadcrumb__link"
            to="/posts"
          >
            {{ $t('Posts') }}
          </NuxtLinkLocale>
        </li>
        <li>
          <a
            class="fr-breadcrumb__link"
            aria-current="page"
          >
            {{ post.name }}
          </a>
        </li>
      </Breadcrumb>
      <div v-if="isAdmin(me)">
        <EditButton
          :id="post.id"
          type="posts"
        />
      </div>
    </div>
    <h1 class="text-4.5xl font-extrabold !mb-0">
      {{ post.name }}
    </h1>
    <p
      v-if="post.published"
      class="text-xs mb-0"
    >
      {{ $t('Published the {date}', { date: formatDate(post.published) }) }}
    </p>
    <p class="mt-4 mb-6">
      {{ post.headline }}
    </p>
    <img
      v-if="post.image"
      :src="post.image"
      class="w-full h-auto"
    >
    <MarkdownViewer
      v-if="post.body_type === 'markdown'"
      :content="post.content"
      :min-heading="2"
    />
    <div
      v-else
      :class="markdownClasses"
      v-html="post.content"
    />
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@datagouv/components'
import EditButton from '~/components/BrandedButton/EditButton.vue'
import type { Post } from '~/types/posts'

const route = useRoute()
const me = useMaybeMe()
const url = computed(() => `/api/1/posts/${route.params.id}/`)
const { data: post } = await useAPI<Post>(url, {
  key: getUserBasedKey(url.value),
})
</script>
