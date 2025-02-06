import type { Organization } from '@datagouv/components'
import { keyBy } from 'lodash-es'

export function useOrganizations() {
  const me = useMe()
  const route = useRoute()

  const organizations = useState('organizations', () => keyBy(me.value.organizations, org => org.id))
  const users = useState('users', () => ({ [me.value.id]: me.value }))
  const currentOwnedId = useState<{ organization: string } | { user: string } | null>('currentOrganizationId', () => null)

  const currentOrganization = computed(() => {
    if (!route.params.oid || Array.isArray(route.params.oid)) {
      if (!currentOwnedId.value) return null
      if (!('organization' in currentOwnedId.value)) return null

      return organizations.value[currentOwnedId.value.organization] || null
    }

    currentOwnedId.value = null // fallback to route
    return organizations.value[route.params.oid] || null
  })

  const setCurrentOrganization = (organization: Organization) => {
    currentOwnedId.value = { organization: organization.id }
    organizations.value[organization.id] = organization
  }

  return { users, organizations, currentOrganization, setCurrentOrganization }
}
