<template>
  <div class="bg-gradient-to-b from-white to-neutral-50 py-16">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 class="font-extrabold text-[2.62rem] leading-[1.2] mb-6">
            <ContentSlot
              :use="$slots.default"
              unwrap="h2"
            />
          </h2>
          <p class="text-2xl fr-text--alt mb-8">
            <ContentSlot
              :use="$slots.description"
              unwrap="p"
            />
          </p>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-8">
            <Stats
              :number="datasets"
              :label="$t('datasets')"
            />
            <Stats
              :number="files"
              :label="$t('files')"
            />
            <Stats
              :number="organizations"
              :label="$t('organizations')"
            />
          </div>
          <p class="font-bold text-sm uppercase mb-1">
            <ContentSlot
              :use="$slots.organizationsDescription"
              unwrap="p"
            />
          </p>
          <nuxt-img
            class="grayscale mb-28"
            :src="featuredOrganizations"
          />
        </div>
        <div>
          <nuxt-img src="/img/dataset.svg" />
          <nuxt-img
            class="ml-6 -mt-7"
            src="/img/dataset.svg"
          />
          <nuxt-img
            class="ml-12 -mt-7"
            src="/img/dataset.svg"
          />
          <nuxt-img
            class="ml-[4.5rem] -mt-7"
            src="/img/dataset.svg"
          />
          <nuxt-img
            class="ml-24 -mt-7"
            src="/img/dataset.svg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  datasets: number
  files: number
  organizations: number
  featuredOrganizations: string
}>()
</script>
