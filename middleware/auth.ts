export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('Calling auth middleware')
  const me = useMaybeMe();

  if (to.path !== '/en/login' && !me.value) {
    console.log('-> redirecting to login…')
    return navigateTo('/en/login')
  }
})
  