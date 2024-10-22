export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()

    const api = $fetch.create({
      baseURL: config.public.apiBase,
      onRequest({ options }) {
        options.headers.set('Content-Type', 'application/json')
        options.headers.set('Accept', 'application/json')
        options.credentials = 'include'
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
            await nuxtApp.runWithContext(() => navigateTo('/login'))
        }
      }
    })
  
    // Expose to useNuxtApp().$api
    return {
      provide: {
        api
      }
    }
  })