<template>
  <div class="border-solid border-l-4 pl-3 border-l-primary">
    <p class="font-extrabold text-2xl mb-1">
      {{ formatted }}
    </p>
    <p class="m-0 uppercase font-bold text-sm">
      {{ label }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  number: number
  label: string
}>()

const { locale } = useI18n()

const formatted = new Intl.NumberFormat(locale.value).format(props.number)
</script>
