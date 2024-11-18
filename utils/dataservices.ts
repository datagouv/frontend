import type { Dataservice, Dataset } from '@datagouv/components'
import type { ContactPoint, DataserviceForm, DatasetSuggest, NewDataserviceForApi } from '~/types/types'

export function getDataserviceAdminUrl(dataservice: Dataservice): string {
  if (dataservice.owner) {
    return `/beta/admin/me/dataservices/${dataservice.id}`
  }
  else {
    return `/beta/admin/organizations/${dataservice.organization.id}/dataservices/${dataservice.id}`
  }
}

export function toForm(dataservice: Dataservice): DataserviceForm {
  return {
    owned: dataservice.organization ? { organization: dataservice.organization, owner: null } : { owner: dataservice.owner, organization: null },
    title: dataservice.title,
    description: dataservice.description,
    acronym: dataservice.acronym,
    contact_point: dataservice.contact_point as unknown as ContactPoint | null, // TODO the API returns a ContactPoint object.
    is_restricted: dataservice.is_restricted,
    has_token: dataservice.has_token,
    base_api_url: dataservice.base_api_url || '',
    authorization_request_url: dataservice.authorization_request_url || '',
    endpoint_description_url: dataservice.endpoint_description_url || '',
    business_documentation_url: dataservice.business_documentation_url || '',
    rate_limiting: dataservice.rate_limiting,
    availability: dataservice.availability?.toString() || '',
    private: dataservice.private,
  }
}

export function toApi(form: DataserviceForm, overrides: { datasets?: Array<Dataset | DatasetSuggest>, private?: boolean } = {}): NewDataserviceForApi {
  return {
    organization: form.owned?.organization?.id,
    owner: form.owned?.owner?.id,
    title: form.title,
    description: form.description,
    acronym: form.acronym,
    private: overrides.private,
    datasets: overrides.datasets ? overrides.datasets.map(({ id }) => id) : undefined,
    contact_point: form.contact_point && 'id' in form.contact_point ? form.contact_point.id : undefined,
    is_restricted: form.is_restricted,
    has_token: form.has_token,
    base_api_url: form.base_api_url || null,
    authorization_request_url: form.authorization_request_url || null,
    endpoint_description_url: form.endpoint_description_url || null,
    business_documentation_url: form.business_documentation_url || null,
    rate_limiting: form.rate_limiting,
    availability: form.availability ? parseFloat(form.availability) : null,
  }
}
