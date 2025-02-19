import { inject, ref, toValue, watchEffect, type ComputedRef, type Ref, type WatchSource } from 'vue'
import { ofetch } from 'ofetch'
import { useI18n } from 'vue-i18n'
import { configKey } from '../main'

type UseFetchOptions<DataT> = {
  key?: string
  method?: string
  query?: SearchParams
  params?: SearchParams
  body?: RequestInit['body'] | Record<string, any>
  headers?: Record<string, string> | [key: string, value: string][] | Headers
  baseURL?: string
  server?: boolean
  lazy?: boolean
  immediate?: boolean
  getCachedData?: (key: string, nuxtApp: any) => DataT
  deep?: boolean
  dedupe?: 'cancel' | 'defer'
  default?: () => DataT
  transform?: (input: DataT) => DataT | Promise<DataT>
  pick?: string[]
  watch?: WatchSource[] | false
}

type AsyncData<DataT, ErrorT> = {
  data: Ref<DataT | null>
  refresh: (opts?: AsyncDataExecuteOptions) => Promise<void>
  execute: (opts?: AsyncDataExecuteOptions) => Promise<void>
  clear: () => void
  error: Ref<ErrorT | null>
  status: Ref<AsyncDataRequestStatus>
}

interface AsyncDataExecuteOptions {
  dedupe?: 'cancel' | 'defer'
}

type AsyncDataRequestStatus = 'idle' | 'pending' | 'success' | 'error'

export type UseFetchFunction = (<DataT, ErrorT>(
  url: string | Request | Ref<string | Request> | ComputedRef<string | null> | (() => string | Request),
  options?: UseFetchOptions<DataT>
) => Promise<AsyncData<DataT, ErrorT>>)

export async function useFetch<DataT, ErrorT = never>(
  url: string | Request | Ref<string | Request> | ComputedRef<string | null> | (() => string | Request),
  options?: UseFetchOptions<DataT>,
): Promise<AsyncData<DataT, ErrorT>> {
  const config = inject(configKey)
  if (!config) throw new Error('Call `useFetch` outside @datagouv/components')

  const { t, locale } = useI18n()

  if (config.customUseFetch) {
    return await config.customUseFetch(url, options)
  }

  const data: Ref<DataT | null> = ref(null)
  const error: Ref<ErrorT | null> = ref(null)
  const status = ref<AsyncDataRequestStatus>('idle')

  const execute = async (opts?: AsyncDataExecuteOptions) => {
    const urlValue = toValue(url)
    if (!urlValue) return
    status.value = 'pending'
    try {
      data.value = await ofetch(urlValue, {
        baseURL: config.apiBase,
        onRequest({ options }) {
          options.headers.set('Content-Type', 'application/json')
          options.headers.set('Accept', 'application/json')
          options.credentials = 'include'
          if (config.devApiKey) {
            options.headers.set('X-API-KEY', config.devApiKey)
          }

          if (locale.value) {
            if (!options.params) {
              options.params = {}
            }
            options.params['lang'] = locale.value
          }
        },
        async onResponseError({ response }) {
          // TODO redirect to login outside Nuxt?
          // if (response.status === 401) {
          //   await nuxtApp.runWithContext(() => navigateTo(localePath('/login')))
          // }

          let message
          try {
            if ('error' in response._data) {
              message = response._data.error
            }
            else if ('message' in response._data) {
              message = response._data.message
            }
          }
          catch (e) {
            console.error(e)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            message = t('The API returned an unexpected error')
          }

          // TODO Toast outside Nuxt
          // toast.error(message)
        },
        ...options,
      })
      status.value = 'success'
    }
    catch (e) {
      error.value = e as ErrorT
      status.value = 'error'
    }
  }

  watchEffect(async () => {
    await execute()
  })

  return {
    data,
    refresh: async (opts?: AsyncDataExecuteOptions) => {
      execute()
    },
    execute,
    clear: () => {
      data.value = null
      status.value = 'idle'
    },
    error,
    status,
  }
}
