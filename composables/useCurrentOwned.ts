import type { Organization, User } from '@datagouv/components'
import { keyBy } from 'lodash-es'

export function useCurrentOwned() {
  const me = useMe()
  const route = useRoute()

  const organizations = useState('organizations', () => keyBy(me.value.organizations, org => org.id))
  const users = useState<Record<string, User | Me>>('users', () => ({ [me.value.id]: me.value }))
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

  const currentUser = computed(() => {
    if (!route.params.uid || Array.isArray(route.params.uid)) {
      if (!currentOwnedId.value) return null
      if (!('user' in currentOwnedId.value)) return null

      return users.value[currentOwnedId.value.user] || null
    }

    currentOwnedId.value = null // fallback to route
    return users.value[route.params.uid] || null
  })

  const setCurrentOrganization = (organization: Organization) => {
    currentOwnedId.value = { organization: organization.id }
    organizations.value[organization.id] = organization
  }
  const setCurrentUser = (user: User) => {
    currentOwnedId.value = { user: user.id }
    users.value[user.id] = user
  }

  return { users, organizations, currentOrganization, currentUser, setCurrentOrganization, setCurrentUser }
}
