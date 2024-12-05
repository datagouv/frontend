<template>
  <div>
    <BannerNotif
      type="warning"
      :icon="RiSendPlaneLine"
      class="mb-4"
      :badge="$t('Pending transfer')"
      :user="transfer.user || transfer.owner"
      :date="new Date(transfer.created)"
    >
      <template #title>
        <a
          v-if="transfer.user"
          :href="transfer.user.page"
          class="link"
        >{{ transfer.user.first_name }} {{ transfer.user.last_name }}</a>
        <a
          v-else-if="transfer.owner.class === 'User'"
          :href="transfer.owner.page"
          class="link"
        >{{ transfer.owner.first_name }} {{ transfer.owner.last_name }}</a>
        <a
          v-else-if="transfer.owner.class === 'Organization'"
          :href="transfer.owner.page"
          class="link"
        >{{ transfer.owner.name }}</a>

        {{ $t('has requested a transfer') }}
      </template>
      <template #subtitle>
        <LinkToSubject
          :type="transfer.subject.class"
          :subject="transfer.subject"
        />
        &nbsp;
        <template v-if="transfer.recipient.class === 'Organization'">
          {{ $t('to your organization') }}
          <a
            :href="transfer.recipient.page"
            class="link"
          >{{ transfer.recipient.name }}</a>
        </template>
        <template v-if="transfer.recipient.class === 'User'">
          {{ $t('to') }}
          <a
            :href="transfer.recipient.page"
            class="link"
          >{{ transfer.recipient.first_name }} {{ transfer.recipient.last_name }}</a>
        </template>
      </template>

      <template #body>
        {{ transfer.comment }}
      </template>

      <template #buttons>
        <BrandedButton
          v-if="showActions"
          color="primary"
          size="xs"
          :icon="RiCheckLine"
          :aria-controls="modalId"
          @click="isOpen = true"
        >
          {{ $t('Accept') }}
        </BrandedButton>
        <BrandedButton
          v-if="showActions"
          color="danger"
          size="xs"
          :icon="RiCloseLine"
          :aria-controls="modalId"
          @click="isOpen = true"
        >
          {{ $t('Refuse') }}
        </BrandedButton>
      </template>
    </BannerNotif>
    <ModalClient
      :modal-id="modalId"
      :opened="isOpen"
      :title="$t('Pending transfer')"
      size="lg"
      @close="isOpen = false"
    >
      <TransferRequest
        :transfer
        :show-actions="false"
      />

      <InputGroup
        v-model="comment"
        type="textarea"
        :label="$t('Comment')"
      />

      <template #footer>
        <div class="w-full flex justify-end space-x-4">
          <BrandedButton
            color="primary"
            size="xs"
            :icon="RiCheckLine"
            :aria-controls="modalId"
            @click="respond('accept')"
          >
            {{ $t('Accept') }}
          </BrandedButton>
          <BrandedButton
            color="danger"
            size="xs"
            :icon="RiCloseLine"
            :aria-controls="modalId"
            @click="respond('refuse')"
          >
            {{ $t('Refuse') }}
          </BrandedButton>
        </div>
      </template>
    </ModalClient>
  </div>
</template>

<script setup lang="ts">
import { RiCheckLine, RiCloseLine, RiSendPlaneLine } from '@remixicon/vue'
import ModalClient from './Modal/Modal.client.vue'
import type { TransferRequest } from '~/types/types'

const props = withDefaults(defineProps<{
  transfer: TransferRequest
  showActions?: boolean
}>(), {
  showActions: true,
})
const emit = defineEmits<{
  (e: 'done'): void
}>()

const { $api } = useNuxtApp()

const modalId = useId()
const isOpen = ref(false)
const loading = ref(false)
const comment = ref('')

const respond = async (response: 'accept' | 'refuse') => {
  loading.value = true
  try {
    await $api(`/api/1/transfer/${props.transfer.id}/`, {
      method: 'POST',
      body: JSON.stringify({
        comment: comment.value,
        response,
      }),
    })
    isOpen.value = false
    emit('done')
  }
  finally {
    loading.value = false
  }
}
</script>
