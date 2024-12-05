<template>
  <div>
    <BannerAction
      v-for="type in ['primary', 'warning', 'danger']"
      :key="type"
      :type
      class="mb-4"
      title="Transférer cette réutilisation"
    >
      Attention cette action est irréversible

      <template #button>
        <BannerActionButton :icon="RiSendPlaneLine">
          Transférer
        </BannerActionButton>
      </template>
    </BannerAction>
  </div>
</template>

<script setup lang="ts">
import { RiSendPlaneLine } from '@remixicon/vue'
</script>
