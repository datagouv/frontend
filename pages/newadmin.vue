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
import AdminSidebarMenu from '~/components/AdminSidebar/AdminSidebarMenu/AdminSidebarMenu.vue'

definePageMeta({
  layout: 'fluid',
  middleware: ['auth'],
});

const { t } = useI18n()
const route = useRoute()
const me = useMe()

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
