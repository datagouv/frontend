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
    <AdminDangerZone
        class="mt-5"
      >
        <div class="fr-col">
          <p class="fr-m-0 text-neutral-800">
            {{ $t('Delete the reuse') }}
          </p>
          <p class="fr-m-0 fr-text--xs text-red-600">
            {{ $t("Be careful, this action can't be reverse.") }}
          </p>
        </div>
        <div class="fr-col-auto">
          <BrandedButton
            color="red"
            size="sm"
            type="secondary"
            :aria-controls="modalId"
            :icon="RiDeleteBin6Line"
            @click="openDeleteModal"
          >
            {{ $t('Delete') }}
          </BrandedButton>
          <Modal
            :id="modalId"
            :opened="openedDeleteModal"
            :aria-labelledby="modalTitleId"
            role="dialog"
            :title="$t('Are you sure you want to delete this reuse ?')"
            size="lg"
            @close="closeDeleteModal"
          >
            <p class="fr-text--bold">
              {{ $t("This action can't be reverse.") }}
            </p>
            <template #footer>
              <div class="flex-1 fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                <BrandedButton
                  color="red"
                  type="secondary"
                  role="button"
                  :disabled="loading"
                  @click="deleteReuse"
                >
                  {{ $t("Delete the reuse") }}
                </BrandedButton>
              </div>
            </template>
          </Modal>
        </div>
      </AdminDangerZone>
  </div>
</template>

<script setup lang="ts">
import type { Reuse, ReuseType } from '@datagouv/components'
import DescribeReuse from '~/components/Reuses/DescribeReuse.vue'
import type { ReuseForm, ReuseTopic } from '~/types/types'
import { toForm, toApi } from '~/utils/reuses'
import { RiDeleteBin6Line } from '@remixicon/vue'
import BrandedButton from '../BrandedButton/BrandedButton.vue'

const { t } = useI18n()
const { $api, $fileApi } = useNuxtApp()
const { toast } = useToast()

const route = useRoute()
const loading = ref(false)

const modalId = useId()
const modalTitleId = useId()

const openedDeleteModal = ref(false)

const localePath = useLocalePath()

function openDeleteModal() {
  openedDeleteModal.value = true
}

function closeDeleteModal() {
  openedDeleteModal.value = false
}

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
      body: JSON.stringify(toApi(reuseForm.value, { private: reuseForm.value.private })),
    })

    if (reuseForm.value.image && typeof reuseForm.value.image !== 'string') {
      const formData = new FormData()
      formData.set('file', reuseForm.value.image)
      await $fileApi(`/api/1/reuses/${reuse.value.id}/image`, {
        method: 'POST',
        body: formData,
      })
    }

    toast.success(t('Reuse updated!'))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }
  finally {
    loading.value = false
  }
}

async function deleteReuse() {
  loading.value = true
  try {
    await $api(`/api/1/reuses/${route.params.id}`, {
      method: 'DELETE',
    })
    if (route.params.oid) {
      await navigateTo(localePath(`/beta/admin/organizations/${route.params.oid}/reuses`), { replace: true })
    }
    else {
      await navigateTo(localePath('/beta/admin/me/reuses'), { replace: true })
    }
  }
  finally {
    loading.value = false
  }
}
</script>
