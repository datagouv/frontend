<template>
  <div>
    <PostContentForm
      v-if="post"
      :post
      type="update"
      :submit-label="t('Save')"
      @submit="save"
    >
      // test
    </PostContentForm>
  </div>
</template>

<script setup lang="ts">
import PostContentForm from '~/components/Posts/PostContentForm.vue'
import type { Post, PostForm } from '~/types/posts'

const { t } = useI18n()
const { $api } = useNuxtApp()
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
      body: JSON.stringify({
        content: form.content,
      }),
    })

    toast.success(t('Post updated!'))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    refresh()
  }
  finally {
    loading.value = false
  }
}
</script>
