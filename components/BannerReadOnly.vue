<template>
  <BannerSticky
    v-if="config.public.readOnlyMode"
    type="warning"
  >
    {{ $t('Due to security reasons, the creation of new content is currently disabled.') }}
  </BannerSticky>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
</script>
