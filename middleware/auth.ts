export default defineNuxtRouteMiddleware(async (to, _from) => {
  // console.log(`Calling auth middleware ${from.path} -> ${to.path}`)
  const me = useMaybeMe()

  if (to.path !== '/en/login' && !me.value) {
    // console.log('-> redirecting to login…')
    const localePath = useLocalePath()
    return navigateTo(localePath('/login'), { external: true })
  }
})
