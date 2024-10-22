<!-- eslint-disable @stylistic/keyword-spacing -->
<template>
  <div class="fr-container--fluid h-100">
    <div class="fr-grid-row h-100 bg-grey-50">
      <div class="fr-col-12 fr-col-md-4 fr-col-lg-3 fr-col-xl-2">
        <nav
          class="fr-sidemenu !p-0 md:h-full"
          :aria-label="t('Administration menu')"
        >
          <div
            class="fr-sidemenu__inner !p-0 bg-white shadow-[1px_0_0_0_var(--border-default-grey)] md:h-full"
          >
            <button
              class="fr-sidemenu__btn"
              hidden
              :aria-controls="menuId"
              aria-expanded="false"
            >
              {{ t('Open menu') }}
            </button>
            <div
              :id="menuId"
              class="fr-collapse"
            >
              <ul
                v-if="me"
                class="fr-sidemenu__list"
              >
                <AdminSidebarMenu
                  v-if="me"
                  :user="me"
                  :is-opened="isOpened(me.id)"
                  @open="open(me)"
                />
                <AdminSidebarMenu
                  v-for="organization in me.organizations"
                  :key="organization.id"
                  :organization="organization"
                  :is-opened="isOpened(organization.id)"
                  @open="() => open(organization)"
                  @click="() => setCurrentOrganization(organization)"
                />
              </ul>
            </div>
          </div>
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
import type { Organization, User } from '@datagouv/components/ts'
import AdminSidebarMenu from '../../components/AdminSidebar/AdminSidebarMenu/AdminSidebarMenu.vue'
import { useCurrentOrganization } from '../../composables/admin/useCurrentOrganization'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const menuId = useId()
const me = useMe()
const opened = ref<string>()
const { setCurrentOrganization } = useCurrentOrganization()

function isOpened(id: string) {
  return id === opened.value
}

function open(organization: Organization | User) {
  opened.value = organization.id
}

watchEffect(async () => {
  if (!me.value) {
    return
  }
  // When we are on "admin/#/", shows the first organization page, this could be removed when we have an admin "home" page
  if (!route.name) {
    if (me.value.organizations.length > 0) {
      router.replace({ name: 'organization-datasets', params: { oid: me.value.organizations[0].id } })
    }
    else {
      router.replace({ name: 'me' })
    }
  }
  // Opens the menu on "My Profil", this logic will change when we add more pages to this section
  if (route.name === 'me') {
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
