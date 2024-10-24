<template>
  <TooltipButton
    data-fr-opened="false"
    :aria-controls="id"
    icon="fr-icon-image-add-fill"
    :title="t('Image')"
    data-testid="image-modal-button"
  />
  <ImageModal
    :id="id"
    :multiple="true"
    @send-modal="onChange"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import TooltipButton from '../EditorButton.vue'
import ImageModal from './ImageModal.vue'
import type { ImageModalForm } from './ImageModal.vue'

const emit = defineEmits<{
  (event: 'send', form: ImageModalForm): void
}>()

const { t } = useI18n()
const id = useId()

function onChange(form: ImageModalForm) {
  emit('send', form)
}
</script>
