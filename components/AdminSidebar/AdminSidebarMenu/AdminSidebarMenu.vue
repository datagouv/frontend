<template>
  <HeadlessDisclosure>
    <li
      class="fr-sidemenu__item"
      :class="{ 'fr-sidemenu__item--active': expanded }"
    >
      <HeadlessDisclosureButton
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
      </HeadlessDisclosureButton>
      <HeadlessDisclosurePanel
        v-show="expanded"
        static
      >
        <ul class="fr-sidemenu__list !mx-2 !my-3">
          <template v-if="user">
            <AdminSidebarLink
              icon="ri:account-circle-line"
              :label="$t('Me')"
              to="/newadmin/me"
            />
            <AdminSidebarLink
              icon="ri:database-2-line"
              :label="$t('Datasets')"
              to="/newadmin/me/datasets"
            />
            <AdminSidebarLink
              icon="ri:robot-2-line"
              :label="$t('Dataservices')"
              to="/newadmin/me/dataservices"
            />
            <AdminSidebarLink
              icon="ri:line-chart-line"
              :label="$t('Reuses')"
              to="/newadmin/me/reuses"
            />
            <AdminSidebarLink
              icon="ri:git-pull-request-line"
              :label="$t('Community Resources')"
              to="/newadmin/me/community-resources"
            />
            <AdminSidebarLink
              icon="ri:user-line"
              :label="$t('Profile')"
              to="/newadmin/me/profile"
            />
          </template>
          <template v-else-if="organization">
            <AdminSidebarLink
              icon="ri:database-2-line"
              :label="$t('Datasets')"
              :to="`/newadmin/organizations/${organization.id}/datasets`"
              @click="$emit('click')"
            />
            <AdminSidebarLink
              icon="ri:robot-2-line"
              :label="$t('Dataservices')"
              :to="`/newadmin/organizations/${organization.id}/dataservices`"
              @click="$emit('click')"
            />
            <AdminSidebarLink
              icon="ri:line-chart-line"
              :label="$t('Reuses')"
              :to="`/newadmin/organizations/${organization.id}/reuses`"
              @click="$emit('click')"
            />
            <AdminSidebarLink
              icon="ri:chat-3-line"
              :label="$t('Discussions')"
              :to="`/newadmin/organizations/${organization.id}/discussions`"
              @click="$emit('click')"
            />
            <AdminSidebarLink
              icon="ri:parent-line"
              :label="$t('Members')"
              :to="`/newadmin/organizations/${organization.id}/members`"
              @click="$emit('click')"
            />
            <AdminSidebarLink
              icon="ri:server-line"
              :label="$t('Harvesters')"
              :to="`/newadmin/organizations/${organization.id}/harvesters`"
              @click="$emit('click')"
            />
            <AdminSidebarLink
              icon="ri:git-pull-request-line"
              :label="$t('Community Resources')"
              :to="`/newadmin/organizations/${organization.id}/community-resources`"
              @click="$emit('click')"
            />
            <AdminSidebarLink
              icon="ri:user-line"
              :label="$t('Profile')"
              :to="`/newadmin/organizations/${organization.id}/profile`"
              @click="$emit('click')"
            />
          </template>
        </ul>
      </HeadlessDisclosurePanel>
    </li>
  </HeadlessDisclosure>
</template>

<script setup lang="ts">
import { Avatar, type Organization, type User } from '@datagouv/components'
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
