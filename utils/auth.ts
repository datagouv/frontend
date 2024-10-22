import type { CookieRef } from "#app";
import type { User } from "@datagouv/components";

export const useMe = () => {
    return useAPI<User>('/api/1/me')
        .then((response) => ({ ...response, me: response.data as any as User}))
}

export const useMaybeMe = () => {
    return useState<User | null>('me')
}

export const useToken = () => {
    return useCookie('token')
}

export const refreshMe = async (meState: Ref<User | null>) => {
    // Here we cannot use the `useAPI` composable because
    // we don't want the classic error management that redirect
    // to the login page when a 401 is raised. So we must manually
    // re-configured the baseURL.
    const config = useRuntimeConfig();
    const cookie = useRequestHeader('cookie');

    const token = useToken();

    let headers: Record<string, string> = {};

    if (cookie) {
        // console.log('Cookie is set to ' + cookie)
        headers['cookie'] = cookie
    }
    if (token.value) {
        // console.log('Token is set to ' + token.value)
        headers['Authentication-Token'] = token.value
    }

    try {
        meState.value = await $fetch<User | null>('/api/1/me', {
            baseURL: config.public.apiBase,
            credentials: 'include',
            headers,
        })
    } catch (e) {
        meState.value = null
    }
}