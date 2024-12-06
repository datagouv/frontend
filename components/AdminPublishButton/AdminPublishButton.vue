<template>
  <NuxtLinkLocale
    v-if="!config.public.readOnlyMode"
    :to="link"
    class="fr-btn fr-icon-add-line fr-btn--icon-left"
  >
    <span>{{ t("Publish on") }}</span>
    <SiteLogo
      class="ml-1.5 mt-0.5 h-4"
      white
    />
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const props = defineProps<{
  type: 'dataset' | 'harvester' | 'reuse' | 'dataservice'
}>()

const { t } = useI18n()

const config = useRuntimeConfig()

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
