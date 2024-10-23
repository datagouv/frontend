<template>
  <div class="datagouv-components">
    <SiteHeader />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import '@gouvfr/dsfr/dist/dsfr.css'
import '@gouvfr/dsfr/dist/utility/utility.css'
import '@datagouv/components/dist/style.css'
import '~/assets/css/overrides.css'

provideHeadlessUseId(() => useId())

const me = useMaybeMe();
await callOnce(async () => await refreshMe(me))
</script>
