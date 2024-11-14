<template>
  <div class="fr-container--fluid min-h-full">
    <div class="fr-grid-row h-full bg-gray-100">
      <div class="fr-col-12 fr-col-md-4 fr-col-lg-3 fr-col-xl-2">
        <nav
          class="fr-sidemenu !p-0 md:h-full"
          :aria-label="t('Administration menu')"
        >
          <ClientOnly>
            <Disclosure
              :default-open="true"
              as="div"
              class="fr-sidemenu__inner !p-0 !bg-white !shadow-[1px_0_0_0_var(--border-default-grey)] md:h-full"
            >
              <DisclosureButton
                class="fr-sidemenu__btn"
                hidden
              >
                {{ t('Open menu') }}
              </DisclosureButton>
              <DisclosurePanel>
                <AccordionGroup
                  v-if="me"
                  class="fr-sidemenu__list"
                  as="ul"
                >
                  <AdminSidebarMenu
                    :user="me"
                    :default-open="defaultOpenId === me.id"
                  />
                  <AdminSidebarMenu
                    v-for="organization in me.organizations"
                    :key="organization.id"
                    :default-open="defaultOpenId === organization.id"
                    :organization="organization"
                  />
                </AccordionGroup>
              </DisclosurePanel>
            </Disclosure>
          </ClientOnly>
        </nav>
      </div>
      <div class="fr-col-12 fr-col-md-8 fr-col-lg-9 fr-col-xl-10 h-full fr-px-5w overflow-auto">
        <NuxtPage
          :page-key="route => route.fullPath"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import AdminSidebarMenu from '~/components/AdminSidebar/AdminSidebarMenu/AdminSidebarMenu.vue'

definePageMeta({
  layout: 'fluid',
  middleware: ['auth'],
})

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const localeRoute = useLocaleRoute()
const me = useMe()

// Works only because we are using MongoDB and there is no
// collision between orgs' IDs and users' IDs.
const defaultOpenId = ref<null | string>(null)

if (route.name === localeRoute('/beta/admin/')?.name) {
  if (me.value.organizations.length > 0) {
    await navigateTo(localePath(`/beta/admin/organizations/${me.value.organizations[0].id}/datasets`), { replace: true })
  }
  else {
    await navigateTo(localePath('/beta/admin/me/datasets'), { replace: true })
  }
}

onMounted(() => {
  if (route.params.oid && !Array.isArray(route.params.oid)) {
    defaultOpenId.value = route.params.oid
  }
  else if (route.path.includes('/me')) {
    defaultOpenId.value = me.value.id
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
