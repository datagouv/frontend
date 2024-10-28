<template>
    <div>
        <Breadcrumb>
        <li>
          <NuxtLinkLocale class="fr-breadcrumb__link" to="/newadmin">
            {{ t('Administration') }}
          </NuxtLinkLocale>
        </li>
        <li v-if="currentOrganization">
          <NuxtLinkLocale class="fr-breadcrumb__link" to="/newadmin">
            {{ currentOrganization.name }}
          </NuxtLinkLocale>
        </li>
        <li>
          <a class="fr-breadcrumb__link" aria-current="page">
            {{ t('Members') }}
          </a>
        </li>
      </Breadcrumb>
      <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle justify-center">
        <div class="fr-col-12 fr-col-md">
          <h1 class="fr-h3 fr-mb-0">{{ t("Members") }}</h1>
        </div>
        <!-- <div class="fr-col-auto" v-if="isOrgAdmin">
          <AdminAddMemberButton
            :oid="oid"
            :roles="roles"
            @member-added="updateMembers"
          />
        </div> -->
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
        class="subtitle subtitle--uppercase fr-mb-0"
        v-if="organization"
        :class="{'fr-mt-n3v': membershipRequests.length, 'fr-mt-5v': !membershipRequests.length}"
      >
        {{ t("{n} members", {n: organization.members.length}) }}
      </h2>
      <AdminTable class="fr-table--layout-fixed" :loading>
        <thead>
          <tr>
            <AdminTableTh scope="col">{{ t("Members") }}</AdminTableTh>
            <AdminTableTh scope="col">{{ t("Status") }}</AdminTableTh>
            <AdminTableTh scope="col">{{ t("Member since") }}</AdminTableTh>
            <AdminTableTh scope="col">{{ t("Last connection") }}</AdminTableTh>
            <AdminTableTh scope="col" v-if="isOrgAdmin">{{ t("Action") }}</AdminTableTh>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in organization?.members || []" :key="member.user.id">
            <td>
              <p class="fr-text--bold fr-m-0">{{ member.user.first_name }} {{ member.user.last_name }}</p>
              <p class="fr-m-0 fr-text--xs text-mention-grey f-italic inline-flex items-center space-x-1">
                <Icon
                  class="size-3"
                  name="ri:mail-line"
                />
                <TextClamp class="fr-px-1v" :text="member.user.email" :auto-resize="true" :max-lines="1" />
              </p>
            </td>
            <td>
              <AdminBadge :type="getStatusType(member.role)">{{ getStatus(member.role) }}</AdminBadge>
            </td>
            <td>{{ formatDate(member.since) }}</td>
            <td>
              <span v-if="member.user.last_login_at">{{ formatFromNow(member.user.last_login_at) }}</span>
              <span v-else>{{ t("No connection") }}</span>
            </td>
            <td v-if="isOrgAdmin">
                <NativeModal>
                    <template #button="{ attrs }">
                        <button class="fr-btn fr-btn--sm fr-btn--secondary-grey-500 fr-btn--tertiary-no-outline fr-icon-pencil-line" v-bind="attrs">
                            {{ t("Edit") }}
                        </button>
                    </template>

                    <template #title>
                        {{ t("Edit member") }}
                    </template>

                    Toto
                </NativeModal>

              <!-- <AdminEditMemberButton
                :member="member"
                :oid="oid"
                :roles="roles"
                @member-updated="updateMembers"
              /> -->
            </td>
          </tr>
        </tbody>
      </AdminTable>
    </div>
  </template>
  
  <script setup lang="ts">
  import { formatDate, formatFromNow, type Organization } from '@datagouv/components';
  import { computed, onMounted, ref, watchEffect } from "vue";
  import { useI18n } from "vue-i18n";
import type { AdminBadgeState, EditingMember, MemberRole, PaginatedArray, PendingMembershipRequest } from '~/types/types';
import TextClamp from '~/components/TextClamp.vue';
import AdminTable from '~/components/AdminTable/Table/AdminTable.vue';
import AdminTableTh from '~/components/AdminTable/Table/AdminTableTh.vue';
import Tooltip from '~/components/Tooltip/Tooltip.vue';

const config = useRuntimeConfig()
  const { t } = useI18n();
  const membershipRequests = ref<Array<PendingMembershipRequest>>([]);

    const me = useMe();
  
  const isOrgAdmin = computed(() => isAdmin(me.value) || members.value.some(member => member.user.id === me.value.id && member.role === "admin"));
  
  const roles = ref<Array<any>>([]);
  
  const { currentOrganization } = useCurrentOrganization();
  
  const url = computed(() => {
    if (! currentOrganization.value) {
        throw "Cannot load this component outside organization URL."
    }
    let url = new URL(`/api/1/organizations/${currentOrganization.value.id}`, config.public.apiBase);
    return url.toString()
  })
  
  const { data: organization, status } = await useAPI<Organization>(url, { lazy: true });
  
  const loading = ref(false);
  
  function getStatus(role: MemberRole): string {
    return roles.value.find(memberRole => memberRole.value === role)?.label ?? role;
  }
  
  function getStatusType(role: MemberRole): AdminBadgeState {
    return role === "admin" ? 'info' : 'default';
  }
  
  async function updateMembers() {
    loading.value = true;
    members.value = [];
    try {
    //   const organization = await getOrganization(props.oid);
    //   members.value = organization.members;
    } finally {
      loading.value = false;
    }
  }
  
  async function updateMemberships() {
    // const memberships = await getPendingMemberships(props.oid);
    // membershipRequests.value = memberships;
  }
  
  async function accept(id: string) {
    loading.value = true;
    const promises = [];
    try {
    //   await acceptRequest(props.oid, id);
      promises.push(updateMemberships());
      promises.push(updateMembers());
    } catch(e) {
    //   toast.error(t("An error occurred while accepting this membership."));
    } finally {
      Promise.all(promises).finally(() => loading.value = false);
    }
  }
  
  async function refuse(id: string, comment: string) {
    loading.value = true;
    const promises = [];
    try {
    //   await refuseRequest(props.oid, id, comment);
      promises.push(updateMemberships());
      promises.push(updateMembers());
    } catch(e) {
    //   toast.error(t("An error occurred while refusing this membership."));
    } finally {
      Promise.all(promises).finally(() => loading.value = false);
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
  </script>
  