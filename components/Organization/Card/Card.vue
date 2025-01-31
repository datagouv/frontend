<template>
  <div class="border border-gray-default relative fr-enlarge-link">
    <div class="h-[4.5rem] pt-4 px-4 bg-blue-lighter" />
    <div class="px-4 pb-4 pt-5 mt-2">
      <div class="inline-flex border border-gray-default p-1.5 absolute top-4 left-4 bg-white">
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
          class="flex gap-1 items-center"
          :to="organization.page"
          :external="true"
        >
          <p class="mb-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {{ organization.name }}
          </p>
          <RiCheckboxCircleLine
            v-if="organizationCertified"
            class="size-5 flex-none"
            :title="$t('The identity of this public service is certified by {certifier}', { certifier: config.public.title })"
            aria-hidden="true"
          />
        </NuxtLinkLocale>
      </p>
      <div class="mb-2 text-gray-medium flex flex-wrap items-center">
        <OwnerType
          v-if="type !== 'other'"
          class="mb-0 text-sm after:content-['—'] after:ml-1"
          :type
        />
        <div class="flex items-center text-sm">
          <RiDatabase2Line class="size-3.5 mx-1" /> {{ organization.metrics.datasets }}
          <RiTerminalLine class="size-3.5 mx-1" /> {{ organization.metrics.dataservices }}
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
import { AsyncTextClamp, useOrganizationCertified, OwnerType, removeMarkdown, useOrganizationType, type Organization } from '@datagouv/components'
import { RiLineChartLine, RiDatabase2Line, RiCheckboxCircleLine, RiTerminalLine } from '@remixicon/vue'

const props = defineProps<{
  organization: Organization
}>()

const config = useRuntimeConfig()

const { type } = useOrganizationType(props.organization)
const { organizationCertified } = useOrganizationCertified(props.organization)
</script>
