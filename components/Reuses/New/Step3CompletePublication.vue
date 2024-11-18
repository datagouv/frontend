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
            alt=""
            loading="lazy"
          />
        </div>
        <div class="fr-col">
          <p class="fr-m-0 fr-text--bold">
            {{ $t('Your reuse is created!') }}
          </p>
          <p class="fr-m-0 fr-text--xs">
            {{ $t('You can now publish it or save it as a draft.') }}
          </p>
        </div>
      </div>
    </Well>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-3">
      <ReuseCard
        :reuse
        class="xl:col-start-2"
      />
    </div>
    <div class="flex justify-between">
      <a
        v-if="config.public.publishingReuseFeedbackUrl"
        :href="config.public.publishingReuseFeedbackUrl"
        class="fr-btn fr-btn--tertiary-no-outline fr-btn--secondary-grey-500 fr-btn--icon-left fr-icon-lightbulb-line"
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
          {{ $t("Publish the reuse") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Well, type Reuse } from '@datagouv/components'
import ReuseCard from '~/components/Reuses/Card/Card.vue'

defineProps<{ reuse: Reuse }>()

const emit = defineEmits<{
  (e: 'next', asPrivate: boolean): void
}>()

const config = useRuntimeConfig()

function submit(asPrivate: boolean) {
  emit('next', asPrivate)
};
</script>
