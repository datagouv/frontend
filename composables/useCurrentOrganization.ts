import type { Organization } from '@datagouv/components'
import { keyBy } from 'lodash-es'

export async function useOrganizations() {
  const me = useMe()
  const route = useRoute()

  const organizations = useState('organizations', () => keyBy(me.value.organizations, org => org.id))
  const currentOrganizationId = useState<string | null>('currentOrganizationId', () => null)

  if (route.params.oid && !Array.isArray(route.params.oid) && me.value.roles?.includes('admin') && !(route.params.oid in organizations.value)) {
    await useAPI<Organization>(`/api/1/organizations/${route.params.oid}`)
      .then(({ data: organization }) => {
        organizations.value[organization.value.id] = organization.value
      })
  }

  const currentOrganization = computed(() => {
    if (!route.params.oid || Array.isArray(route.params.oid)) {
      if (!currentOrganizationId.value) return null

      return organizations.value[currentOrganizationId.value] || null
    }

    currentOrganizationId.value = null // fallback to route
    return organizations.value[route.params.oid] || null
  })

  const setCurrentOrganization = (organization: Organization) => {
    currentOrganizationId.value = organization.id
    organizations.value[organization.id] = organization
  }

  return { organizations, currentOrganization, setCurrentOrganization }
}
