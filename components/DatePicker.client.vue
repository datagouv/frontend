<template>
  <ClientOnly>
    <Datepicker
      v-bind="$attrs"
      ref="picker"
      v-model="model"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import Datepicker from 'vue3-datepicker'

defineOptions({ inheritAttrs: false })

const model = defineModel<Date | null>({ set: value => value ? value : null })

const pickerRef = useTemplateRef('picker')

const renderView = () => {
  pickerRef.value?.renderView(pickerRef.value?.initialView)
}
defineExpose({ renderView })
</script>
