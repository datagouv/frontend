<template>
  <BrandedButton
    color="danger"
    :href="`/beta/admin/${type}/${id}/`"
    :icon="RiEdit2Line"
    size="xs"
  >
    {{ $t('Edit') }}
  </BrandedButton>
</template>

<script setup lang="ts">
import { RiEdit2Line } from '@remixicon/vue'

defineProps<{
  type: 'posts'
  id: string
}>()
</script>
