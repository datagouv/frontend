import type { Organization } from '@datagouv/components'

type UploadLogoResponse = {
  image: string
  success: boolean
}

export async function uploadLogo(oid: string, file: File) {
  const resp = await useAPI<UploadLogoResponse>(`api/1/organizations/${oid}/logo`, {
    method: 'POST',
    body: {
      file: file,
    },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return resp.data
}

export async function updateOrganization(organization: MaybeRefOrGetter<Organization>) {
  const organizationValue = toValue(organization)
  const resp = await useAPI<Organization>(`api/1/organizations/${organizationValue.id}/`, {
    method: 'PUT',
    body: {
      ...organizationValue,
    },
  })
  return resp.data
}
