<template>
  <ModalWithButton
    :title="$t('Add a file')"
    size="lg"
  >
    <template #button="{ attrs, listeners }">
      <div class="flex flex-col items-center">
        <BrandedButton
          color="primary"
          size="xs"
          :icon="RiUploadLine"
          v-bind="attrs"
          v-on="listeners"
        >
          {{ $t('Add files') }}
        </BrandedButton>
        <p
          v-if="errorText"
          class="fr-error-text mt-4 mb-0"
        >
          {{ errorText }}
        </p>
      </div>
    </template>

    <template #default="{ close }">
      <form
        :id="formId"
        @submit.prevent="submit(close)"
      >
        <UploadGroup
          :label="$t('Upload files')"
          type="drop"
          :accept="extensions.join(',')"
          :multiple="true"
          :hint-text="$t('Max size: 420 Mb. Multiple files allowed.')"
          @change="setFiles"
        />
        <FileCard
          v-for="(resourceForm, index) in resourceForms"
          :key="index"
          v-model="resourceForms[index]"
          class="fr-mb-3v"
          :show-edit-and-warning="false"
          :extensions
          @delete="removeFile(index)"
        />
        <p class="fr-hr-or text-transform-lowercase fr-text--regular text-mention-grey fr-mt-3v">
          <span class="fr-hr-or-text">{{ $t('or') }}</span>
        </p>
        <h2 class="text-sm font-bold uppercase mb-2">
          {{ $t('Add a link') }}
        </h2>
        <InputGroup
          v-model="url"
          :label="$t('Exact link to the file')"
          :hint-text="$t('Type a valid url, starting with https://')"
          placeholder="https://"
          type="url"
        />
      </form>
      <!-- :has-error="fieldHasError('modalFiles')"
        :error-text="getErrorText('modalFiles')"
        @change="setFileLink" -->
    </template>

    <template #footer="{ close }">
      <div class="w-full flex gap-4 justify-end">
        <div class="fr-col-auto">
          <button
            class="fr-btn fr-btn--secondary fr-btn--secondary-gray-500"
            type="button"
            @click="close"
          >
            {{ t("Cancel") }}
          </button>
        </div>
        <div class="fr-col-auto">
          <button
            class="fr-btn"
            type="submit"
            :form="formId"
          >
            {{ t("Send") }}
          </button>
        </div>
      </div>
    </template>
  </ModalWithButton>
</template>

<script setup lang="ts">
import { RiUploadLine } from '@remixicon/vue'
import BrandedButton from '../BrandedButton/BrandedButton.vue'
import ModalWithButton from '../Modal/ModalWithButton.vue'
import UploadGroup from '../UploadGroup/UploadGroup.vue'
import type { ResourceForm } from '~/types/types'

const { t } = useI18n()
const formId = useId()

defineProps<{
  errorText?: string | null
  extensions: Array<string>
}>()

const emit = defineEmits<{
  (e: 'newFiles', newFiles: Array<ResourceForm>): void
}>()

const url = ref('')

const resourceForms = ref<Array<ResourceForm>>([])

const setFiles = (newFiles: Array<File>) => {
  for (const file of newFiles) {
    resourceForms.value.push({
      filetype: 'file',
      title: file.name,
      type: 'main',
      description: '',
      schema: null,
      file: {
        raw: file,
        state: { status: 'waiting' },
      },
      resource: null,
    })
  }
}
const removeFile = (position: number) => resourceForms.value.splice(position, 1)
const submit = (close: () => void) => {
  if (url.value) {
    resourceForms.value.push({
      filetype: 'remote',
      title: '',
      type: 'main',
      description: '',
      schema: null,

      url: url.value,
      format: '',
      mime: null,
      resource: null,
    })
  }

  emit('newFiles', resourceForms.value)
  resourceForms.value = []
  close()
}
</script>
