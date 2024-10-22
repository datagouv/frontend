import type { User } from "@datagouv/components";

export const useMe = () => {
    return useAPI<User>('/api/1/me')
        .then((response) => ({ ...response, me: response.data as any as User}))
}

export const useMaybeMe = () => {
    return useState<User | null>('me')
}

export const refreshMe = async (meState: Ref<User | null>) => {
    // Here we cannot use the `useAPI` composable because
    // we don't want the classic error management that redirect
    // to the login page when a 401 is raised. So we must manually
    // re-configured the baseURL.

    const config = useRuntimeConfig()
    const headers = useRequestHeaders(['cookie'])

    try {
        meState.value = await $fetch<User | null>('/api/1/me', {
            baseURL: config.public.apiBase,
            // headers,
        })
    } catch (e) {
        console.error(e)
        meState.value = null
    }
}