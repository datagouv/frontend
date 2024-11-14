<template>
  <Disclosure>
    <li
      class="fr-sidemenu__item"
      :class="{ 'fr-sidemenu__item--active': expanded }"
    >
      <DisclosureButton
        class="fr-sidemenu__btn"
        :aria-current="expanded"
        :aria-expanded="expanded"
        @click="toggle"
      >
        <template v-if="user">
          <Avatar
            v-if="user"
            :user="user"
            :size="24"
            :rounded="true"
          />
          <p class="mx-2">
            {{ $t('My Profil') }}
          </p>
        </template>
        <template v-else-if="organization">
          <div class="logo logo--sm">
            <Placeholder
              type="organization"
              :src="organization.logo_thumbnail"
              :size="20"
            />
          </div>
          <p class="mx-2 fr-col text-ellipsis whitespace-nowrap overflow-hidden">
            {{ organization.name }}
          </p>
        </template>
      </DisclosureButton>
      <DisclosurePanel
        v-show="expanded"
        static
      >
        <ul class="fr-sidemenu__list !mx-2 !my-3">
          <template v-if="user">
            <AdminSidebarLink
              :icon="RiAccountCircleLine"
              :label="$t('Me')"
              to="/beta/admin/me"
            />
            <AdminSidebarLink
              :icon="RiDatabase2Line"
              :label="$t('Datasets')"
              to="/beta/admin/me/datasets"
            />
            <AdminSidebarLink
              :icon="RiRobot2Line"
              :label="$t('Dataservices')"
              to="/beta/admin/me/dataservices"
            />
            <AdminSidebarLink
              :icon="RiLineChartLine"
              :label="$t('Reuses')"
              to="/beta/admin/me/reuses"
            />
            <AdminSidebarLink
              :icon="RiGitPullRequestLine"
              :label="$t('Community Resources')"
              to="/beta/admin/me/community-resources"
            />
            <AdminSidebarLink
              :icon="RiUserLine"
              :label="$t('Profile')"
              to="/beta/admin/me/profile"
            />
          </template>
          <template v-else-if="organization">
            <AdminSidebarLink
              :icon="RiDatabase2Line"
              :label="$t('Datasets')"
              :to="`/beta/admin/organizations/${organization.id}/datasets`"
              @click="$emit('click')"
            />
            <AdminSidebarLink
              :icon="RiRobot2Line"
              :label="$t('Dataservices')"
              :to="`/beta/admin/organizations/${organization.id}/dataservices`"
              @click="$emit('click')"
            />
            <AdminSidebarLink
              :icon="RiLineChartLine"
              :label="$t('Reuses')"
              :to="`/beta/admin/organizations/${organization.id}/reuses`"
              @click="$emit('click')"
            />
            <AdminSidebarLink
              :icon="RiChat3Line"
              :label="$t('Discussions')"
              :to="`/beta/admin/organizations/${organization.id}/discussions`"
              @click="$emit('click')"
            />
            <AdminSidebarLink
              :icon="RiParentLine"
              :label="$t('Members')"
              :to="`/beta/admin/organizations/${organization.id}/members`"
              @click="$emit('click')"
            />
            <AdminSidebarLink
              :icon="RiServerLine"
              :label="$t('Harvesters')"
              :to="`/beta/admin/organizations/${organization.id}/harvesters`"
              @click="$emit('click')"
            />
            <AdminSidebarLink
              :icon="RiGitPullRequestLine"
              :label="$t('Community Resources')"
              :to="`/beta/admin/organizations/${organization.id}/community-resources`"
              @click="$emit('click')"
            />
            <AdminSidebarLink
              :icon="RiUserLine"
              :label="$t('Profile')"
              :to="`/beta/admin/organizations/${organization.id}/profile`"
              @click="$emit('click')"
            />
          </template>
        </ul>
      </DisclosurePanel>
    </li>
  </Disclosure>
</template>

<script setup lang="ts">
import { Avatar, type Organization, type User } from '@datagouv/components'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { RiAccountCircleLine, RiChat3Line, RiDatabase2Line, RiGitPullRequestLine, RiLineChartLine, RiParentLine, RiRobot2Line, RiServerLine, RiUserLine } from '@remixicon/vue'
import { key, type AccordionRegister } from '~/components/Accordion/injectionKey'
import AdminSidebarLink from '~/components/AdminSidebar/AdminSidebarLink/AdminSidebarLink.vue'

const props = defineProps<{
  /**
   * The logged in user, to show a menu with an avatar and "My Profil"
   */
  user?: User
  /**
   * An organization, to show a menu with its logo and name
   */
  organization?: Organization

  defaultOpen: boolean
}>()

defineEmits<{
  click: []
}>()

const register = inject(key) as AccordionRegister

const { expanded, toggle, unregister } = register()

if (props.defaultOpen) {
  toggle()
}

onUnmounted(unregister)
</script>

<style scoped>
.fr-sidemenu__btn {
  background-color: var(--background-alt-grey);
  border-bottom: 1px solid var(--border-default-grey);
  color: var(--text-default-grey);
}

.fr-sidemenu__btn:hover {
  background-color: var(--background-alt-grey-hover);
}

.fr-sidemenu__btn:active {
  background-color: var(--background-alt-grey-active);
}

.fr-sidemenu__btn[aria-current]:not([aria-current=false]) {
  background-color: var(--background-default-grey);
  color: var(--text-default-grey);
}

.fr-sidemenu__btn[aria-current]:not([aria-current=false])::before {
  width: 0;
}

.fr-sidemenu__btn[aria-current]:not([aria-current=false]):hover {
  background-color: var(--hover-tint);
}

.fr-sidemenu__btn[aria-current]:not([aria-current=false]):active {
  background-color: var(--active-tint);
}

.fr-sidemenu .fr-collapse {
  padding-left: 0;
  padding-right: 0;
  margin-left: 0;
  margin-right: 0;
}

.fr-sidemenu .fr-collapse.fr-collapse--expanded {
  border-bottom: 1px solid var(--border-default-grey);
}
</style>
