<template>
  <div class="fr-container--fluid h-100">
    <div class="fr-grid-row h-100 bg-gray-100">
      <div class="fr-col-12 fr-col-md-4 fr-col-lg-3 fr-col-xl-2">
        <nav
          class="fr-sidemenu p-0 md:h-full"
          :aria-label="t('Administration menu')"
        >
          <ClientOnly>
            <HeadlessDisclosure
              :default-open="true"
              as="div"
              class="fr-sidemenu__inner p-0 bg-white shadow-[1px_0_0_0_var(--border-default-grey)] md:h-full"
            >
              <HeadlessDisclosureButton
                class="fr-sidemenu__btn"
                hidden
              >
                {{ t('Open menu') }}
              </HeadlessDisclosureButton>
              <HeadlessDisclosurePanel>
                <ul
                  v-if="me"
                  class="fr-sidemenu__list"
                >
                  <AdminSidebarMenu
                  :user="me"
                  :defaultOpen="defaultOpenId === me.id"
                  />
                  <AdminSidebarMenu
                    v-for="organization in me.organizations"
                    :defaultOpen="defaultOpenId === organization.id"
                    :key="organization.id"
                    :organization="organization"
                    @click="() => setCurrentOrganization(organization)"
                  />
                </ul>
              </HeadlessDisclosurePanel>
            </HeadlessDisclosure>
          </ClientOnly>
        </nav>
      </div>
      <div class="fr-col-12 fr-col-md-8 fr-col-lg-9 fr-col-xl-10 h-100 fr-px-2w overflow-auto">
        <NuxtPage
          :page-key="route => route.fullPath"
          class="fr-container--fluid"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Organization, User } from '@datagouv/components'
import AdminSidebarMenu from '~/components/AdminSidebar/AdminSidebarMenu/AdminSidebarMenu.vue'

definePageMeta({
  layout: 'fluid',
  middleware: ['auth'],
});

const { t } = useI18n()
const route = useRoute()
const localeRoute = useLocaleRoute()
const router = useRouter()
const me = useMe()
const opened = ref<string>()
const { setCurrentOrganization } = useCurrentOrganization()

// Works only because we are using MongoDB and there is no 
// collision between orgs' IDs and users' IDs.
const defaultOpenId = ref<null | string>(null);

onMounted(() => {
  if (route.params.oid && !Array.isArray(route.params.oid)) {
    defaultOpenId.value = route.params.oid
  } else if (route.path.includes('/me')) {
    defaultOpenId.value = me.value.id
  }
})

const mePath = computed(() => {
  const route = localeRoute('/newadmin/me')
  return route != null ? route.path : '/'
})

function open(organization: Organization | User) {
  opened.value = organization.id
}

watchEffect(async () => {
  if (!me.value) {
    return
  }
  // When we are on "admin/", shows the first organization page, this could be removed when we have an admin "home" page
  // TODO : add back when org pages are added
  if (localeRoute(route)?.path === localeRoute('/newadmin')?.path) {
  //   if (me.value.organizations.length > 0) {
  //     router.replace(orgDatasetPath(me.value.organizations[0].id))
  //  }
  //   else {
  //     router.replace(mePath.value)
  //   }
    router.replace(mePath.value)
  }
  // Opens the menu on "My Profile", this logic will change when we add more pages to this section
  if (localeRoute(route)?.path === mePath.value) {
    opened.value = me.value.id
    // On another page, opens the
  }
  else if (me.value.organizations.length > 0) {
    let organization = me.value.organizations[0]
    if (route.params.oid) {
      organization = me.value.organizations.find(organization => organization.id === route.params.oid) ?? organization
    }
    open(organization)
    setCurrentOrganization(organization)
  }
})
</script>

<style>
html, body {
  height: 100%;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.fr-sidemenu .fr-sidemenu__item:first-child:before, .fr-sidemenu .fr-sidemenu__item:last-child:before, .fr-sidemenu .fr-sidemenu__item:before {
  box-shadow: none;
}
</style>
