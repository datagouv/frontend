<template>
  <div class="pb-14">
    <h2 class="!text-sm !mb-2.5">
      {{ $t('Organization description') }}
    </h2>
    <MarkdownViewer
      :content="organization.description"
      :min-heading="3"
    />
  </div>
</template>

<script setup lang="ts">
import type { Organization } from '@datagouv/components'

defineProps<{
  organization: Organization
}>()
</script>
