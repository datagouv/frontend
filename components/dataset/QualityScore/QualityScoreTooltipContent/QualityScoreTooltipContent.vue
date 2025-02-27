<template>
  <h5 class="fr-text--sm fr-my-0">
    {{ t("Metadata quality:") }}
  </h5>
  <QualityItem
    :passed="dataset.quality.dataset_description_quality"
    :message-passed="t('Data description filled')"
    :message-failed="t('Data description empty')"
    class="fr-my-1w"
  />
  <QualityItem
    :passed="dataset.quality.resources_documentation"
    :message-passed="t('Files documented')"
    :message-failed="t('Files documentation missing')"
    class="fr-my-1w"
  />
  <QualityItem
    :passed="dataset.quality.license"
    :message-passed="t('License filled')"
    :message-failed="t('No license set')"
    class="fr-my-1w"
  />
  <QualityItem
    :passed="dataset.quality.update_frequency && !!dataset.quality.update_fulfilled_in_time"
    :message-passed="t('Update frequency followed')"
    :message-failed="dataset.quality.update_frequency ? t('Update frequency not followed') : t('Update frequency not set')"
    class="fr-my-1w"
  />
  <QualityItem
    :passed="dataset.quality.has_open_format"
    :message-passed="t('File formats are open')"
    :message-failed="t('File formats are closed')"
    class="fr-my-1w"
  />
  <QualityItem
    :passed="dataset.quality.temporal_coverage"
    :message-passed="t('Temporal coverage filled')"
    :message-failed="t('Temporal coverage not set')"
    class="fr-my-1w"
  />
  <QualityItem
    :passed="dataset.quality.spatial"
    :message-passed="t('Spatial coverage filled')"
    :message-failed="t('Spatial coverage not set')"
    class="fr-my-1w"
  />
  <QualityItem
    :passed="dataset.quality.all_resources_available"
    :message-passed="t('All files are available')"
    :message-failed="t('Some files are unavailable')"
    class="fr-my-1w"
  />
  <div class="fr-grid-row fr-grid-row--right not-enlarged">
    <a
      :href="'TODO'"
      target="_blank"
      rel="noopener"
      :title="t('Learn more about this indicator - opens a new window')"
    >
      {{ t("Learn more about this indicator") }}
    </a>
  </div>
</template>

<script setup lang="ts">
import type { Dataset, DatasetV2 } from '@datagouv/components-next'
import { QualityItem } from '@datagouv/components'
import { useI18n } from 'vue-i18n'

defineProps<{
  dataset: Dataset | DatasetV2
}>()

const { t } = useI18n()
</script>
