<template>
  <BannerAction
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
          <BrandedButton
            :icon="RiSendPlaneLine"
            v-bind="attrs"
            v-on="listeners"
          >
            {{ $t('Transfer') }}
          </BrandedButton>
        </template>
        <div
          v-if="!existingTransfers"
          class="flex items-center justify-center"
        >
          <AdminLoader class="size-20" />
        </div>
        <div
          v-else-if="existingTransfers.length"
          class="space-y-2"
        >
          <div
            v-for="existingTransfer in existingTransfers"
            :key="existingTransfer.id"
          >
            {{ $t('Transfer to {recipient} already requested the {date}', {
              recipient: existingTransfer.recipient.class === 'Organization'
                ? existingTransfer.recipient.name : `${existingTransfer.recipient.first_name} ${existingTransfer.recipient.last_name}`,
              date: formatDate(existingTransfer.created),
            }) }}
            <span v-if="existingTransfer.user">{{ $t('by {user}', { user: `${existingTransfer.user.first_name} ${existingTransfer.user.last_name}` }) }}</span>
          </div>
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
        <template #footer="{ close }">
          <div
            v-if="existingTransfers && !existingTransfers.length"
            class="flex-1 fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left"
          >
            <BrandedButton
              color="primary"
              :loading
              :icon="RiSendPlaneLine"
              @click="requestTransfer(close)"
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
import { formatDate, type Dataservice, type Dataset, type DatasetV2, type Reuse } from '@datagouv/components'
import type { Owned } from '@datagouv/components/ts'
import { RiSendPlaneLine } from '@remixicon/vue'
import BrandedButton from './BrandedButton/BrandedButton.vue'
import type { LinkToSubject, TransferRequest } from '~/types/types'

const props = defineProps<{
  type: 'Dataservice' | 'Dataset' | 'Reuse'
  subject: (LinkToSubject & Dataservice) | Dataset | DatasetV2 | Reuse
  label: string
}>()

const { $api } = useNuxtApp()
const { toast } = useToast()
const { t } = useI18n()

const loading = ref(false)
const to = ref<Owned | null>(null)
const comment = ref('')
const existingTransfers = ref<Array<TransferRequest> | null>(null)

async function fetchTransfer() {
  if (existingTransfers.value) return

  try {
    existingTransfers.value = await $api<Array<TransferRequest>>('/api/1/transfer/', {
      query: {
        subject: props.subject.id,
        status: 'pending',
      },
    })
  }
  catch {
    existingTransfers.value = [] // Do not block the feature if fail
  }
}

async function requestTransfer(close: () => void) {
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

    const transfer = await $api<TransferRequest>('/api/1/transfer/', {
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

    close()
    toast.success(t('Transfer requested. A notification has been sent to the recipient.'))
  }
  finally {
    loading.value = false
  }
}
</script>
