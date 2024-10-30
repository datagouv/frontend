<template>
  <div>
    <Breadcrumb>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/newadmin"
        >
          {{ t('Administration') }}
        </NuxtLinkLocale>
      </li>
      <li v-if="currentOrganization">
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/newadmin"
        >
          {{ currentOrganization.name }}
        </NuxtLinkLocale>
      </li>
      <li>
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ t('Members') }}
        </a>
      </li>
    </Breadcrumb>
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle justify-center">
      <div class="fr-col-12 fr-col-md">
        <h1 class="fr-h3 fr-mb-0">
          {{ t("Members") }}
        </h1>
      </div>
      <div
        v-if="isAdmin"
        class="fr-col-auto"
      >
        <ModalWithButton
          :title="t('Add member to the organization')"
          size="lg"
        >
          <template #button="{ attrs, listeners }">
            <button
              class="fr-btn fr-btn--sm fr-btn--icon-left fr-icon-add-line"
              v-bind="attrs"
              v-on="listeners"
            >
              {{ t("Add member") }}
            </button>
          </template>

          <template #default="{ close }">
            <form
              @submit.prevent="updateRole(member, close)"
            >
              <div>
                <SearchableSelect
                  v-model="addForm.user"
                  :label="$t('User')"
                  :placeholder="$t('Search a user')"
                  class="mb-6"
                  :get-option-id="(user) => user.id"
                  :display-value="(user) => `${user.first_name} ${user.last_name}`"
                  :suggest="suggestUser"
                >
                  <template #option="{ option: user }">
                    <div class="flex items-center space-x-2">
                      <img
                        class="rounded-full border border-default-grey size-5"
                        :src="`${config.public.apiBase}/api/1/avatars/${user.id}/24`"
                        loading="lazy"
                        alt=""
                      >
                      <span>{{ user.first_name }} {{ user.last_name }}</span>
                    </div>
                  </template>
                </SearchableSelect>
              </div>
              <SelectGroup
                v-if="roles.length > 0"
                v-model="addForm.role"
                :label="t('Role of the member')"
                :options="rolesOptions"
              />
              <div class="fr-modal__footer">
                <div class="fr-btns-group fr-btns-group--right fr-btns-group--sm fr-btns-group--inline-lg fr-btns-group--icon-left">
                  <button
                    class="fr-btn fr-btn--secondary fr-btn--secondary-grey-500"
                    type="button"
                    :disabled="loading"
                    @click="close"
                  >
                    {{ t("Cancel") }}
                  </button>
                  <button
                    class="fr-btn"
                    type="submit"
                    :disabled="loading"
                  >
                    {{ t("Add to the organization") }}
                  </button>
                </div>
              </div>
            </form>
          </template>
        </ModalWithButton>
      </div>
    </div>
    <!-- <template v-if="membershipRequests.length">
        <h2 class="subtitle subtitle--uppercase fr-mt-5v fr-mb-0">
          {{ t("{n} requests", {n: membershipRequests.length}) }}
        </h2>
        <AdminMembershipRequest
          class="fr-mb-4w"
          v-for="request in membershipRequests"
          :key="request.id"
          :loading="loading"
          :oid="null"
          :request="request"
          :show-actions="true"
          @accept="accept"
          @refuse="refuse"
        />
      </template> -->
    <h2
      v-if="organization"
      class="subtitle subtitle--uppercase fr-mb-0"
      :class="{ 'fr-mt-n3v': membershipRequests.length, 'fr-mt-5v': !membershipRequests.length }"
    >
      {{ t("{n} members", { n: organization.members.length }) }}
    </h2>
    <AdminTable
      class="fr-table--layout-fixed"
      :loading
    >
      <thead>
        <tr>
          <AdminTableTh scope="col">
            {{ t("Members") }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Status") }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Member since") }}
          </AdminTableTh>
          <AdminTableTh scope="col">
            {{ t("Last connection") }}
          </AdminTableTh>
          <AdminTableTh
            v-if="isOrgAdmin"
            scope="col"
          >
            {{ t("Action") }}
          </AdminTableTh>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="member in organization?.members || []"
          :key="member.user.id"
        >
          <td>
            <p class="fr-text--bold fr-m-0">
              {{ member.user.first_name }} {{ member.user.last_name }}
            </p>
            <p class="fr-m-0 fr-text--xs text-mention-grey f-italic inline-flex items-center space-x-1">
              <Icon
                class="size-3"
                name="ri:mail-line"
              />
              <TextClamp
                class="fr-px-1v"
                :text="member.user.email"
                :auto-resize="true"
                :max-lines="1"
              />
            </p>
          </td>
          <td>
            <AdminBadge :type="getStatusType(member.role)">
              {{ getStatus(member.role) }}
            </AdminBadge>
          </td>
          <td>{{ formatDate(member.since) }}</td>
          <td>
            <span v-if="member.user.last_login_at">{{ formatFromNow(member.user.last_login_at) }}</span>
            <span v-else>{{ t("No connection") }}</span>
          </td>
          <td v-if="isOrgAdmin">
            <ModalWithButton
              :title="$t('Edit member')"
              size="lg"
              @open="newRole = member.role"
            >
              <template #button="{ attrs, listeners }">
                <button
                  class="fr-btn fr-btn--sm fr-btn--secondary-grey-500 fr-btn--tertiary-no-outline fr-icon-pencil-line"
                  v-bind="attrs"
                  v-on="listeners"
                >
                  {{ t("Edit") }}
                </button>
              </template>

              <template #default="{ close }">
                <div class="fr-grid-row fr-grid-row--middle fr-mb-2w">
                  <Avatar
                    class="fr-mr-1v"
                    :user="member.user"
                    :rounded="true"
                    :size="24"
                  />
                  <p class="fr-text--bold fr-m-0 fr-mr-1v">
                    {{ member.user.first_name }} {{ member.user.last_name }}
                  </p>
                  <AdminEmail
                    v-if="member.user.email"
                    :email="member.user.email"
                  />
                </div>

                <form
                  class="fr-grid-row fr-grid-row--gutters fr-grid-row--bottom"
                  @submit.prevent="updateRole(member, close)"
                >
                  <div class="fr-col">
                    <SelectGroup
                      v-if="roles.length > 0"
                      v-model="newRole"
                      :label="t('Role of the member')"
                      :options="rolesOptions"
                    />
                  </div>
                  <div class="fr-col-auto">
                    <button
                      class="fr-btn"
                      type="submit"
                      :disabled="loading"
                    >
                      {{ t("Validate") }}
                    </button>
                  </div>
                </form>

                <AdminDangerZone
                  class="fr-mt-2w"
                >
                  <div class="fr-col">
                    <p class="fr-m-0 text-grey-500">
                      {{ t('Remove member from the organization') }}
                    </p>
                    <p class="fr-m-0 fr-text--xs text-default-error">
                      {{ t("Be careful, this action can't be reverse.") }}
                    </p>
                  </div>
                  <div class="fr-col-auto">
                    <button
                      class="fr-btn fr-btn--secondary fr-btn--secondary--error fr-btn--icon-left fr-icon-logout-box-r-line"
                      :disabled="loading"
                      @click="removeMemberFromOrganization(member, close)"
                    >
                      {{ t('Remove member') }}
                    </button>
                  </div>
                </AdminDangerZone>
              </template>
            </ModalWithButton>
          </td>
        </tr>
      </tbody>
    </AdminTable>
  </div>
