import type { HarvesterJob, HarvesterSource } from '~/types/harvesters'

export function getHarvesterAdminUrl(harvester: HarvesterSource) {
  return `/beta/admin/harvesters/${harvester.id}`
}

export function getHarvesterJobAdminUrl(harvester: HarvesterSource, job: HarvesterJob) {
  return `${getHarvesterAdminUrl(harvester)}/jobs/${job.id}`
}
