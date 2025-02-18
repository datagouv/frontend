import { ref, toValue, watchEffect, type Ref, type WatchSource } from 'vue'
import { ofetch } from 'ofetch'

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

export const customUseFetch = ref<null | (<DataT, ErrorT>(
  url: string | Request | Ref<string | Request> | (() => string | Request),
  options?: UseFetchOptions<DataT>
) => Promise<AsyncData<DataT, ErrorT>>)>(null)

export async function useFetch<DataT, ErrorT = never>(
  url: string | Request | Ref<string | Request> | (() => string | Request),
  options?: UseFetchOptions<DataT>,
): Promise<AsyncData<DataT, ErrorT>> {
  if (customUseFetch.value) {
    return await customUseFetch.value(url, options)
  }

  const data: Ref<DataT | null> = ref(null)
  const error: Ref<ErrorT | null> = ref(null)
  const status = ref<AsyncDataRequestStatus>('idle')

  const execute = async (opts?: AsyncDataExecuteOptions) => {
    status.value = 'pending'
    try {
      data.value = await ofetch(toValue(url), options)
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
