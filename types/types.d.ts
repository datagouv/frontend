import type { Dataset, Dataservice, Reuse } from '@datagouv/components'

export type SortDirection = 'asc' | 'desc';

export type DSFRFormDefaultState = "default";

export type DSFRFormFunctionalState = "error" | "success";

export type DSFRFormState = DSFRFormDefaultState | DSFRFormFunctionalState;

export type FormFunctionalState = DSFRFormFunctionalState | "warning";

export type AccordionFunctionalState = FormFunctionalState | "disabled";

export type DSFRInfoState = "info";

export type PublishingFormAccordionState = AccordionFunctionalState | DSFRInfoState;

export type AccordionState = DSFRFormDefaultState | AccordionFunctionalState | DSFRInfoState;

export type AdminBadgeState = DSFRFormDefaultState | FormFunctionalState | DSFRInfoState;

export type PaginatedArray<T> = {
    data: Array<T>;
    next_page: string | null;
    page: number;
    page_size: number;
    previous_page: string | null;
    total: number;
};

export type DatasetSortedBy = 'title' | 'created' | 'last_update' | 'reuses' | 'followers' | 'views';

export type ReuseSortedBy = 'title' | 'created' | 'datasets' | 'followers' | 'views';

export type DiscussionSortedBy = 'title' | 'created' | 'closed';

export type CommunityResourceSortedBy = 'created_at_internal' | 'last_modified_internal' | 'title';


// DISCUSSIONS

export type Comment = {content: string, posted_by: User, posted_on: string, spam?: Spam};

export type Discussion = Array<Comment>;

export type DiscussionSubjectTypes = Dataservice | Dataset | Reuse;

export type DiscussionSubject = {
  class: 'Dataservice' | 'Dataset' | 'Reuse' | 'Post' | 'Topic' | 'Organization';
  id: string;
};

export type Thread = {
  id: string;
  discussion: Discussion;
  title: string;
  url: string;
  created: string;
  closed: string;
  closed_by: User;
  spam?: Spam;
  subject: DiscussionSubject;
};


// MEMBERS

export type MembershipStatus = "pending" | "accepted" | "refused";

export type PendingMembershipRequest = {
  id: string;
  user: User & {email: string;};
  status: MembershipStatus;
  created: string;
  comment: string;
};

export type MembershipRequest = PendingMembershipRequest & {
  handled_on: Date;
  handled_by: User;
};

export type RefusedMembershipRequest = MembershipRequest & {
  refusal_comment: string;
};

export type MemberRole = "admin" | "editor";

// In org endpoint we get these two private information if we have edit rights on the org.
export type MemberUser = User & {
  email: string | null;
  last_login_at: string | null;
}

export type Member = {
  role: MemberRole;
  user: MemberUser;
  since: string;
};

export type EditingMember = Member & {
  newRole?: MemberRole;
};


export type MultiSelectOption = {
  label: string;
  value: string;
  image?: string;
  hidden?: boolean;
  selected?: boolean;
}
