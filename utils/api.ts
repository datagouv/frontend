import type { UseFetchOptions } from 'nuxt/app'

/*
  Example : const { data: datasets } = await useAPI<PaginatedArray<Dataset>>('/api/1/datasets')
*/
export function useAPI<T>(
  url: any,
  options?: UseFetchOptions<T>,
) {
    return useFetch(url, {
        ...options,
        $fetch: useNuxtApp().$api
    })
    .then((response) => {
        // This allow to remove the `null` variant from `useFetch`
        // response. I think the `null` variant is here for `DELETE`
        // responses (without body) but in our case this helper is intended 
        // to be used only for `GET` requests. We need to use $fetch for 
        // the others HTTP methods.
        // TODO: add a check at the beginning of this function to prevent 
        // miss-use of this function (calling it with other methods)
        return { ...response, data: response.data as Ref<T> }
    })
}
