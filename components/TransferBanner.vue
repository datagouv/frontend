<template>
  <BannerAction
    class="w-7/12"
    type="primary"
    :title="label"
  >
    {{ $t("Be careful, this action can't be reverse.") }}

    <template #button>
      <ModalWithButton
        :title="label"
        size="lg"
        @open="fetchTransfer"
      >
        <template #button="{ attrs, listeners }">
          <BannerActionButton
            :icon="RiSendPlaneLine"
            v-bind="attrs"
            v-on="listeners"
          >
            {{ $t('Transfer') }}
          </BannerActionButton>
        </template>
        <div
          v-if="!existingTransfers"
          class="flex items-center justify-center"
        >
          <AdminLoader class="size-20" />
        </div>
        <div v-else-if="existingTransfers.length">
          <TransferRequest
            v-for="transfer in existingTransfers"
            :key="transfer.id"
            :transfer
          />
        </div>
        <div
          v-else
          class="space-y-4"
        >
          <LinkToSubject
            :type
            :subject
          />
          <p>
            <span class="font-bold">{{ $t("This action can't be reverse.") }}</span>
            <span>{{ $t("You will no longer have access to manage this dataset.") }}</span>
          </p>
          <ProducerSelect
            v-model="to"
            :label="$t('Search an organization or a user')"
            all
          />
          <InputGroup
            v-model="comment"
            type="textarea"
            :label="$t('Comment')"
          />
        </div>
        <template #footer>
          <div
            v-if="existingTransfers && !existingTransfers.length"
            class="flex-1 fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left"
          >
            <BrandedButton
              color="primary"
              :disabled="loading"
              :icon="RiSendPlaneLine"
              @click="transfer"
            >
              {{ label }}
            </BrandedButton>
          </div>
        </template>
      </ModalWithButton>
    </template>
  </BannerAction>
</template>

<script setup lang="ts">
import type { Dataset, DatasetV2 } from '@datagouv/components'
import type { Owned } from '@datagouv/components/ts'
import { RiSendPlaneLine } from '@remixicon/vue'
import type { TransferRequest } from '~/types/types'

const props = defineProps<{
  type: 'Dataset'
  subject: Dataset | DatasetV2
  label: string
}>()

const { $api } = useNuxtApp()

const loading = ref(false)
const to = ref<Owned | null>(null)
const comment = ref('')
const existingTransfers = ref<Array<TransferRequest> | null>(null)

const fetchTransfer = async () => {
  if (existingTransfers.value) return

  try {
    existingTransfers.value = await $api<Array<TransferRequest>>('/api/1/transfer', {
      query: {
        subject: props.subject.id,
      },
    })
  }
  finally {
    existingTransfers.value = [] // Do not block the feature if fail
  }
}

const transfer = async () => {
  loading.value = true
  try {
    if (!to.value) return
    let recipient
    if (to.value.organization) {
      recipient = { class: 'Organization', id: to.value.organization.id }
    }
    else {
      recipient = { class: 'User', id: to.value.owner.id }
    }

    const transfer = await $api<TransferRequest>('/api/1/transfer', {
      method: 'POST',
      body: JSON.stringify({
        comment: comment.value,
        subject: {
          class: props.type,
          id: props.subject.id,
        },
        recipient,
      }),
    })

    existingTransfers.value = [transfer]
  }
  finally {
    loading.value = false
  }
}
</script>
