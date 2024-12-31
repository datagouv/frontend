import type { HarvesterSource } from '~/types/harvesters'

export function getHarvesterAdminUrl(harvester: HarvesterSource) {
  return `/beta/admin/harvesters/${harvester.id}`
}
