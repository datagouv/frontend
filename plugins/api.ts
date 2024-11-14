export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const token = useToken()
  const cookie = useRequestHeader('cookie')
  const localePath = useLocalePath()
  const { toast } = useToast()

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

        let message
        try {
          if ('message' in response._data) {
            message = response._data.message
          }
        }
        catch (e) {
          console.error(e)
          message = nuxtApp.$i18n.t('The API returned an unexpected error')
        }

        toast.error(message)
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
