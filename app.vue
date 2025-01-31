<template>
  <NuxtLoadingIndicator color="var(--blue-cumulus-main-526)" />
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import '@gouvfr/dsfr/dist/dsfr.css'
import '@gouvfr/dsfr/dist/utility/utility.css'
import '@datagouv/components/dist/style.css'
import '~/assets/css/overrides.css'
import { setupComponents, setupI18nWithExistingInstance } from '@datagouv/components'

const app = useNuxtApp()

const i18nHead = useLocaleHead()

setupComponents({
  default_lang: app.$i18n.locale.value,
})

setupI18nWithExistingInstance({ global: app.$i18n })

useHeadSafe({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang,
  },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])],
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - data.gouv.fr` : 'data.gouv.fr'
  },
})
</script>
