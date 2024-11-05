import type { Component } from 'vue'
import Archive from '~/components/Icons/Archive.vue'
import Code from '~/components/Icons/Code.vue'
import Documentation from '~/components/Icons/Documentation.vue'
import Image from '~/components/Icons/Image.vue'
import Link from '~/components/Icons/Link.vue'
import Table from '~/components/Icons/Table.vue'
import type { NewDatasetFile } from '~/types/types'

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
    description: [minLength(200, t('It\'s advised to have a description of at least {min} characters.', { min: 200 }))],
  })
}

export const CLOSED_FORMATS = readonly(['pdf', 'doc', 'docx', 'word', 'xls', 'excel', 'xlsx'] as const)

const includeInSubtype = <T, U extends T>(array: ReadonlyArray<U>, value: T): value is U => {
  return array.includes(value as U)
}

export const isClosedFormat = (format: string) => includeInSubtype(CLOSED_FORMATS, format)
