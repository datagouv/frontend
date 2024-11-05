<template>
  <div class="fr-container">
    <Container>
      <Well
        color="blue-cumulus"
        weight="regular"
        class="fr-mb-n3v"
      >
        <div class="fr-grid-row">
          <div class="fr-col-auto fr-mr-3v">
            <img
              :src="successIcon"
              alt=""
            >
          </div>
          <div class="fr-col">
            <p class="fr-m-0 fr-text--bold">
              {{ $t('Your dataset is created !') }}
            </p>
            <p class="fr-m-0 fr-text--xs">
              {{ $t('You can now publish it or save it as a draft.') }}
            </p>
          </div>
        </div>
      </Well>
      <CardLg
        :dataset="dataset"
        :show-metrics="false"
      />
      <div class="fr-grid-row justify-between">
        <a
          :href="config.public.feedbackUrl"
          class="fr-btn fr-btn--tertiary-no-outline fr-btn--secondary-grey-500 fr-btn--icon-left fr-icon-lightbulb-line"
        >
          {{ $t('Give us your feedback on the publishing form') }}
        </a>
        <div class="fr-grid-row fr-grid-row--right">
          <a
            :href="'#'"
            class="fr-btn fr-btn--secondary fr-btn--secondary-grey-500 fr-mr-3v"
          >
            {{ $t("Save as draft") }}
          </a>
          <button
            class="fr-btn"
            @click="submit"
          >
            {{ $t("Publish the dataset") }}
          </button>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { Well } from '@datagouv/components/ts'
import { reactive } from 'vue'
import successIcon from '../../../../templates/svg/illustrations/success.svg'
import Container from '~/components/content/Container/Container.vue'

const emit = defineEmits<{
  redirectToPublicUrl: []
}>()

const config = useRuntimeConfig()

// const props = defineProps<{
//   feedbackUrl: string
//   originalDataset: Dataset
//   redirectDraftUrl: string
// }>()

const dataset = reactive({ ...props.originalDataset, private: false })

function submit() {
  emit('redirectToPublicUrl')
};
</script>
