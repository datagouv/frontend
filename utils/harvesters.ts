import type { HarvesterForm, HarvesterJob, HarvesterSource, HarvestSourceConfig, HarvestSourceFilter } from '~/types/harvesters'

export function getHarvesterAdminUrl(harvester: HarvesterSource) {
  return `/beta/admin/harvesters/${harvester.id}`
}

export function getHarvesterJobAdminUrl(harvester: HarvesterSource, job: HarvesterJob) {
  return `${getHarvesterAdminUrl(harvester)}/jobs/${job.id}`
}

export function toForm(harvester: HarvesterSource): HarvesterForm {
  return {
    owned: harvester.organization ? { organization: harvester.organization, owner: null } : { owner: harvester.owner, organization: null },
    name: harvester.name,
    description: harvester.description || '',
    url: harvester.url,
    backend: harvester.backend,
    filters: harvester.config.filters as Array<HarvestSourceFilter> || [],
    configs: harvester.config.extra_configs as Array<HarvestSourceConfig> || [],
  }
}

// export function toApi(form: DataserviceForm, overrides: { archived_at?: string | null, datasets?: Array<Dataset | DatasetSuggest>, private?: boolean } = {}): NewDataserviceForApi {
//   return {}
// }
