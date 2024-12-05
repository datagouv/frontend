<template>
  <div class="flex space-x-5">
    <div
      v-for="({ disabled, loading, as }, index) in [
        { disabled: false, loading: false, as: 'button' },
        { disabled: true, loading: false, as: 'button' },
        { disabled: false, loading: true, as: 'button' },
        { disabled: false, loading: false, as: 'a' },
        { disabled: true, loading: false, as: 'a' },
        { disabled: false, loading: true, as: 'a' },
      ]"
      :key="index"
      class="space-y-5"
    >
      <div
        v-for="color in ['primary', 'secondary', 'danger']"
        :key="color"
        class="space-y-5"
      >
        <div
          v-for="({ icon, text }, index) in [
            { icon: null, text: 'Explorer les données' },
            { icon: RiLightbulbFlashLine, text: 'Explorer les données' },
            { icon: RiLightbulbFlashLine, text: null },
          ]"
          :key="index"
          class="space-y-2 flex flex-col items-start"
        >
          <BrandedButton
            v-for="size in ['sm', 'xs']"
            :key="size"
            :color
            :size
            :icon
            :loading
            :disabled
            :as
            :href="as === 'a' ? 'https://data.gouv.fr' : undefined"
          >
            {{ text }}
          </BrandedButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RiLightbulbFlashLine } from '@remixicon/vue'
</script>
