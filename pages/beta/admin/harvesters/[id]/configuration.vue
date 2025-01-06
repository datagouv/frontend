<template>
  <DescribeHarvester v-model="harvesterForm" />
</template>

<script setup lang="ts">
import DescribeHarvester from '~/components/Harvesters/DescribeHarvester.vue'
import type { HarvesterForm, HarvesterSource } from '~/types/harvesters'
import { toForm } from '~/utils/harvesters'

const route = useRoute()
const sourceUrl = computed(() => `/api/1/harvest/source/${route.params.id}`)
const { data: harvester } = await useAPI<HarvesterSource>(sourceUrl, { lazy: true })

const harvesterForm = ref<HarvesterForm | null>(null)
watchEffect(() => {
  harvesterForm.value = toForm(harvester.value)
})
</script>
