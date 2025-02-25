<template>
  <div class="fr-m-0 fr-grid-row fr-grid-row--middle fr-text--sm text-mention-grey">
    <div class="fr-grid-row fr-grid-row--middle">
      <Toggletip class="relative z-2">
        <template #toggletip>
          <h5 class="fr-text--sm fr-my-0">
            {{ $t("Metadata quality:") }}
          </h5>
          <ul class="list-style-none fr-m-0 fr-p-0">
            <DatasetQualityItem
              :passed="quality.dataset_description_quality"
              :message-passed="$t('Data description filled')"
              :message-failed="$t('Data description empty')"
              class="fr-my-1w"
            />
            <DatasetQualityItem
              :passed="quality.resources_documentation"
              :message-passed="$t('Files documented')"
              :message-failed="$t('Files documentation missing')"
              class="fr-my-1w"
            />
            <DatasetQualityItem
              :passed="quality.license"
              :message-passed="$t('License filled')"
              :message-failed="$t('No license set')"
              class="fr-my-1w"
            />
            <DatasetQualityItem
              :passed="quality.update_frequency && !!quality.update_fulfilled_in_time"
              :message-passed="$t('Update frequency followed')"
              :message-failed="quality.update_frequency ? $t('Update frequency not followed') : $t('Update frequency not set')"
              class="fr-my-1w"
            />
            <DatasetQualityItem
              :passed="quality.has_open_format"
              :message-passed="$t('File formats are open')"
              :message-failed="$t('File formats are closed')"
              class="fr-my-1w"
            />
            <DatasetQualityItem
              :passed="quality.temporal_coverage"
              :message-passed="$t('Temporal coverage filled')"
              :message-failed="$t('Temporal coverage not set')"
              class="fr-my-1w"
            />
            <DatasetQualityItem
              :passed="quality.spatial"
              :message-passed="$t('Spatial coverage filled')"
              :message-failed="$t('Spatial coverage not set')"
              class="fr-my-1w"
            />
            <DatasetQualityItem
              :passed="quality.all_resources_available"
              :message-passed="$t('All files are available')"
              :message-failed="$t('Some files are unavailable')"
              class="fr-my-1w"
            />
          </ul>
          <div
            v-if="config.datasetQualityGuideUrl"
            class="fr-grid-row fr-grid-row--right not-enlarged"
          >
            <a
              :href="config.datasetQualityGuideUrl"
              target="_blank"
              rel="noopener"
              :title="$t('Learn more about this indicator - opens a new window')"
            >
              {{ $t("Learn more about this indicator") }}
            </a>
          </div>
        </template>
      </Toggletip>
      <p class="fr-my-0 fr-mr-1v text-mention-grey fr-text--sm">
        {{ $t('Metadata :') }}
      </p>
      <div class="fr-grid-row fr-grid-row--middle fr-mr-1v">
        <DatasetQualityScore :score="quality.score" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Quality } from '../types/datasets'
import { useComponentsConfig } from '../main'
import DatasetQualityScore from './DatasetQualityScore.vue'
import DatasetQualityItem from './DatasetQualityItem.vue'
import Toggletip from './Toggletip.vue'

defineProps<{
  quality: Quality
}>()

const config = useComponentsConfig()
</script>
