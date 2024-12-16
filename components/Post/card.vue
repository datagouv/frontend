<template>
  <div class="max-w-[38rem] hover:bg-neutral-200">
    <div v-if="post.image">
      <img :src="post.image">
    </div>
    <div class="p-4">
      <p class="text-lg mb-2.5 font-bold">
        {{ post.name }}
      </p>
      <p class="mb-0">
        {{ $t('Published on {date}', { date: formatDate(post.published) }) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@datagouv/components'
import type { Post } from '~/types/posts'

defineProps<{
  post: Post
}>()
</script>
