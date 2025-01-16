<template>
  <div
    v-if="loading"
    class="flex justify-center items-center"
  >
    <AdminLoader class="size-24" />
  </div>
  <div v-else-if="job">
    <JobPage
      :job
      preview
    />
    <div class="flex items-center justify-between">
      <BrandedButton
        color="secondary"
        @click="$emit('previous')"
      >
        {{ $t('Previous') }}
      </BrandedButton>
      <BrandedButton
        color="primary"
        @click="$emit('next')"
      >
        {{ $t('Next') }}
      </BrandedButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminLoader from '../AdminLoader/AdminLoader.vue'
import JobPage from './JobPage.vue'
import type { HarvesterForm, HarvesterJob } from '~/types/harvesters'
import { toApi } from '~/utils/harvesters'

const props = defineProps<{
  harvesterForm: HarvesterForm
}>()

defineEmits<{
  previous: []
  next: []
}>()

const { $api } = useNuxtApp()

const loading = ref(false)
const job = ref<HarvesterJob | null>(null)

onMounted(async () => {
  loading.value = true

  try {
    job.value = await $api<HarvesterJob>('/api/1/harvest/source/preview', {
      method: 'POST',
      body: toApi(props.harvesterForm),
    })
  }
  finally {
    loading.value = false
  }
})
</script>
