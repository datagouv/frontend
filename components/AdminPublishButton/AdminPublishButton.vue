<template>
  <NuxtLinkLocale
    :to="link"
    :external="type === 'harvester'"
    class="fr-btn fr-icon-add-line fr-btn--icon-left"
  >
    <span v-if="type === 'harvester'">{{ t("Create an harvester on") }}</span>
    <span v-else>{{ t("Publish on") }}</span>
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

const link = computed(() => {
  switch (props.type) {
    case 'dataset':
      return '/beta/admin/datasets/new'
    case 'harvester':
      return `/admin/harvester/new/`
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
