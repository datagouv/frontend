<template>
  <ClientOnly>
    <Datepicker v-bind="$attrs" />
  </ClientOnly>
</template>

<script setup lang="ts">
import Datepicker from 'vue3-datepicker'

defineOptions({ inheritAttrs: false })
</script>