</template>

<script setup lang="ts">
import { Avatar, formatDate, formatFromNow, type Member, type Organization, type User } from '@datagouv/components'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AdminBadgeState, EditingMember, MemberRole, PaginatedArray, PendingMembershipRequest, UserSuggest } from '~/types/types'
import TextClamp from '~/components/TextClamp.vue'
import AdminTable from '~/components/AdminTable/Table/AdminTable.vue'
import AdminTableTh from '~/components/AdminTable/Table/AdminTableTh.vue'
import Tooltip from '~/components/Tooltip/Tooltip.vue'
import ModalClient from '~/components/Modal/Modal.client.vue'
import ModalWithButton from '~/components/Modal/ModalWithButton.vue'
import AdminDangerZone from '~/components/AdminDangerZone/AdminDangerZone.vue'
import SelectGroup from '~/components/Form/SelectGroup/SelectGroup.vue'
import SearchableSelect from '~/components/SearchableSelect.vue'

const config = useRuntimeConfig()
const { t } = useI18n()
const { $api } = useNuxtApp()

const membershipRequests = ref<Array<PendingMembershipRequest>>([])

const me = useMe()

const isOrgAdmin = computed(() => isAdmin(me.value) || members.value.some(member => member.user.id === me.value.id && member.role === 'admin'))

