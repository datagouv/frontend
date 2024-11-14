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
</script>
