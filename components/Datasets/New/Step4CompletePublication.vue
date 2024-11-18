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
            {{ $t('Your dataset is almost created!') }}
          </p>
          <p class="fr-m-0 fr-text--xs">
            {{ $t('You can now publish it or save it as a draft.') }}
          </p>
        </div>
      </div>
    </Well>
    <DatasetCardLg :dataset="publicDataset" />
    <div class="fr-grid-row justify-between">
      <a
        v-if="config.public.publishingDatasetFeedbackUrl"
        :href="config.public.publishingDatasetFeedbackUrl"
        class="fr-btn fr-btn--tertiary-no-outline fr-btn--secondary-grey-500 fr-btn--icon-left fr-icon-lightbulb-line"
        target="_blank"
      >
        {{ $t('Give us your feedback on the publishing form') }}
      </a>
      <div class="fr-grid-row fr-grid-row--right">
        <button
          class="fr-btn fr-btn--secondary fr-btn--secondary-grey-500 fr-mr-3v"
          @click="submit(true)"
        >
          {{ $t("Save as draft") }}
        </button>
        <button
          class="fr-btn"
          @click="submit(false)"
        >
          {{ $t("Publish the dataset") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Well, type Dataset } from '@datagouv/components'

const props = defineProps<{ dataset: Dataset }>()

const publicDataset = computed(() => ({ ...props.dataset, private: false }))

const emit = defineEmits<{
  (e: 'next', asPrivate: boolean): void
}>()

const config = useRuntimeConfig()

function submit(asPrivate: boolean) {
  emit('next', asPrivate)
};
</script>
