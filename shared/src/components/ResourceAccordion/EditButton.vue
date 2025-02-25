<template>
  <a
    :href="adminUrl"
    class="fr-btn fr-btn--secondary fr-btn--secondary-warning-425 fr-icon-pencil-line fr-icon--sm"
    data-testid="edit-button"
  >
    {{ t("Edit file") }}
  </a>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useComponentsConfig } from '../../main'

type Props = {
  datasetId: string
  isCommunityResource?: boolean
  resourceId: string
}

const props = withDefaults(defineProps<Props>(), {
  isCommunityResource: false,
})

const config = useComponentsConfig()

const { t } = useI18n()
const resourceType = props.isCommunityResource ? 'community-resource' : 'resource'
const adminUrl = `${config.baseUrl}/dataset/${props.datasetId}/${resourceType}/${props.resourceId}`
</script>
