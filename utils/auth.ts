import type { Organization, User } from '@datagouv/components'

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

export const useMe = () => {
  return useAPI<Me>('/api/1/me')
    .then(response => ({ ...response, me: response.data }))
}

export const useMaybeMe = () => {
  return useState<Me | null>('me')
}

export const useToken = () => {
  return useCookie('token')
}

export const refreshMe = async (meState: Ref<Me | null>) => {
  // Here we cannot use the `useAPI` composable because
  // we don't want the classic error management that redirect
  // to the login page when a 401 is raised. So we must manually
  // re-configured the baseURL.
  console.log('calling refresh me!')
  const config = useRuntimeConfig()
  const cookie = useRequestHeader('cookie')

  const token = useToken()

  const headers: Record<string, string> = {}

  if (cookie) {
    console.log('Cookie is set to ' + cookie)
    headers['cookie'] = cookie
  }
  if (token.value) {
    console.log('Token is set to ' + token.value)
    headers['Authentication-Token'] = token.value
  }

  try {
    meState.value = await $fetch<Me | null>('/api/1/me', {
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers,
    })
  }
  catch (e) {
    console.error(e)
    meState.value = null
  }
}
