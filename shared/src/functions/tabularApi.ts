import axios from 'axios'
import { useComponentsConfig } from '../main'

export type SortConfig = {
  column: string
  type: string
} | null

/**
 * Call Tabular-api to get table content
 */
export function getData(id: string, page: number, sortConfig?: SortConfig) {
  const config = useComponentsConfig()

  let url = `${config.tabularApiUrl}/api/resources/${id}/data/?page=${page}&page_size=${config.tabularApiPageSize || 20}`
  if (sortConfig) {
    url = url + `&${sortConfig.column}__sort=${sortConfig.type}`
  }
  return axios.get(url)
}

/**
 * Call Tabular-api to get table profile
 */
export function getProfile(id: string) {
  const config = useComponentsConfig()

  return axios.get(`${config.tabularApiUrl}/api/resources/${id}/profile/`)
}
