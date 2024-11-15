<template>
  <div>
    <h2 class="font-extrabold text-[2.62rem] leading-[1.2] mb-8">
      <ContentSlot
        :use="$slots.default"
        unwrap="h2"
      />
    </h2>
    <div class="grid grid-cols-3 gap-6">
      <div>
        <NuxtImg
          v-if="img1"
          :src="img1"
          class="mb-2"
          loading="lazy"
          alt=""
        />
        <slot name="col1" />
      </div>
      <div>
        <NuxtImg
          v-if="img2"
          :src="img2"
          class="mb-2"
          loading="lazy"
          alt=""
        />
        <slot name="col2" />
      </div>
      <div>
        <NuxtImg
          v-if="img3"
          :src="img3"
          class="mb-2"
          loading="lazy"
          alt=""
        />
        <slot name="col3" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  img1?: string
  img2?: string
  img3?: string
}>()
</script>

<style scoped>
:deep(h3) {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

:deep(p) {
  margin-bottom: 0.75rem;
}

:deep(h3) a[href] {
  --underline-img: none;
}
</style>
