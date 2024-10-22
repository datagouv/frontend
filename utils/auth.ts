import type { Organization, User } from '@datagouv/components'
import { onMounted } from 'vue'
import { get } from './api'

export type Me = User & {
  about: string
  active: boolean
  apikey: string | null
  metrics: {
    datasets: number
    followers: number
    following: number
    reuses: number
  }
  organizations: Array<Organization>
  since: string
  website: string
}

const me = ref<Me | null>(null)

export const reloadAuth = async () => {
  const response = await get('http://dev.local:7000/api/1/me')
  me.value = response.data
}

export const useMe = (): Ref<Me | null> => {
  onMounted(async () => {
    reloadAuth()
  })

  return me
}
