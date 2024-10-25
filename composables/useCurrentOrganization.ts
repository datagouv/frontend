export function useCurrentOrganization() {
  const me = useMe();
  const route = useRoute();

  const org = computed(() => {
    if (!route.params.oid || Array.isArray(route.params.oid)) {
      return null
    }

    return me.value.organizations.find((org) => org.id === route.params.oid)
  })

  return {
    currentOrganization: org,
  }
}
