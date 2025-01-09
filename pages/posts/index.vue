<template>
  <div>
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
            {{ $t('Posts') }}
          </a>
        </li>
      </Breadcrumb>
    </div>
    <div class="border-b border-grey-lowest">
      <div class="container">
        <h1 class="text-4.5xl font-extrabold pt-10 pb-[3.75rem] !mb-0">
          {{ $t('Posts') }}
        </h1>
      </div>
    </div>
    <div class="container mt-16 space-y-16 mb-16">
      <div class="grid md:grid-cols-6 gap-5">
        <PostCard
          v-for="(post, index) in posts.data"
          :key="post.id"
          :post
          :class="index < 2 ? 'col-span-3' : 'col-span-2'"
        />
      </div>
      <Pagination
        :page="posts.page"
        :page-size="posts.page_size"
        :total-results="posts.total"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pagination } from '@datagouv/components'
import type { Post } from '~/types/posts'
import type { PaginatedArray } from '~/types/types'

const { data: posts } = await useAPI<PaginatedArray<Post>>('api/1/posts', { params:
  {
    page_size: 15,
  },
})
</script>
