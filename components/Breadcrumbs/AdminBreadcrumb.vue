<template>
  <AdminBreadcrumb>
    <BreadcrumbItem to="/beta/admin">
      {{ $t('Administration') }}
    </BreadCrumbItem>
    <BreadcrumbItem
      v-if="organization"
      :to="`/beta/admin/organizations/${organization.id}/profile`"
    >
      {{ organization.name }}
    </BreadCrumbItem>
    <BreadcrumbItem
      v-if="user && user.id !== me.id"
      :to="`/beta/admin/users/${user.id}/profile`"
    >
      {{ user.first_name }} {{ user.last_name }}
    </BreadCrumbItem>
    <slot />
  </AdminBreadcrumb>
</template>

<script setup lang="ts">
import type { Organization, User } from '@datagouv/components'
import BreadcrumbItem from './BreadcrumbItem.vue'

defineProps<{
  organization?: Organization | null
  user?: User | null
}>()

const me = useMe()
</script>
