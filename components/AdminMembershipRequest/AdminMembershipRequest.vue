<template>
  <BannerNotif
    type="primary"
    :icon="RiUserAddLine"
    :badge="$t('Membership Request')"
    :user="request.user"
    :date="new Date(request.created)"
  >
    <template #title>
      <code
        v-if="request.user.email"
        class="text-gray-medium bg-gray-lower px-1 text-sm rounded-sm"
      >{{ request.user.email }}</code>
      {{ t("asks to join the organization.") }}
    </template>

    <template #body>
      {{ request.comment }}
    </template>

    <template #buttons>
      <BrandedButton
        v-if="showActions"
        color="primary"
        size="xs"
        :icon="RiCheckLine"
        @click="accept"
      >
        {{ $t('Accept request') }}
      </BrandedButton>
      <ModalWithButton
        v-if="showActions"
        :title="t('Refuse membership request')"
        size="lg"
        @open="refuseComment = ''"
      >
        <template #button="{ attrs, listeners }">
          <BrandedButton
            color="danger"
            size="xs"
            :disabled="loading"
            v-bind="attrs"
            v-on="listeners"
          >
            {{ t("Refuse") }}
          </BrandedButton>
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
                class="fr-btn fr-btn--secondary fr-btn--secondary-gray-500"
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
    </template>
  </BannerNotif>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiCheckLine, RiUserAddLine } from '@remixicon/vue'
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
