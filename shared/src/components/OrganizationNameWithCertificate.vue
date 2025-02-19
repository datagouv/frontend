<template>
  <div class="flex gap-1 items-center">
    <OwnerTypeIcon
      v-if="showType"
      :type="getOrganizationType(organization)"
    />
    <TextClamp
      class="fr-mx-1v"
      :auto-resize="true"
      :text="organization.name"
      :max-lines="1"
    />
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
import TextClamp from 'vue3-text-clamp'
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
