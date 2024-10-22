export default defineNuxtRouteMiddleware(async (to, from) => {
    const me = await useMaybeMe();

    if (to.path !== '/en/newadmin' && me.value) {
      return navigateTo('/en/newadmin')
    }
  })
  