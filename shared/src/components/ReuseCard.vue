<template>
  <article class="fr-card fr-card--no-icon fr-enlarge-link">
    <div class="fr-card__body">
      <div class="fr-card__content fr-px-2w fr-py-1v">
        <h3 class="fr-card__title fr-text--md fr-mt-1v fr-mb-0">
          <AppLink
            class="text-grey-500"
            :to="reuseUrl"
          >
            <component
              :is="config.textClamp"
              v-if="config.textClamp"
              :auto-resize="true"
              :text="reuse.title"
              :max-lines="1"
            />
          </AppLink>
        </h3>
        <div class="fr-card__desc fr-mt-0 text-mention-grey">
          <p class="fr-text--sm fr-mb-0 flex">
            <span
              v-if="reuse.organization"
              class="not-enlarged"
            >
              <AppLink
                v-if="organizationUrl"
                class="fr-link"
                :to="organizationUrl"
              >
                <OrganizationNameWithCertificate :organization="reuse.organization" />
              </AppLink>
              <OrganizationNameWithCertificate
                v-else
                :organization="reuse.organization"
              />
            </span>
            <component
              :is="config.textClamp"
              v-else-if="config.textClamp"
              class="not-enlarged fr-mr-1v"
              :auto-resize="true"
              :text="ownerName"
              :max-lines="1"
            />
            <span class="dash-before-sm text-overflow-ellipsis">{{ t('published {date}', { date: formatRelativeIfRecentDate(reuse.created_at) }) }}</span>
          </p>
          <div class="fr-grid-row fr-grid-row--middle">
            <p class="fr-text--sm fr-my-0 dash-after-sm">
              {{ reuseType }}
            </p>
            <p
              class="fr-text--sm fr-my-0"
              :aria-label="t('{n} views', reuse.metrics.views)"
            >
              <span
                class="fr-icon-eye-line fr-icon--xs fr-px-1v"
                aria-hidden="true"
              />{{ summarize(reuse.metrics.views) }}
            </p>
            <p
              class="fr-text--sm fr-my-0"
              :aria-label="t('{n} followers', reuse.metrics.followers)"
            >
              <span
                class="fr-icon-star-line fr-icon--xs fr-px-1v"
                aria-hidden="true"
              />{{ summarize(reuse.metrics.followers) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="fr-card__header">
      <div class="fr-card__img">
        <Placeholder
          class="fr-responsive-img reuse-ratio"
          alt=""
          type="reuse"
          :src="reuse.image"
          :size="320"
        />
      </div>
      <ul
        v-if="reuse.private || reuse.archived"
        class="fr-badges-group"
      >
        <li v-if="reuse.private">
          <p class="fr-badge fr-badge--sm fr-badge--mention-grey text-grey-380">
            <span class="fr-icon-lock-line fr-icon--xs" />
            {{ t('Draft') }}
          </p>
        </li>
        <li v-if="reuse.archived">
          <p class="fr-badge fr-badge--sm fr-badge--mention-grey text-grey-380">
            <span class="fr-icon-lock-line fr-icon--xs" />
            {{ t('Archived') }}
          </p>
        </li>
      </ul>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { RouteLocationRaw } from 'vue-router'
import { computed } from 'vue'
import { summarize, formatRelativeIfRecentDate, OrganizationNameWithCertificate, getOwnerName, type Reuse, useComponentsConfig } from '../main'
import { useFetch } from '../functions/api'
import Placeholder from './Placeholder.vue'
import AppLink from './AppLink.vue'

const props = defineProps<{
  reuse: Reuse

  /**
     * The reuseUrl is a route location object to allow Vue Router to navigate to the details of a reuse.
     * It is used as a separate prop to allow other sites using the package to define their own reuse pages.
     */
  reuseUrl: RouteLocationRaw

  /**
     * The organizationUrl is an optional route location object to allow Vue Router to navigate to the details of the organization linked to tha reuse.
     * It is used as a separate prop to allow other sites using the package to define their own organization pages.
     */
  organizationUrl?: RouteLocationRaw
}>()

const { t } = useI18n()
const config = useComponentsConfig()

const ownerName = computed(() => getOwnerName(props.reuse))

const { data: reusesTypes } = await useFetch<Array<{ id: string, label: string }>>('/api/1/reuses/types')

const reuseType = computed(() => {
  if (!reusesTypes.value) return ''
  const type = reusesTypes.value.find(t => t.id === props.reuse.type)
  return type ? type.label : ''
})
</script>

  <style scoped>
.fr-card__img img.reuse-ratio {
    aspect-ratio: 1.4;
    object-fit: cover;
  }

  .fr-card.fr-enlarge-link .fr-card__title a::after {
    content: none;
  }
  </style>
