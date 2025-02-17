<template>
  <div class="flex gap-1 items-center">
    <OwnerTypeIcon
      v-if="showType"
      :type="getOrganizationType(organization)"
    />
    <p class="mb-0 overflow-hidden text-ellipsis whitespace-nowrap">
      {{ organization.name }}
    </p>
    <RiCheckboxCircleLine
      v-if="isOrganizationCertified(organization)"
      class="size-5 flex-none"
      :title="t('The identity of this public service is certified by {certifier}', { certifier })"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { RiCheckboxCircleLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import { getOrganizationType, isOrganizationCertified } from '../functions/organizations'
import type { Organization } from '../types/organizations'
import OwnerTypeIcon from './OwnerTypeIcon.vue'

const { t } = useI18n()
withDefaults(defineProps<{
  organization: Organization
  showType?: boolean
  certifier: string
}>(), {
  showType: true,
})
</script>
