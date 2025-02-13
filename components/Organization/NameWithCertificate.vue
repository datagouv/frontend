<template>
  <div class="flex gap-1 items-center">
    <OwnerTypeIcon
      v-if="showType"
      :type="type"
    />
    <div class="mb-0 overflow-hidden text-ellipsis whitespace-nowrap">
      {{ organization.name }}
    </div>
    <RiCheckboxCircleLine
      v-if="organizationCertified"
      class="size-5 flex-none"
      :title="t('The identity of this public service is certified by {certifier}', { certifier })"
      aria-hidden="true"
    />
  </div>
</template>

<script lang="ts">
</script>

<script setup lang="ts">
import { OwnerTypeIcon, useOrganizationCertified, useOrganizationType, type Organization } from '@datagouv/components'
import { RiCheckboxCircleLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = withDefaults(defineProps<{
  organization: Organization
  showType?: boolean
  certifier: string
}>(), {
  showType: true,
})
const { type } = useOrganizationType(props.organization)
const { organizationCertified } = useOrganizationCertified(props.organization)
</script>
