<template>
  <AdminBadge
    size="xs"
    :type="status.type"
  >
    {{ status.label }}
  </AdminBadge>
</template>

<script setup lang="ts">
import type { HarvesterJob } from '~/types/harvesters'
import type { AdminBadgeType } from '~/types/types'

const props = defineProps<{
  job: HarvesterJob
}>()

const { t } = useI18n()

const status = computed< { label: string, type: AdminBadgeType }>(() => {
  switch (props.job.status) {
    case 'pending':
      return {
        label: t('Pending'),
        type: 'secondary',
      }
    case 'initializing':
      return {
        label: t('Initializing'),
        type: 'primary',
      }
    case 'initialized':
      return {
        label: t('Initialized'),
        type: 'secondary',
      }
    case 'processing':
      return {
        label: t('Processing'),
        type: 'primary',
      }
    case 'done':
      return {
        label: t('Done'),
        type: 'success',
      }
    case 'done-errors':
      return {
        label: t('Done with errors'),
        type: 'warning',
      }
    case 'failed':
      return {
        label: t('Failed'),
        type: 'danger',
      }
    default:
      return throwOnNever(props.job.status, 'Unknown job status')
  }
})
</script>
