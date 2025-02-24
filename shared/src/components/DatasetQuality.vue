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
        <QualityItem
          :passed="quality.dataset_description_quality"
          :message-passed="$t('Data description filled')"
          :message-failed="$t('Data description empty')"
          class="fr-my-1w"
        />
        <QualityItem
          :passed="quality.resources_documentation"
          :message-passed="$t('Files documented')"
          :message-failed="$t('Files documentation missing')"
          class="fr-my-1w"
        />
        <QualityItem
          :passed="quality.license"
          :message-passed="$t('License filled')"
          :message-failed="$t('No license set')"
          class="fr-my-1w"
        />
        <QualityItem
          :passed="quality.update_frequency && !!quality.update_fulfilled_in_time"
          :message-passed="$t('Update frequency followed')"
          :message-failed="quality.update_frequency ? $t('Update frequency not followed') : $t('Update frequency not set')"
          class="fr-my-1w"
        />
        <QualityItem
          :passed="quality.has_open_format"
          :message-passed="$t('File formats are open')"
          :message-failed="$t('File formats are closed')"
          class="fr-my-1w"
        />
        <QualityItem
          :passed="quality.temporal_coverage"
          :message-passed="$t('Temporal coverage filled')"
          :message-failed="$t('Temporal coverage not set')"
          class="fr-my-1w"
        />
        <QualityItem
          :passed="quality.spatial"
          :message-passed="$t('Spatial coverage filled')"
          :message-failed="$t('Spatial coverage not set')"
          class="fr-my-1w"
        />
        <QualityItem
          :passed="quality.all_resources_available"
          :message-passed="$t('All files are available')"
          :message-failed="$t('Some files are unavailable')"
          class="fr-my-1w"
        />
        <div class="fr-grid-row fr-grid-row--right not-enlarged">
          <a
            :href="config.guides_quality_url"
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
  <QualityScore
    :score="quality.score"
    class="w-100"
  />
  <template v-if="showItemWarnings">
    <QualityItemWarning
      :quality-item="quality.dataset_description_quality"
      :message="$t('Data description empty')"
    />
    <QualityItemWarning
      :quality-item="quality.resources_documentation"
      :message="$t('Files documentation missing')"
    />
    <QualityItemWarning
      :quality-item="quality.license"
      :message="$t('No license set')"
    />
    <QualityItemWarning
      :quality-item="quality.update_frequency && quality.update_fulfilled_in_time"
      :message="quality.update_frequency ? $t('Update frequency not followed') : $t('Update frequency not set')"
    />
    <QualityItemWarning
      :quality-item="quality.has_open_format"
      :message="$t('File formats are closed')"
    />
    <QualityItemWarning
      :quality-item="quality.temporal_coverage"
      :message="$t('Temporal coverage not set')"
    />
    <QualityItemWarning
      :quality-item="quality.spatial"
      :message="$t('Spatial coverage not set')"
    />
    <QualityItemWarning
      :quality-item="quality.all_resources_available"
      :message="$t('Some files are unavailable')"
    />
  </template>
</template>

<script lang="ts">
</script>

<script setup lang="ts">
import { QualityScore } from '../QualityScore/'
import { QualityItem } from '../QualityItem/'
import { QualityItemWarning } from '../QualityItemWarning/'
import { Toggletip } from '../Toggletip/'
import { config } from '../../config'
import type { Quality } from '../../types/datasets'

withDefaults(defineProps<{
  quality: Quality
  showItemWarnings?: boolean
}>(), {
  showItemWarnings: true,
})
</script>
