import cloneDeep from 'lodash-es/cloneDeep'
import type { Post, PostForm } from '~/types/posts'

export function toForm(post: Post): PostForm {
  return {
    ...cloneDeep(post),
    tags: post.tags.map(text => ({ text })),
    image: post.image as string | File,
  }
}

export function toApi(form: PostForm): Post {
  return {
    ...form,
    tags: form.tags.map(({ text }) => text),
    image: null,
  }
}
