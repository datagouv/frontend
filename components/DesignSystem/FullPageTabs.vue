<template>
  <FullPageTabs
    :links="[
      { label: $t('Presentation'), href: '/design/' },
      { label: $t('Datasets'), href: getOrganizationUrl('datasets') },
      { label: $t('Dataservices'), href: getOrganizationUrl('dataservices') },
      { label: $t('Reuses'), href: getOrganizationUrl('reuses') },
      { label: $t('Information'), href: getOrganizationUrl('Information') },
    ]"
  />
</template>

<script setup lang="ts">
import FullPageTabs from '~/components/FullPageTabs/FullPageTabs.vue'

function getOrganizationUrl(tab?: string) {
  return tab ? `/organizations/someId/${tab}/` : `/organizations/someId/`
}
</script>
