export default defineNuxtRouteMiddleware(async (to, from) => {
  // console.log(`Calling me middleware ${from.path} -> ${to.path}`)
  const me = useMaybeMe()
  if (me.value !== undefined) {
    // console.log('Skipping since me in already set')
    return
  }

  await loadMe(me)
  // console.log('Me initted')
})
