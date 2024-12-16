<template>
  <div>
    <div class="container">
      <Breadcrumb>
        <li>
          <a
            class="fr-breadcrumb__link"
            aria-current="page"
          >
            {{ $t('Posts') }}
          </a>
        </li>
      </Breadcrumb>
      <h1 class="font-800 p-[3.75rem] mb-0">
        {{ $t('Posts') }}
      </h1>
    </div>
    <div class="container">
      <div class="grid grid-cols-3 gap-5">
        <PostCard
          v-for="post in posts.data"
          :key="post.id"
          :post
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
