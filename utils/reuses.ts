import type { Dataset, Reuse, ReuseType } from '@datagouv/components'
import type { DatasetSuggest, NewReuseForApi, ReuseForm, ReuseTopic } from '~/types/types'

export function getReuseAdminUrl(reuse: Reuse): string {
  if (reuse.owner) {
    return `/beta/admin/me/reuses/${reuse.id}`
  }
  else {
    return `/beta/admin/organizations/${reuse.organization.id}/reuses/${reuse.id}`
  }
}

export function toForm(reuse: Reuse, types: Array<ReuseType>, topics: Array<ReuseTopic>): ReuseForm {
  return {
    owned: reuse.organization ? { organization: reuse.organization, owner: null } : { owner: reuse.owner, organization: null },
    title: reuse.title,
    description: reuse.description,
    url: reuse.url,
    type: { id: reuse.type, label: types.find(t => t.id === reuse.type)?.label || reuse.type },
    topic: { id: reuse.topic, label: topics.find(t => t.id === reuse.topic)?.label || reuse.topic },
    tags: reuse.tags?.map(text => ({ text })) || [],
    image: reuse.image,
    private: reuse.private,
  }
}

export function toApi(form: ReuseForm, overrides: { datasets?: Array<Dataset | DatasetSuggest>, private?: boolean } = {}): NewReuseForApi {
  return {
    organization: form.owned?.organization?.id,
    owner: form.owned?.owner?.id,
    title: form.title,
    url: form.url,
    private: overrides.private,
    description: form.description,
    datasets: overrides.datasets ? overrides.datasets.map(({ id }) => id) : undefined,
    type: form.type?.id || '',
    topic: form.topic?.id || '',
    tags: form.tags.map(t => t.text),
  }
}
