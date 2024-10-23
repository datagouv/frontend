<template>
  <div>
    <SiteHeader />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import '@gouvfr/dsfr/dist/dsfr.css'
import '@gouvfr/dsfr/dist/utility/utility.css'
import '~/assets/css/overrides.css'

provideHeadlessUseId(() => useId())

</script>
