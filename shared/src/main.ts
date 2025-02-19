import type { App, InjectionKey, Plugin } from 'vue'
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
import DatasetInformationPanel from './components/DatasetInformationPanel.vue'
import OrganizationNameWithCertificate from './components/OrganizationNameWithCertificate.vue'
import OwnerTypeIcon from './components/OwnerTypeIcon.vue'
import Pagination from './components/Pagination.vue'
import ReadMore from './components/ReadMore.vue'
import type { UseFetchFunction } from './functions/api'

export * from './functions/dates'
export * from './functions/organizations'
export * from './functions/owned'

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
  baseUrl: string
  apiBase: string
  devApiKey: string
  staticUrl: string
  customUseFetch?: UseFetchFunction
}

export const configKey = Symbol() as InjectionKey<PluginConfig>

// Vue Plugin
const datagouv: Plugin<PluginConfig> = {
  install(app: App, options) {
    app.provide(configKey, options)
  },
}

export {
  datagouv,
  CopyButton,
  DatasetInformationPanel,
  OrganizationNameWithCertificate,
  OwnerTypeIcon,
  Pagination,
  ReadMore,
}
