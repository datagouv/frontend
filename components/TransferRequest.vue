<template>
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
        color="primary"
        size="xs"
        :icon="RiCheckLine"
      >
        {{ $t('Accept') }}
      </BrandedButton>
      <BrandedButton
        color="danger"
        size="xs"
        :icon="RiCloseLine"
      >
        {{ $t('Refuse') }}
      </BrandedButton>
    </template>
  </BannerNotif>
</template>

<script setup lang="ts">
import { RiCheckLine, RiCloseLine, RiSendPlaneLine } from '@remixicon/vue'
import type { TransferRequest } from '~/types/types'

defineProps<{
  transfer: TransferRequest
}>()
</script>
