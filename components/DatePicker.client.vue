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
const attrs = useAttrs()

const model = defineModel<Date | null>({ set: value => value ? value : null })

const pickerRef = useTemplateRef('picker')
onMounted(() => {
  console.log('In Date Picker!!!')
  console.log('In Date Picker!!!')
  console.log('In Date Picker!!!')
  console.log(attrs)
})

const renderView = () => {
  pickerRef.value?.renderView(pickerRef.value?.initialView)
}
defineExpose({ renderView })
</script>
