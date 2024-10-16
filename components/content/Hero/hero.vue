<template>
  <div class="grid grid-cols-3 gap-16 items-center">
    <div class="col-span-2">
      <h1 class="font-extrabold text-[3.5rem] leading-[1.2] mb-2">
        <ContentSlot
          :use="$slots.default"
          unwrap="h1"
        />
      </h1>
      <p class="text-3xl fr-text--alt m-0">
        <ContentSlot
          :use="$slots.description"
          unwrap="p"
        />
      </p>
    </div>
    <div>
      <nuxt-img
        placeholder
        loading="lazy"
        :src
        :width
        :height
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  height: number
  src: string
  width: number
}>()
</script>
