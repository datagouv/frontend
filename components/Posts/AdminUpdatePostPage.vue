<template>
  <div>
    <DescribePost
      v-if="post"
      :post
      type="update"
      :submit-label="t('Save')"
      @submit="save"
    >
      // test
    </DescribePost>
  </div>
</template>

<script setup lang="ts">
import DescribePost from './DescribePost.vue'
import type { Post, PostForm } from '~/types/posts'
import { toApi } from '~/utils/posts'

const { t } = useI18n()
const { $api, $fileApi } = useNuxtApp()
const { toast } = useToast()

const route = useRoute()
const url = computed(() => `/api/1/posts/${route.params.id}`)
const { data: post, refresh } = await useAPI<Post>(url, { lazy: true })

const loading = ref(false)

const save = async (form: PostForm) => {
  try {
    loading.value = true

    await $api(`/api/1/posts/${post.value.id}/`, {
      method: 'PUT',
      body: JSON.stringify(toApi(form)),
    })

    if (form.image && typeof form.image !== 'string') {
      const formData = new FormData()
      formData.set('file', form.image)
      await $fileApi(`/api/1/posts/${post.value.id}/image/`, {
        method: 'POST',
        body: formData,
      })
    }

    toast.success(t('Post updated!'))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    refresh()
  }
  finally {
    loading.value = false
  }
}
</script>
