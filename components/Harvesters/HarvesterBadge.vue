<template>
  <span>
    <AdminBadge
      v-if="harvester.deleted"
      size="xs"
      type="danger"
    >
      {{ $t('Deleted') }}
    </AdminBadge>
    <AdminBadge
      v-else-if="!harvester.active"
      size="xs"
      type="danger"
    >
      {{ $t('Inactive') }}
    </AdminBadge>
    <AdminBadge
      v-else-if="harvester.validation.state === 'refused'"
      size="xs"
      type="danger"
    >
      {{ $t('Refused') }}
    </AdminBadge>
    <AdminBadge
      v-else-if="harvester.validation.state === 'pending'"
      size="xs"
      type="warning"
    >
      {{ $t('Waiting validation') }}
    </AdminBadge>
    <JobBadge
      v-else-if="harvester.last_job"
      :job="harvester.last_job"
    />
    <AdminBadge
      v-else
      size="xs"
      type="secondary"
    >
      {{ $t('No job yet') }}
    </AdminBadge>
  </span>
</template>

<script setup lang="ts">
import AdminBadge from '../AdminBadge/AdminBadge.vue'
import type { HarvesterSource } from '~/types/harvesters'

defineProps<{
  harvester: HarvesterSource
}>()
</script>
