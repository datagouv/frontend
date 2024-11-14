<template>
  <div>
    <DescribeReuse
      v-if="reuseForm"
      v-model="reuseForm"
      type="update"
      @submit="save"
    >
      <button
        type="submit"
        class="fr-btn"
        :disabled="loading"
      >
        {{ t("Save") }}
      </button>
    </DescribeReuse>
  </div>
</template>

<script setup lang="ts">
import type { Reuse, ReuseType } from '@datagouv/components'
import DescribeReuse from '~/components/Reuses/DescribeReuse.vue'
import type { ReuseForm, ReuseTopic } from '~/types/types'
import { toForm, toApi } from '~/utils/reuses'

const { t } = useI18n()
const { $api } = useNuxtApp()
const { toast } = useToast()

const route = useRoute()
const loading = ref(false)

const url = computed(() => `/api/1/reuses/${route.params.id}`)
const { data: reuse } = await useAPI<Reuse>(url, { lazy: true })

const { data: types } = await useAPI<Array<ReuseType>>('/api/1/reuses/types', { lazy: true })
const { data: topics } = await useAPI<Array<ReuseTopic>>('/api/1/reuses/topics', { lazy: true })

const reuseForm = ref<ReuseForm | null>(null)
watchEffect(() => {
  reuseForm.value = toForm(reuse.value, types.value || [], topics.value || [])
})

const save = async () => {
  if (!reuseForm.value) throw new Error('No reuse form')

  try {
    loading.value = true

    await $api(`/api/1/reuses/${reuse.value.id}/`, {
      method: 'PUT',
      body: JSON.stringify(toApi(reuseForm.value)),
    })

    toast.success(t('Reuse updated!'))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }
  finally {
    loading.value = false
  }
}
</script>
