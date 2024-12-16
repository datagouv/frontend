import type { Dataset, Reuse, User } from '@datagouv/components'

export type Post = {
  body_type: 'markdown' | 'html'
  content: string
  created_at: string
  credit_to: string
  credit_url: string
  datasets: Array<Pick<Dataset, 'acronym' | 'id' | 'page' | 'title' | 'uri'>>
  headline: string
  id: string
  image: string | null
  last_modified: string
  name: string
  owner: User
  page: string
  published: string
  reuses: Array<Pick<Reuse, 'id' | 'image' | 'image_thumbnail' | 'page' | 'title' | 'uri'>>
  slug: string
  tags: Array<string>
  url: string
}