const { currentOrganization } = useCurrentOrganization()

const url = computed(() => {
  if (!currentOrganization.value) {
    throw 'Cannot load this component outside organization URL.'
  }
  const url = new URL(`/api/1/organizations/${currentOrganization.value.id}`, config.public.apiBase)
  return url.toString()
})

const { data: organization, status, refresh } = await useAPI<Organization>(url, { lazy: true })

const newRole = ref<MemberRole | null>(null)
const { data: roles } = await useAPI<Array<{ id: MemberRole, label: string }>>('/api/1/organizations/roles/', { lazy: true })
const rolesOptions = computed(() => {
  if (!roles) return []

  return roles.value.map(role => ({
    label: role.label,
    value: role.id,
  }))
})
const loading = ref(false)

function getStatus(role: MemberRole): string {
  return roles.value.find(memberRole => memberRole.id === role)?.label ?? role
}

function getStatusType(role: MemberRole): AdminBadgeState {
  return role === 'admin' ? 'info' : 'default'
}

async function updateMemberships() {
  // const memberships = await getPendingMemberships(props.oid);
  // membershipRequests.value = memberships;
}

async function accept(id: string) {
  loading.value = true
  const promises = []
  try {
    //   await acceptRequest(props.oid, id);
    promises.push(updateMemberships())
  }
  catch (e) {
    //   toast.error(t("An error occurred while accepting this membership."));
  }
  finally {
    Promise.all(promises).finally(() => loading.value = false)
  }
}

async function refuse(id: string, comment: string) {
  loading.value = true
  const promises = []
  try {
    //   await refuseRequest(props.oid, id, comment);
    promises.push(updateMemberships())
    promises.push(updateMembers())
  }
  catch {
    //   toast.error(t("An error occurred while refusing this membership."));
  }
  finally {
    Promise.all(promises).finally(() => loading.value = false)
  }
}

const removeMemberFromOrganization = async (member: Member, close: () => void) => {
  try {
    loading.value = true
    await $api(`/api/1/organizations/${currentOrganization.value.id}/member/${member.user.id}`, { method: 'DELETE' })
    await refresh()
    close()
  }
  catch {
    // toast.error(t('An error occurred while removing this member.'))
  }
  finally {
    loading.value = false
  }
}

const updateRole = async (member: Member, close) => {
  if (member.role === newRole.value) {
    close()
    return
  }

  try {
    loading.value = true
    await $api(`/api/1/organizations/${currentOrganization.value.id}/member/${member.user.id}`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole.value }),
    })
    await refresh()
    close()
  }
  catch {
    // toast.error(t('An error occurred while update member role.'))
  }
  finally {
    loading.value = false
  }
}

//   watchEffect(() => {
//     if(isOrgAdmin.value) {
//       getPendingMemberships(props.oid).then(requests => membershipRequests.value = requests);
//     }
//   });

//   onMounted(() => {
//     getRoles().then(formatRolesAsOptions).then(options => roles.value = options);
//     updateMembers();
//   });

const suggestUser = async (query: string): Promise<Array<UserSuggest>> => {
  return await $api<Array<UserSuggest>>('/api/1/users/suggest/', {
    query: {
      q: query,
      size: 5,
    },
  })
}

const addForm = ref({
  role: null as MemberRole | null,
  user: null as UserSuggest | null,
})
</script>
