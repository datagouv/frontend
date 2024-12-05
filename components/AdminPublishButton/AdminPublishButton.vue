<template>
  <BrandedButton
    :href="link"
    color="primary"
  >
    {{ t("Publish on") }}
    <SiteLogo />
  </BrandedButton>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const props = defineProps<{
  type: 'dataset' | 'harvester' | 'reuse' | 'dataservice'
}>()

const { t } = useI18n()

const link = computed(() => {
  switch (props.type) {
    case 'dataset':
      return '/beta/admin/datasets/new'
    case 'harvester':
      return ''
      // return `${admin_root}harvester/new/`;
    case 'reuse':
      return '/beta/admin/reuses/new'
    case 'dataservice':
      return '/beta/admin/dataservices/new'
    default:
      throwOnNever(props.type, '')
      return ''
  }
})
</script>
