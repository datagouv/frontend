<template>
  <div class="border border-gray-default relative fr-enlarge-link">
    <div class="h-14 pt-4 px-4 bg-blue-lighter" />
    <div class="px-4 pb-4 pt-7 mt-2">
      <div class="inline-flex border border-gray-default p-1 absolute top-4 left-4 bg-white">
        <img
          :src="organization.logo_thumbnail"
          width="64"
          height="64"
          alt=""
          loading="lazy"
        >
      </div>
      <p class="mb-0 font-bold">
        <NuxtLinkLocale
          :to="organization.page"
          :external="true"
        >
          {{ organization.name }}
        </NuxtLinkLocale>
      </p>
      <div class="mb-2 text-gray-medium flex">
        <p class="mb-0 text-sm mr-1">
          {{ $t('Updated {date}', { date: formatFromNow(organization.last_modified) }) }}
        </p>
        <div class="flex items-center text-sm before:content-['—']">
          <RiDatabase2Line class="size-3.5 mx-1" /> {{ organization.metrics.datasets }}
          <RiLineChartLine class="size-3.5 mx-1" /> {{ organization.metrics.reuses }}
        </div>
      </div>
      <p class="mt-2 mb-0">
        <AsyncTextClamp
          :text="removeMarkdown(organization.description)"
          :max-lines="3"
        />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AsyncTextClamp, formatFromNow, removeMarkdown, type Organization } from '@datagouv/components'
import { RiLineChartLine, RiDatabase2Line } from '@remixicon/vue'

defineProps<{
  organization: Organization
}>()
</script>
