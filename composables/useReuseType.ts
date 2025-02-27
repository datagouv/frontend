import { fetchReuseTypes, getType } from '@datagouv/components'
import { computedAsync } from '@vueuse/core'

export default function useReuseType(id: MaybeRefOrGetter<string>) {
  const label = computedAsync(async () => {
    const idValue = toValue(id)
    const types = await fetchReuseTypes()
    return getType(types, idValue)
  }, '')
  return {
    label,
  }
}
