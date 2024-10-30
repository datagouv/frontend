<template>
  <div class="relative container drop-shadow rounded-xxs py-6">
    <div class="absolute -mt-9">
      <p class="fr-badge fr-badge--info fr-badge--no-icon">
        <span
          class="fr-icon-user-add-line fr-icon--sm"
          aria-hidden="true"
        />
        {{ t("Membership Request") }}
      </p>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col">
        <div class="fr-grid-row fr-grid-row--middle">
          <Avatar
            class="fr-mr-1v"
            :user="request.user"
            :rounded="true"
            :size="24"
          />
          <p class="fr-text--bold fr-m-0 fr-mr-1v">
            {{ request.user.first_name }} {{ request.user.last_name }}
          </p>
          <AdminEmail
            v-if="request.user.email"
            :email="request.user.email"
            class="fr-mr-1v"
          />
          <p class="fr-m-0">
            {{ t("asks to join the organization.") }}
          </p>
        </div>
        <div class="fr-ml-3v fr-mt-1-5v fr-mb-0 filet filet-default-grey fr-text--sm">
          {{ request.comment }}
        </div>
      </div>
      <div
        v-if="showActions"
        class="fr-col-auto fr-grid-row flex-direction-column"
      >
        <button
          class="fr-btn fr-btn--sm fr-btn--icon-left fr-mb-1w fr-icon-check-line"
          :disabled="loading"
          @click="accept"
        >
          {{ t("Accept request") }}
        </button>

        <ModalWithButton
          :title="t('Refuse membership request')"
          size="lg"
          @open="refuseComment = ''"
        >
          <template #button="{ attrs, listeners }">
            <button
              class="fr-btn fr-btn--icon-left fr-btn--sm fr-btn--secondary fr-btn--secondary--error fr-icon-close-line"
              :disabled="loading"
              v-bind="attrs"
              v-on="listeners"
            >
              {{ t("Refuse") }}
            </button>
          </template>

          <template #default="{ close }">
            <AdminMembershipRequest
              class="mb-5"
              :loading="false"
              :oid="oid"
              :request="request"
              :show-actions="false"
            />
            <form
              :id="refuseFormId"
              @submit.prevent="refuse(close)"
            >
              <InputGroup
                v-model="refuseComment"
                :label="t('You can provide the refusal reason:')"
              />
            </form>
          </template>

          <template #footer="{ close }">
            <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--right">
              <div class="fr-col-auto">
                <button
                  class="fr-btn fr-btn--secondary fr-btn--secondary-grey-500"
                  type="button"
                  :disabled="loading"
                  @click="close"
                >
                  {{ t("Cancel") }}
                </button>
              </div>
              <div class="fr-col-auto">
                <button
                  class="fr-btn"
                  type="submit"
                  :disabled="loading || !refuseComment"
                  :form="refuseFormId"
                >
                  {{ t("Refuse request") }}
                </button>
              </div>
            </div>
          </template>
        </ModalWithButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Avatar } from '@datagouv/components'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AdminEmail from '../AdminEmail.vue'
import InputGroup from '../InputGroup/InputGroup.vue'
import ModalWithButton from '../Modal/ModalWithButton.vue'
import type { PendingMembershipRequest } from '~/types/types'

const props = defineProps<{
  oid: string
  request: PendingMembershipRequest
  showActions: boolean
}>()
const emits = defineEmits<{
  (e: 'refresh'): void
}>()

const { t } = useI18n()
const { $api } = useNuxtApp()
const loading = ref(false)

const accept = async () => {
  try {
    loading.value = true
    await $api(`/api/1/organizations/${props.oid}/membership/${props.request.id}/accept`, {
      method: 'POST',
    })
    emits('refresh')
  }
  catch {
    // toast.error(t('An error occurred while refusing this membership.'))
  }
  finally {
    loading.value = false
  }
}

const refuseFormId = useId()
const refuseComment = ref('')
const refuse = async (close) => {
  try {
    loading.value = true
    await $api(`/api/1/organizations/${props.oid}/membership/${props.request.id}/refuse`, {
      method: 'POST',
      body: JSON.stringify({ comment: refuseComment.value }),
    })
    emits('refresh')
    close()
  }
  catch {
    // toast.error(t('An error occurred while refusing this membership.'))
  }
  finally {
    loading.value = false
  }
}
</script>
