<template>
  <a
    :href="link"
    class="fr-btn fr-icon-add-line fr-btn--icon-left"
  >
    <span>{{ t("Publish on") }}</span>
    <SiteLogo
      class="ml-1.5 mt-0.5 h-4"
      white
    />
  </a>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const props = defineProps<{
  type: 'dataset' | 'harvester' | 'reuse'
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const link = computed(() => {
  switch (props.type) {
    case 'dataset':
      return localePath('/newadmin/datasets/new')
    case 'harvester':
      return ''
      // return `${admin_root}harvester/new/`;
    case 'reuse':
      return ''
      // return reuse_publishing_form_url;
    default:
      throwOnNever(props.type, '')
      return ''
  }
})
</script>
