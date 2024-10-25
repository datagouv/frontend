export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const token = useToken()
  const cookie = useRequestHeader('cookie')
  const localePath = useLocalePath()

  const makeApi = (sendJson = true) => {
    return $fetch.create({
      baseURL: config.public.apiBase,
      onRequest({ options }) {
        if (sendJson) {
          options.headers.set('Content-Type', 'application/json')
        }
        options.headers.set('Accept', 'application/json')
        options.credentials = 'include'
        if (token.value) {
          options.headers.set('Authentication-Token', token.value)
        }
        if (cookie) {
          options.headers.set('Cookie', cookie)
        }
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          await nuxtApp.runWithContext(() => navigateTo(localePath('/login')))
        }
      },
    })
  }

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api: makeApi(),
      fileApi: makeApi(false),
    },
  }
})
