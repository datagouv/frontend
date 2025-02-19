<template>
  <div>
    <div
      v-for="(icon, index) in [undefined, RiInformationLine]"
      :key="index"
    >
      <div
        v-for="size in ['xs', 'sm']"
        :key="size"
      >
        <AdminBadge
          v-for="type in ['primary', 'secondary', 'danger', 'warning', 'success']"
          :key="type"
          class="mb-4 mr-4"
          :size
          :type
          :icon
        >
          Hello
        </AdminBadge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RiInformationLine } from '@remixicon/vue'
</script>
