<template>
  <div class="fr-grid-row fr-grid-row--middle fr-ml-n1v">
    <Toggletip
      class="fr-btn--secondary-grey-500"
      icon="fr-icon-info-line"
      size="md"
    >
      {{ $t('Metadata quality:') }}
      <template #toggletip>
        <h5 class="fr-text--sm fr-my-0">
          {{ $t("Metadata quality:") }}
        </h5>
        <ul class="list-none pl-0">
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
    <p class="fr-m-0 fr-mr-1v">
      {{ $t('Metadata quality:') }}
    </p>
  </div>
  <DatasetQualityScore
    :score="quality.score"
    class="w-100"
  />
  <template v-if="showItemWarnings">
    <ul class="list-none pl-0">
      <DatasetQualityItemWarning
        :quality-item="quality.dataset_description_quality"
        :message="$t('Data description empty')"
      />
      <DatasetQualityItemWarning
        :quality-item="quality.resources_documentation"
        :message="$t('Files documentation missing')"
      />
      <DatasetQualityItemWarning
        :quality-item="quality.license"
        :message="$t('No license set')"
      />
      <DatasetQualityItemWarning
        :quality-item="quality.update_frequency && quality.update_fulfilled_in_time"
        :message="quality.update_frequency ? $t('Update frequency not followed') : $t('Update frequency not set')"
      />
      <DatasetQualityItemWarning
        :quality-item="quality.has_open_format"
        :message="$t('File formats are closed')"
      />
      <DatasetQualityItemWarning
        :quality-item="quality.temporal_coverage"
        :message="$t('Temporal coverage not set')"
      />
      <DatasetQualityItemWarning
        :quality-item="quality.spatial"
        :message="$t('Spatial coverage not set')"
      />
      <DatasetQualityItemWarning
        :quality-item="quality.all_resources_available"
        :message="$t('Some files are unavailable')"
      />
    </ul>
  </template>
</template>

<script setup lang="ts">
import { useComponentsConfig, type Quality } from '../main'
import DatasetQualityItemWarning from './DatasetQualityItemWarning.vue'
import DatasetQualityScore from './DatasetQualityScore.vue'
import DatasetQualityItem from './DatasetQualityItem.vue'
import Toggletip from './Toggletip.vue'

withDefaults(defineProps<{
  quality: Quality
  showItemWarnings?: boolean
}>(), {
  showItemWarnings: true,
})

const config = useComponentsConfig()
</script>
