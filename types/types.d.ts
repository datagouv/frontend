import type { Dataset, Dataservice, Reuse, User, Frequency, Organization, License, ReuseType } from '@datagouv/components'

export type AxisAlignment = 'start' | 'center' | 'end'

export type SortDirection = 'asc' | 'desc'

export type DSFRFormDefaultState = 'default'

export type DSFRFormFunctionalState = 'error' | 'success'

export type DSFRFormState = DSFRFormDefaultState | DSFRFormFunctionalState

export type FormFunctionalState = DSFRFormFunctionalState | 'warning'

export type AccordionFunctionalState = FormFunctionalState | 'disabled'

export type DSFRInfoState = 'info'

export type PublishingFormAccordionState = AccordionFunctionalState | DSFRInfoState

export type AccordionState = DSFRFormDefaultState | AccordionFunctionalState | DSFRInfoState

export type AdminBadgeState = DSFRFormDefaultState | FormFunctionalState | DSFRInfoState

export type PaginatedArray<T> = {
  data: Array<T>
  next_page: string | null
  page: number
  page_size: number
  previous_page: string | null
  total: number
}

export type DatasetSortedBy = 'title' | 'created' | 'last_update' | 'reuses' | 'followers' | 'views'

export type ResourceSortedBy = 'title' | 'type' | 'format' | 'created_at' | 'last_modified'

export type DataserviceSortedBy = 'title'

export type ReuseSortedBy = 'title' | 'created' | 'datasets' | 'followers' | 'views'

export type DiscussionSortedBy = 'title' | 'created' | 'closed'

export type CommunityResourceSortedBy = 'created_at_internal' | 'last_modified_internal' | 'title'

// DISCUSSIONS

export type Comment = { content: string, posted_by: User, posted_on: string, spam?: Spam }

export type Discussion = Array<Comment>

export type DiscussionSubjectTypes = Dataservice | Dataset | Reuse

export type DiscussionSubject = {
  class: 'Dataservice' | 'Dataset' | 'Reuse' | 'Post' | 'Topic' | 'Organization'
  id: string
}

export type Thread = {
  id: string
  discussion: Discussion
  title: string
  url: string
  created: string
  closed: string
  closed_by: User
  spam?: Spam
  subject: DiscussionSubject
}

// MEMBERS

export type MembershipStatus = 'pending' | 'accepted' | 'refused'

export type PendingMembershipRequest = {
  id: string
  user: User & { email: string }
  status: MembershipStatus
  created: string
  comment: string
}

export type MembershipRequest = PendingMembershipRequest & {
  handled_on: Date
  handled_by: User
}

export type RefusedMembershipRequest = MembershipRequest & {
  refusal_comment: string
}

export type MemberRole = 'admin' | 'editor'

// In org endpoint we get these two private information if we have edit rights on the org.
export type MemberUser = User & {
  email: string | null
  last_login_at: string | null
}

export type Member = {
  role: MemberRole
  user: MemberUser
  since: string
}

export type EditingMember = Member & {
  newRole?: MemberRole
}

export type MultiSelectOption = {
  label: string
  value: string
  image?: string
  hidden?: boolean
  selected?: boolean
  helper?: string
  description?: string
  recommended?: string
}

type UserSuggest = Omit<User, 'avatar' | 'avatar_thumbnail' | 'roles' | 'pages'> & { avatar_url: string | null }
type DatasetSuggest = Pick<Dataset, 'acronym' | 'id' | 'slug' | 'title' | 'page'> & { image_url: string | null }
type DatasetReference = Dataservice['datasets'][0]
export type SpatialZone = {
  code: string
  id: string
  level: string
  name: string
  uri: string
}

export type SpatialGranularity = {
  id: string
  name: string
}

export type Tag = {
  text: string
}

type Owned = { organization: Organization, owner: null } | { owner: User, organization: null }

export type DatasetForm = {
  owned: Owned | null
  title: string
  acronym: string
  description: string
  tags: Array<Tag>
  license: License | null
  temporal_coverage: { start: null | string, end: null | string }
  frequency: Frequency | null
  spatial_zones: Array<SpatialZone>
  spatial_granularity: SpatialGranularity | null
}

export type NewDatasetForApi = {
  title: string
  private?: boolean
  acronym?: string
  description: string
  organization?: string
  owner?: string
  tags: Array<string>
  license?: string
  temporal_coverage?: { start: string, end: string }
  frequency?: string
  spatial?: {
    granularity?: string
    zones?: Array<string>
  }
}

export type ReuseForm = {
  owned: Owned | null
  title: string
  url: string
  type: ReuseType | null
  topic: ReuseTopic | null
  description: string
  tags: Array<Tag>
  image: File | string | null
}
export type NewReuseForApi = {
  organization?: string
  owner?: string
  title: string
  private?: boolean
  description: string
  datasets: Array<string> | undefined
  url: string
  type: string | null
  topic: string | null
  tags: Array<string>
}

export type ReuseTopic = {
  id: string
  label: string
}

export type DataserviceForm = {
  owned: Owned | null
  title: string
  acronym: string
  description: string
  contact_point: NewContactPoint | ContactPoint | null
  is_restricted: boolean
  has_token: boolean
  base_api_url: string
  authorization_request_url: string
  endpoint_description_url: string
  business_documentation_url: string
  rate_limiting: string
  availability: string
}

export type NewDataserviceForApi = {
  organization?: string
  owner?: string
  title: string
  private?: boolean
  acronym?: string
  description: string
  datasets?: Array<string>
  contact_point?: string | null
  is_restricted: boolean
  has_token: boolean
  base_api_url: string | null
  authorization_request_url: string | null
  endpoint_description_url: string | null
  business_documentation_url: string | null
  rate_limiting: string
  availability: number | null
}

type EnrichedLicense = License & { group: string, recommended?: boolean, code?: string, description?: string }

export type RemoteResourceFileType = 'remote'

export type FileResourceFileType = 'file'

export type ResourceFileType = RemoteResourceFileType | FileResourceFileType

export type DatasetRemoteFile = { description?: string, filetype: RemoteResourceFileType, format: string, mime: string, schema?: string, title: string, type: ResourceType, url: string }

export type DatasetLocalFile = { file: File, sha256?: string, description?: string, format: string, filesize: number, filetype: FileResourceFileType, mime: string, schema?: string, title: string, type: ResourceType }

export type FileLoadingState = 'none' | 'loading' | 'failed' | 'loaded'

export type NewDatasetFile = (DatasetLocalFile | DatasetRemoteFile) & { state: FileLoadingState, errorMessage?: string }

export type NewOrganization = {
  acronym: string | null
  name: string
  business_number_id: string | null
  description: string
  url: string | null
  logo: string
}

export type ContactPoint = {
  id: string
  name: string
  contact_form?: string
  email?: string
}

export type NewContactPoint = Omit<ContactPoint, 'id'>
export type ContactPointInForm = ContactPoint | NewContactPoint
