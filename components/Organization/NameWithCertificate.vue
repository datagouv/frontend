<template>
  <div class="flex gap-1 items-center">
    <OwnerTypeIcon
      v-if="showType"
      :type="type"
    />
    <div
      class="mb-0 overflow-hidden text-ellipsis whitespace-nowrap"
      :class="{ 'text-sm': size === 'sm' }"
    >
      {{ organization.name }}
    </div>
    <RiCheckboxCircleLine
      v-if="organizationCertified"
      class="flex-none"
      :class="{
        'size-4': size === 'sm',
        'start-5': size === 'base',
      }"
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
  size?: 'base' | 'sm'
}>(), {
  showType: true,
  size: 'base',
})
const { type } = useOrganizationType(props.organization)
const { organizationCertified } = useOrganizationCertified(props.organization)
</script>
