<template>
  <DescribeHarvester
    v-if="harvesterForm"
    v-model="harvesterForm"
    type="update"
    @submit="save"
  >
    <template #button>
      <button
        type="submit"
        class="fr-btn"
        :disabled="loading"
      >
        {{ $t("Save") }}
      </button>
    </template>
  </DescribeHarvester>
</template>

<script setup lang="ts">
import DescribeHarvester from '~/components/Harvesters/DescribeHarvester.vue'
import type { HarvesterForm, HarvesterSource } from '~/types/harvesters'
import { toForm, toApi } from '~/utils/harvesters'

const route = useRoute()
const { $api } = useNuxtApp()
const { t } = useI18n()
const { toast } = useToast()

const sourceUrl = computed(() => `/api/1/harvest/source/${route.params.id}`)
const { data: harvester } = await useAPI<HarvesterSource>(sourceUrl, { lazy: true })

const loading = ref(false)

const harvesterForm = ref<HarvesterForm | null>(null)
watchEffect(() => {
  harvesterForm.value = toForm(harvester.value)
})

const save = async () => {
  if (!harvesterForm.value) throw new Error('No harvester form')

  try {
    loading.value = true

    await $api(`/api/1/harvest/source/${harvester.value.id}`, {
      method: 'PUT',
      body: JSON.stringify(toApi(harvesterForm.value)),
    })

    if (harvester.value.schedule !== harvesterForm.value.schedule) {
      if (harvesterForm.value.schedule) {
        await $api(`/api/1/harvest/source/${harvester.value.id}/schedule`, {
          method: 'POST',
          body: JSON.stringify(harvesterForm.value.schedule),
        })
      }
      else {
        await $api(`/api/1/harvest/source/${harvester.value.id}/schedule`, { method: 'DELETE' })
      }
    }

    toast.success(t('Harvester updated!'))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }
  finally {
    loading.value = false
  }
}
</script>
