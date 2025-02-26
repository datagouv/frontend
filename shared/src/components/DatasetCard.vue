<template>
  <div class="fr-my-2w fr-p-2w border border-default-grey fr-enlarge-link">
    <div
      v-if="dataset.private || dataset.archived"
      class="absolute top-0 fr-grid-row fr-grid-row--middle fr-mt-n3v fr-ml-n1v"
    >
      <p
        v-if="dataset.private"
        class="fr-badge fr-badge--sm fr-badge--mention-grey text-grey-380 fr-mr-1w"
      >
        <span
          class="fr-icon-lock-line fr-icon--sm"
          aria-hidden="true"
        />
        {{ t('Draft') }}
      </p>
      <p
        v-if="dataset.archived"
        class="fr-badge fr-badge--sm fr-badge--mention-grey text-grey-380 fr-mr-1w"
      >
        <span
          class="fr-icon-archive-line fr-icon--sm"
          aria-hidden="true"
        />
        {{ t('Archived') }}
      </p>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--top">
      <div class="fr-col-auto">
        <div class="logo">
          <Placeholder
            v-if="dataset.organization"
            type="dataset"
            :src="dataset.organization.logo_thumbnail"
            alt=""
            :size="40"
          />
          <Avatar
            v-else-if="dataset.owner"
            :user="dataset.owner"
            :size="40"
          />
          <Placeholder
            v-else
            type="dataset"
            :size="40"
          />
        </div>
      </div>
      <div class="fr-col-12 fr-col-sm">
        <h4 class="fr-text--md fr-mb-0 fr-grid-row">
          <slot
            name="datasetUrl"
            :dataset="dataset"
            :dataset-url="datasetUrl"
          >
            <AppLink
              :to="datasetUrl"
              class="text-grey-500 fr-grid-row"
            >
              <component
                :is="config.textClamp"
                v-if="config && config.textClamp"
                class="fr-col"
                :auto-resize="true"
                :text="dataset.title"
                :max-lines="1"
              />
              <small
                v-if="dataset.acronym"
                class="fr-col-auto fr-ml-1w"
              >{{ dataset.acronym }}</small>
            </AppLink>
          </slot>
        </h4>
        <div
          v-if="dataset.organization || dataset.owner"
          class="fr-text--sm fr-m-0 inline-flex"
        >
          <template v-if="dataset.organization">
            <span class="not-enlarged fr-mr-1v">
              <AppLink
                v-if="organizationUrl"
                class="fr-link not-enlarged fr-text--sm inline-flex items-center"
                :to="organizationUrl"
              >
                <OrganizationNameWithCertificate :organization="dataset.organization" />
              </AppLink>
              <OrganizationNameWithCertificate
                v-else
                :organization="dataset.organization"
              />
            </span>
          </template>
          <component
            :is="config.textClamp"
            v-else-if="config && config.textClamp"
            class="not-enlarged fr-mr-1v"
            :auto-resize="true"
            :text="ownerName"
            :max-lines="1"
          />
          <span class="text-mention-grey dash-before-sm whitespace-nowrap">{{ $t('Updated {date}', { date: formatRelativeIfRecentDate(dataset.last_update) }) }}</span>
        </div>
        <div class="fr-mx-0 fr-mb-n1v fr-grid-row fr-grid-row--middle fr-text--sm text-mention-grey">
          <div class="fr-hidden flex-sm dash-after-sm text-grey-500">
            <DatasetQualityInline :quality="dataset.quality" />
          </div>
          <div class="fr-grid-row fr-grid-row--middle fr-mr-1v">
            <p
              class="fr-text--sm fr-my-0"
              :aria-label="t('{n} resources downloads', dataset.metrics.resources_downloads)"
            >
              <span
                class="fr-icon-download-line fr-icon--sm fr-px-1v"
                aria-hidden="true"
              />{{ summarize(dataset.metrics.resources_downloads) }}
            </p>
            <p
              class="fr-text--sm fr-my-0"
              :aria-label="t('{n} followers', dataset.metrics.followers)"
            >
              <span
                class="fr-icon-star-line fr-icon--sm fr-px-1v"
                aria-hidden="true"
              />{{ summarize(dataset.metrics.followers) }}
            </p>
            <p
              class="fr-text--sm fr-my-0"
              :aria-label="t('{n} reuses', dataset.metrics.reuses)"
            >
              <span
                class="fr-icon-line-chart-line fr-icon--sm fr-px-1v"
                aria-hidden="true"
              />{{ summarize(dataset.metrics.reuses) }}
            </p>
          </div>
        </div>
        <component
          :is="config.textClamp"
          v-if="showDescription && config && config.textClamp && description"
          class="fr-text--sm fr-mt-1w fr-mb-0 overflow-wrap-anywhere"
          :auto-resize="true"
          :text="description"
          :max-lines="2"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { RouteLocationRaw } from 'vue-router'
import { computed, ref, watchEffect } from 'vue'
import type { Dataset, DatasetV2 } from '../types/datasets'
import { summarize } from '../functions/helpers'
import { formatRelativeIfRecentDate } from '../functions/dates'
import { getOwnerName } from '../functions/owned'
import { removeMarkdown } from '../functions/markdown'
import { useComponentsConfig } from '../main'
import DatasetQualityInline from './DatasetQualityInline.vue'
import Avatar from './Avatar.vue'
import Placeholder from './Placeholder.vue'
import OrganizationNameWithCertificate from './OrganizationNameWithCertificate.vue'
import AppLink from './AppLink.vue'

  type Props = {
    dataset: Dataset | DatasetV2

    /**
     * The datasetUrl is a route location object to allow Vue Router to navigate to the details of a dataset.
     * It is used as a separate prop to allow other sites using the package to define their own dataset pages.
     */
    datasetUrl: RouteLocationRaw

    /**
     * The organizationUrl is an optional route location object to allow Vue Router to navigate to the details of the organization linked to tha dataset.
     * It is used as a separate prop to allow other sites using the package to define their own organization pages.
     */
    organizationUrl?: RouteLocationRaw
    showDescription?: boolean
  }

const props = withDefaults(defineProps<Props>(), {
  style: () => ({}),
  showDescription: true,
})

const { t } = useI18n()
const ownerName = computed(() => getOwnerName(props.dataset))
const config = useComponentsConfig()

const description = ref('')
watchEffect(async () => {
  if (!props.showDescription) return
  description.value = await removeMarkdown(props.dataset.description)
})
</script>
