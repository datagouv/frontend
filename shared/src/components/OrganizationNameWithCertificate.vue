<template>
  <div class="flex gap-1 items-center">
    <OwnerTypeIcon
      v-if="showType"
      :type="getOrganizationType(organization)"
    />
    <component
      :is="config.textClamp"
      v-if="config && config.textClamp"
      class="fr-mx-1v"
      :auto-resize="true"
      :text="organization.name"
      :max-lines="1"
    />
    <RiCheckboxCircleLine
      v-if="isOrganizationCertified(organization)"
      class="size-5 flex-none"
      :title="t('The identity of this public service is certified by {certifier}', { certifier: config.name })"
      aria-hidden="true"
    />
    {{ $t('AAA') }}
    {{ t('AAA') }}
  </div>
</template>

<script setup lang="ts">
import { RiCheckboxCircleLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import { getOrganizationType, isOrganizationCertified } from '../functions/organizations'
import type { Organization } from '../types/organizations'
import { useComponentsConfig } from '../main'
import OwnerTypeIcon from './OwnerTypeIcon.vue'

const config = useComponentsConfig()

const { t } = useI18n()
withDefaults(defineProps<{
  organization: Organization
  showType?: boolean
}>(), {
  showType: true,
})
</script>
