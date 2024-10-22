export default defineNuxtRouteMiddleware(async (to, from) => {
    const me = await useMaybeMe();

    if (to.path !== '/en/login' && !me.value) {
      return navigateTo('/en/login')
    }
  })
  