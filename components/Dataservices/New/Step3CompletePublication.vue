<template>
  <div class="fr-p-3w bg-white">
    <Well
      color="blue-cumulus"
      weight="regular"
      class="mb-6"
    >
      <div class="fr-grid-row">
        <div class="fr-col-auto fr-mr-3v">
          <NuxtImg
            src="/illustrations/success.svg"
            loading="lazy"
            alt=""
          />
        </div>
        <div class="fr-col">
          <p class="fr-m-0 fr-text--bold">
            {{ $t('Your dataservice is created!') }}
          </p>
          <p class="fr-m-0 fr-text--xs">
            {{ $t('You can now publish it or save it as a draft.') }}
          </p>
        </div>
      </div>
    </Well>
    <DataserviceCard :dataservice />
    <div class="fr-grid-row justify-between">
      <a
        v-if="config.public.publishingDataserviceFeedbackUrl"
        :href="config.public.publishingDataserviceFeedbackUrl"
        class="fr-btn fr-btn--tertiary-no-outline fr-btn--secondary-gray-500 fr-btn--icon-left fr-icon-lightbulb-line"
      >
        {{ $t('Give us your feedback on the publishing form') }}
      </a>
      <div class="fr-grid-row fr-grid-row--right">
        <BrandedButton
          class="mr-3"
          color="secondary"
          @click="submit(true)"
        >
          {{ $t("Save as draft") }}
        </BrandedButton>
        <BrandedButton
          color="primary"
          :loading
          @click="submit(false)"
        >
          {{ $t("Publish the dataservice") }}
        </BrandedButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Well, type Dataservice } from '@datagouv/components'
import DataserviceCard from '~/components/Dataservices/Card/Card.vue'

defineProps<{
  dataservice: Dataservice
  loading: boolean
}>()

const emit = defineEmits<{
  next: [asPrivate: boolean]
}>()

const config = useRuntimeConfig()

function submit(asPrivate: boolean) {
  emit('next', asPrivate)
};
</script>
