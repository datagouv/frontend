<template>
  <ActionCard
    actions-alignment="start"
    :title="t(`Didn't find what you are looking for?`)"
    icon="/illustrations/magnifying_glass.svg"
    type="primary"
  >
    <p class="mt-1 mb-3">
      {{ t("Try resetting the filters to broaden your search.") }}<br>
      {{ t("You can also check ongoing requests and submit your own on our forum dedicated to data discovery and openness.") }}
    </p>
    <template #actions>
      <BrandedButton
        color="primary-soft"
        @click="$emit('resetFilters')"
      >
        {{ t("Reset filters") }}
      </BrandedButton>
      <BrandedButton
        v-if="dataSearchFeedbackFormUrl"
        color="tertiary"
        :href="dataSearchFeedbackFormUrl"
        :icon="RiLightbulbLine"
        class="ml-2"
      >
        {{ t("Check our forum") }}
      </BrandedButton>
    </template>
  </ActionCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RiLightbulbLine } from '@remixicon/vue'

const { t } = useI18n()

defineProps<{
  dataSearchFeedbackFormUrl: string
}>()

defineEmits<{
  (e: 'resetFilters'): void
}>()
</script>
