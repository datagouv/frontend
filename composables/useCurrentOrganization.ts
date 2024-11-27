import type { Organization } from '@datagouv/components'
import { keyBy } from 'lodash-es'

export async function useOrganizations() {
  const me = useMe()
  const route = useRoute()

  const organizations = useState('organizations', () => keyBy(me.value.organizations, org => org.id))

  if (route.params.oid && !Array.isArray(route.params.oid) && me.value.roles?.includes('admin') && !(route.params.oid in organizations.value)) {
    await useAPI<Organization>(`/api/1/organizations/${route.params.oid}`)
      .then(({ data: organization }) => {
        organizations.value[organization.value.id] = organization.value
      })
  }

  const currentOrganization = computed(() => {
    if (!route.params.oid || Array.isArray(route.params.oid)) {
      return null
    }

    return organizations.value[route.params.oid] || null
  })

  return { organizations, currentOrganization }
}
