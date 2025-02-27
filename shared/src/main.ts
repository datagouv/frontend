import { inject, type App, type Component, type InjectionKey, type Plugin } from 'vue'
import frMessages from '../assets/fr.js'
import enMessages from '../assets/en.js'
import type { Badge, Badges } from './types/badges'
import type { Dataset, DatasetV2, NewDataset, Quality, Rel } from './types/datasets'
import type { NewDataservice, Dataservice } from './types/dataservices'
import type { Frequency, Frequencies } from './types/frequency'
import type { Granularity, Granularities } from './types/granularity'
import type { Harvest } from './types/harvest'
import type { License } from './types/licenses'
import type { Member, MemberRole, NewOrganization, Organization } from './types/organizations'
import type { Owned, OwnedWithId } from './types/owned'
import type { NewReuse, Reuse, ReuseType } from './types/reuses'
import type { CommunityResource, FileResourceFileType, RemoteResourceFileType, ResourceFileType, ResourceType, Resource } from './types/resources'
import type { Weight, WellType } from './types/ui'
import type { User } from './types/users'

import CopyButton from './components/CopyButton.vue'
import DatasetCard from './components/DatasetCard.vue'
import DatasetInformationPanel from './components/DatasetInformationPanel.vue'
import DatasetQuality from './components/DatasetQuality.vue'
import OrganizationNameWithCertificate from './components/OrganizationNameWithCertificate.vue'
import OwnerTypeIcon from './components/OwnerTypeIcon.vue'
import Pagination from './components/Pagination.vue'
import ReadMore from './components/ReadMore.vue'
import ResourceAccordion from './components/ResourceAccordion/ResourceAccordion.vue'
import ResourceIcon from './components/ResourceAccordion/ResourceIcon.vue'
import SimpleBanner from './components/SimpleBanner.vue'
import type { UseFetchFunction } from './functions/api'

export * from './functions/dates'
export * from './functions/organizations'
export * from './functions/resources'
export * from './functions/users'
export * from './functions/owned'
export * from './functions/helpers'
export * from './functions/matomo'
export * from './functions/schemas'
export * from './functions/markdown'

export type {
  UseFetchFunction,
  Badge,
  Badges,
  CommunityResource,
  Dataset,
  DatasetV2,
  Dataservice,
  NewDataservice,
  FileResourceFileType,
  Frequency,
  Frequencies,
  Granularity,
  Granularities,
  Harvest,
  License,
  Member,
  MemberRole,
  NewDataset,
  NewOrganization,
  NewReuse,
  Organization,
  Owned,
  OwnedWithId,
  Quality,
  Rel,
  RemoteResourceFileType,
  Resource,
  ResourceFileType,
  ResourceType,
  Reuse,
  ReuseType,
  User,
  Weight,
  WellType,
}

export type PluginConfig = {
  name: string // Name of the application (ex: data.gouv.fr)
  baseUrl: string
  apiBase: string
  devApiKey?: string | null
  staticUrl: string
  datasetQualityGuideUrl?: string
  schemaValidataUrl: string
  schemaDocumentationUrl: string
  tabularApiUrl?: string
  tabularApiPageSize?: number
  tabularAllowRemote?: boolean
  customUseFetch?: UseFetchFunction | null
  textClamp?: string | Component | null
  appLink?: Component | null
  i18n?: {
    global: {
      mergeLocaleMessage: (locale: string, messages: unknown) => void
    }
  }
}

export const configKey = Symbol() as InjectionKey<PluginConfig>

// Vue Plugin
const datagouv: Plugin<PluginConfig> = {
  async install(app: App, options) {
    if (!options.textClamp) {
      const textClamp = await import('vue3-text-clamp')
      options.textClamp = textClamp.default
    }

    if (options.i18n) {
      options.i18n.global.mergeLocaleMessage('en', enMessages)
      options.i18n.global.mergeLocaleMessage('fr', frMessages)
    }

    app.provide(configKey, options)
  },
}

export function useComponentsConfig(): PluginConfig {
  const config = inject(configKey)
  if (!config) throw new Error('Calling `useComponentsConfig` outside @datagouv/components')
  return config
}

export {
  datagouv,
  CopyButton,
  DatasetCard,
  DatasetInformationPanel,
  DatasetQuality,
  OrganizationNameWithCertificate,
  OwnerTypeIcon,
  Pagination,
  ReadMore,
  ResourceAccordion,
  ResourceIcon,
  SimpleBanner,
}
