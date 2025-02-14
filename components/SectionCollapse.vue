<template>
  <Disclosure
    v-slot="{ open }"
    as="section"
    data-type="accordion"
    class="border-t last:border-b border-y-gray-default py-2.5"
  >
    <div class="flex flex-wrap items-center">
      <h2 class="!text-sm uppercase !mb-0 w-full flex-none md:flex-1">
        {{ title }}
      </h2>
      <div class="flex-none flex flex-wrap items-center">
        <slot name="buttons" />
        <DisclosureButton class="flex items-center text-sm gap-1 rounded-full font-medium !bg-none py-3 px-4 hover:!bg-gray-some">
          <RiArrowUpSLine
            class="size-5"
            :class="{ 'rotate-180 transform': open }"
          />
          {{ buttonText }}
        </DisclosureButton>
      </div>
    </div>
    <DisclosurePanel
      class="pt-2.5 pb-5"
    >
      <slot />
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { RiArrowUpSLine } from '@remixicon/vue'

defineProps<{
  buttonText: string
  title: string
}>()
</script>
