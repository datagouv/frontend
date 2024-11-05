<template>
  <div class="border border-default-grey fr-p-1w">
    <div class="fr-grid-row fr-grid-row--middle no-wrap wrap-md justify-between">
      <div class="fr-col-auto min-width-0">
        <div class="flex items-center">
          <component
            :is="getResourceFormatIcon(file.format) || File"
            class="size-4 text-gray-800 shrink-0 mr-1"
            :resource="file"
          />
          <h4 class="fr-m-0 fr-text--sm overflow-wrap-anywhere text-overflow-ellipsis">
            {{ file.title || $t('Nameless resource') }}
          </h4>
        </div>
        <div class="fr-my-0 text-grey-380 fr-grid-row fr-grid-row--middle">
          <p
            v-if="'file' in file"
            class="fr-text--xs fr-m-0 overflow-wrap-anywhere text-overflow-ellipsis dash-after"
          >
            {{ file.file.name }}
          </p>
          <p
            v-if="'file' in file"
            class="fr-text--xs fr-m-0"
          >
            {{ $t('Updated {date}', { date: formatRelativeIfRecentDate(file.file.lastModified) }) }}
          </p>
          <p
            v-if="file.format"
            class="fr-text--xs fr-m-0 dash-before"
          >
            {{ file.format.trim()?.toLowerCase() }}
            <template v-if="'filesize' in file">
              ({{ formatFilesize(file.filesize) }})
            </template>
          </p>
        </div>
      </div>
      <div
        v-if="!hideActions && !loaded"
        class="fr-col-auto"
      >
        <FileLoader v-if="loading" />
        <div
          v-else
          class="fr-grid-row fr-grid-row--middle no-wrap wrap-md"
        >
          <p class="fr-col-auto fr-m-0">
            <button
              type="button"
              class="fr-btn fr-btn--secondary fr-btn--secondary-grey-500 fr-icon-delete-line fr-icon--sm"
              @click="$emit('delete')"
            >
              {{ $t("Remove file") }}
            </button>
          </p>
          <p
            v-if="showEditAndWarning"
            class="fr-col-auto fr-ml-1w fr-m-0"
          >
            <FileEditModal v-model="file" />
          </p>
        </div>
      </div>
    </div>
    <!-- <p
      v-for="stateError in stateErrors"
      v-if="stateErrors.length"
      class="fr-mt-1w fr-mb-0 fr-text--xs text-default-error"
    >
      <span
        class="fr-icon-error-line fr-icon--sm"
        aria-hidden="true"
      />
      {{ stateError }}
    </p>
    <p
      v-for="stateWarning in stateWarnings"
      v-else-if="stateWarnings.length && showEditAndWarning"
      class="fr-mt-1w fr-mb-0 fr-text--xs text-default-warning"
    >
      <span
        class="fr-icon-warning-line fr-icon--sm"
        aria-hidden="true"
      />
      {{ stateWarning }}
    </p> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { filesize as formatFilesize, formatRelativeIfRecentDate } from '@datagouv/components'
// import useFileValidation from '../../../composables/form/useFileValidation'
// import { isLoaded, isLoading } from '../../../api/resources'
import File from '../Icons/File.vue'
import FileEditModal from '../Datasets/FileEditModal.vue'
import FileLoader from './FileLoader.vue'
import type { NewDatasetFile } from '~/types/types'

const file = defineModel<NewDatasetFile>({ required: true })

withDefaults(defineProps<{
  showEditAndWarning?: boolean
  hideActions?: boolean
}>(), {
  showEditAndWarning: true,
  hideActions: false,
})

defineEmits<{
  (e: 'delete' | 'edit'): void
}>()

const loading = computed(() => file.value.state === 'loading')
const loaded = computed(() => file.value.state === 'loaded')
// const { stateErrors, stateWarnings, validateRequiredRules } = useFileValidation(file)

// onMounted(() => validateRequiredRules())

// watch(props.file, () => file.value = { ...props.file })
</script>
