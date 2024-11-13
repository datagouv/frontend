import type { Dataset, DatasetV2, Frequency, License } from '@datagouv/components'
import type { Component } from 'vue'
import Archive from '~/components/Icons/Archive.vue'
import Code from '~/components/Icons/Code.vue'
import Documentation from '~/components/Icons/Documentation.vue'
import Image from '~/components/Icons/Image.vue'
import Link from '~/components/Icons/Link.vue'
import Table from '~/components/Icons/Table.vue'
import type { DatasetForm, NewDatasetFile, NewDatasetForApi, SpatialGranularity, SpatialZone } from '~/types/types'

export function getResourceFormatIcon(format: string): Component | null {
  switch (format?.trim()?.toLowerCase()) {
    case 'txt':
    case 'pdf':
    case 'rtf':
    case 'odt':
    case 'doc':
    case 'docx':
    case 'epub':
      return Documentation
    case 'json':
    case 'sql':
    case 'xml':
    case 'xsd':
    case 'shp':
    case 'kml':
    case 'kmz':
    case 'gpx':
    case 'shx':
    case 'ovr':
    case 'geojson':
    case 'gpkg':
    case 'grib2':
    case 'dbf':
    case 'prj':
    case 'sqlite':
    case 'db':
    case 'sbn':
    case 'sbx':
    case 'cpg':
    case 'lyr':
    case 'owl':
    case 'dxf':
    case 'ics':
    case 'rdf':
    case 'ttl':
    case 'n3':
      return Code
    case 'tar':
    case 'gz':
    case 'tgz':
    case 'rar':
    case 'zip':
    case '7z':
    case 'xz':
    case 'bz2':
      return Archive
    case 'url':
      return Link
    case 'csv':
    case 'ods':
    case 'xls':
    case 'xlsx':
    case 'parquet':
      return Table
    case 'png':
    case 'jpg':
    case 'jpeg':
      return Image
    default:
      return null
  }
}

export function useNewDatasetFileForm(file: MaybeRef<NewDatasetFile>) {
  const isRemote = computed(() => unref(file).filetype === 'remote')
  const { t } = useI18n()

  return useForm(file, {
    url: [requiredIf(isRemote)],
    title: [required()],
    type: [required()],
    format: [required()],
  }, {
    description: [minLength(200, t('It\'s advised to have a {property} of at least {min} characters.', { property: t('description'), min: 200 }))],
  })
}

export const CLOSED_FORMATS = readonly(['pdf', 'doc', 'docx', 'word', 'xls', 'excel', 'xlsx'] as const)

const includeInSubtype = <T, U extends T>(array: ReadonlyArray<U>, value: T): value is U => {
  return array.includes(value as U)
}

export const isClosedFormat = (format: string) => includeInSubtype(CLOSED_FORMATS, format)

export function getDatasetAdminUrl(dataset: Dataset | DatasetV2): string {
  if (dataset.owner) {
    return `/beta/admin/me/datasets/${dataset.id}`
  }
  else if (dataset.organization) {
    return `/beta/admin/organizations/${dataset.organization.id}/datasets/${dataset.id}`
  }
  else {
    throw new Error(`Dataset #${dataset.id} without owner and organization`)
  }
}

export function toForm(dataset: Dataset, licenses: Array<License>, frequencies: Array<Frequency>, zones: Array<SpatialZone>, granularities: Array<SpatialGranularity>): DatasetForm {
  return {
    owned: dataset.organization ? { organization: dataset.organization, owner: null } : { owner: dataset.owner, organization: null },
    title: dataset.title,
    description: dataset.description,
    acronym: dataset.acronym,
    tags: dataset.tags?.map(text => ({ text })) || [],
    license: licenses.find(l => l.id === dataset.license) || null,
    frequency: frequencies.find(f => f.id === dataset.frequency) || null,
    temporal_coverage: dataset.temporal_coverage ? { start: dataset.temporal_coverage.start, end: dataset.temporal_coverage.end } : { start: null, end: null }, // TODO fix this type, the API returns an object not a string
    spatial_zones: dataset.spatial?.zones?.map(id => zones.find(z => z.id === id)).filter(z => z !== undefined) || [],
    spatial_granularity: granularities.find(g => g.id === dataset.spatial?.granularity) || null,
  }
}

export function toApi(form: DatasetForm, overrides: { private?: boolean } = {}): NewDatasetForApi {
  return {
    organization: form.owned?.organization?.id,
    owner: form.owned?.owner?.id,
    title: form.title,
    private: overrides.private,
    description: form.description,
    acronym: form.acronym,
    tags: form.tags.map(t => t.text),
    license: form.license?.id || '',
    frequency: form.frequency?.id || '',
    temporal_coverage: (form.temporal_coverage.start && form.temporal_coverage.end) ? form.temporal_coverage as { start: string, end: string } : undefined,
    spatial: (form.spatial_granularity || form.spatial_zones)
      ? {
          zones: form.spatial_zones.length ? form.spatial_zones.map(z => z.id) : undefined,
          granularity: form.spatial_granularity ? form.spatial_granularity.id : undefined,
        }
      : undefined,
  }
}
