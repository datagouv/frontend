<template>
  <ModalWithButton
    :title="t('TODO')"
    size="lg"
  >
    <template #button="{ attrs, listeners }">
      <button
        class="fr-btn fr-btn--icon-left fr-icon-upload-line"
        v-bind="attrs"
        v-on="listeners"
      >
        {{ $t('Add files') }}
      </button>
    </template>

    <template #default="{ close }">
      <h2 class="subtitle subtitle--uppercase fr-mb-1w">
        {{ $t('Add a file') }}
      </h2>
      <UploadGroup
        :label="$t('Upload files')"
        type="drop"
        :accept="extensions.join(',')"
        :multiple="true"
        :required="true"
        :hint-text="$t('Max size: 420 Mb. Multiple files allowed.')"
        @change="setFiles"
      />
      <FileCard
        v-for="(resource, index) in files"
        :key="index"
        class="fr-mb-3v"
        :file="resource"
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
        :label="$t('Exact link to the file')"
        :hint-text="$t('Type a valid url, starting with https://')"
        placeholder="https://"
        type="url"
      />
      <!-- :has-error="fieldHasError('modalFiles')"
        :error-text="getErrorText('modalFiles')"
        @change="setFileLink" -->
    </template>

    <template #footer="{ close }">
      <!-- <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--right">
        <div class="fr-col-auto">
          <button
            class="fr-btn fr-btn--secondary fr-btn--secondary-grey-500"
            type="button"
            :disabled="loading"
            @click="close"
          >
            {{ t("Cancel") }}
          </button>
        </div>
        <div class="fr-col-auto">
          <button
            class="fr-btn"
            type="submit"
            :disabled="loading || !refuseComment"
            :form="refuseFormId"
          >
            {{ t("Refuse request") }}
          </button>
        </div>
      </div> -->
    </template>
  </ModalWithButton>
</template>

<script setup lang="ts">
import ModalWithButton from '../Modal/ModalWithButton.vue'
import UploadGroup from '../UploadGroup/UploadGroup.vue'

const { t } = useI18n()

const { data: extensions } = await useAPI<Array<string>>('/api/1/datasets/extensions/')

const files = ref([])
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
</script>
