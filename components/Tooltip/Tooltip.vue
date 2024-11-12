<template>
  <div
    class="relative"
    @focusin="show = true"
    @mouseenter="show = true"
    @focusout="show = false"
    @mouseleave="show = false"
  >
    <p
      v-bind="$attrs"
      :aria-describedby="id"
    >
      <slot />
    </p>
    <div
      v-show="show"
      :id
      role="tooltip"
      aria-hidden="true"
      class="absolute drop-shadow bg-white p-2 left-1/2 z-10 mt-0 w-screen max-w-56 -translate-x-1/2 transform"
      static
    >
      <slot name="tooltip" />
    </div>
  </div>
</template>

<script setup lang="ts">
const id = useId()
const show = ref(false)
</script>
