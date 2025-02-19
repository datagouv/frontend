import { ref } from 'vue'

export type ComponentsConfig = {
  staticUrl: string
  baseApiUrl: string
}

export const config = ref<ComponentsConfig | null>(null)

export function setConfig(newConfig: ComponentsConfig) {
  config.value = newConfig
}
