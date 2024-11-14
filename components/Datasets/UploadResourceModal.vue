<template>
  <ModalWithButton
    :title="$t('Add a file')"
    size="lg"
  >
    <template #button="{ attrs, listeners }">
      <div class="flex flex-col items-center">
        <button
          class="fr-btn fr-btn--icon-left fr-icon-upload-line"
          v-bind="attrs"
          v-on="listeners"
        >
          {{ $t('Add files') }}
        </button>
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
          v-for="(resource, index) in files"
          :key="index"
          v-model="files[index]"
          class="fr-mb-3v"
          :show-edit-and-warning="false"
          @delete="removeFile(index)"
        />
        <p class="fr-hr-or text-transform-lowercase fr-text--regular text-mention-grey fr-mt-3v">
          <span class="fr-hr-or-text">{{ $t('or') }}</span>
        </p>
        <h2 class="subtitle subtitle--uppercase fr-mb-1w">
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
            class="fr-btn fr-btn--secondary fr-btn--secondary-grey-500"
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
import ModalWithButton from '../Modal/ModalWithButton.vue'
import UploadGroup from '../UploadGroup/UploadGroup.vue'
import type { NewDatasetFile } from '~/types/types'

const { t } = useI18n()
const formId = useId()

defineProps<{
  errorText?: string | null
}>()

const emit = defineEmits<{
  (e: 'newFiles', newFiles: Array<NewDatasetFile>): void
}>()

const url = ref('')

const { data: extensions } = await useAPI<Array<string>>('/api/1/datasets/extensions/')

const files = ref<Array<NewDatasetFile>>([])
const guessFormat = (file: File) => {
  const formatFromMime = file.type.includes('/') ? file.type.split('/').pop() || '' : file.type
  let guessedFormat = extensions.value.includes(formatFromMime) ? formatFromMime : ''
  if (!guessedFormat) {
    const formatFromName = file.name.includes('.') ? file.name.split('.').pop() || '' : file.name
    guessedFormat = extensions.value.includes(formatFromName) ? formatFromName : ''
  }
  return guessedFormat
}
const setFiles = (newFiles: Array<File>) => {
  for (const file of newFiles) {
    files.value.push({
      file,
      description: '',
      format: guessFormat(file),
      filesize: file.size,
      filetype: 'file',
      mime: file.type,
      title: file.name,
      type: 'main',
      state: 'none',
    })
  }
}
const removeFile = (position: number) => files.value.splice(position, 1)
const submit = (close: () => void) => {
  if (url.value) {
    files.value.push({
      description: '',
      filetype: 'remote',
      title: '',
      format: '',
      mime: '',
      type: 'main',
      url: url.value,
      state: 'none',
    })
  }

  emit('newFiles', files.value)
  files.value = []
  close()
}
</script>
