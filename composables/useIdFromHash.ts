export default function useIdFromHash(regExpArray: Array<RegExp>) {
  const id = ref<string | null>(null)

  const checkHash = () => {
    const hash = window.location.hash
    for (const regex of regExpArray) {
      const [_a, foundId, _b] = regex.exec(hash) || []
      if (foundId) {
        return id.value = foundId
      }
    }
    id.value = null
  }

  const resetHash = () => {
    history.pushState(null, '', ' ')
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  onMounted(() => {
    checkHash()
    window.addEventListener('hashchange', () => checkHash())
  })

  return {
    id: readonly(id),
    resetHash,
  }
};
