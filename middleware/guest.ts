export default defineNuxtRouteMiddleware(async (to, from) => {
  // console.log(`Calling guest middleware ${from.path} -> ${to.path}`)
  const me = useMaybeMe();

  if (to.path !== '/en/beta/admin' && me.value) {
    // console.log('-> redirecting to new admin…')
    const localePath = useLocalePath()
    return navigateTo(localePath('/beta/admin'))
  }
})
