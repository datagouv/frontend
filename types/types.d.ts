import type { Dataset, Dataservice, Reuse, User, Frequency } from '@datagouv/components'

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

export type DatasetForm = {
  title: string
  acronym: string
  description: string
  owned: Owned | null
  tags: Array<Tag>
  license: License | null
  temporal_coverage: { start: null, end: null }
  frequency: Frequency | null
  spatial_zones: Array<SpatialZone>
  spatial_granularity: SpatialGranularity | null
}

type EnrichedLicense = License & { group: string, recommended?: boolean, code?: string, description?: string }

export type RemoteResourceFileType = 'remote'

export type FileResourceFileType = 'file'

export type ResourceFileType = RemoteResourceFileType | FileResourceFileType

export type DatasetRemoteFile = { description?: string, filetype: RemoteResourceFileType, format: string, mime: string, schema?: string, title: string, type: ResourceType, url: string }

export type DatasetLocalFile = { file: File, sha256?: string, description?: string, format: string, filesize: number, filetype: FileResourceFileType, mime: string, schema?: string, title: string, type: ResourceType }

export type FileLoadingState = 'none' | 'loading' | 'failed' | 'loaded'

export type NewDatasetFile = (DatasetLocalFile | DatasetRemoteFile) & { state: FileLoadingState }
