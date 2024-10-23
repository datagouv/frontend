export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('Calling guest middleware')
  const me = useMaybeMe();

  if (to.path !== '/en/newadmin' && me.value) {
    console.log('-> redirecting to new admin…')
    return navigateTo('/en/newadmin')
  }
})
