<template>
  <div class="border border-default-grey fr-p-1w">
    <div class="fr-grid-row fr-grid-row--middle no-wrap wrap-md justify-between">
      <div class="fr-col-auto min-width-0">
        <div class="flex items-center">
          <component
            :is="(resourceForm.filetype === 'remote' ? getResourceFormatIcon(resourceForm.format) : null) || File"
            class="size-4 text-gray-800 shrink-0 mr-1"
          />
          <h4 class="fr-m-0 fr-text--sm overflow-wrap-anywhere text-overflow-ellipsis">
            {{ resourceForm.title || $t('Nameless resource') }}
          </h4>
        </div>
        <div class="fr-my-0 text-grey-380 fr-grid-row fr-grid-row--middle">
          <p
            v-if="resourceForm.filetype === 'file' && resourceForm.file && resourceForm.file.raw.name != resourceForm.title"
            class="fr-text--xs fr-m-0 overflow-wrap-anywhere text-overflow-ellipsis dash-after"
          >
            {{ resourceForm.file.raw.name }}
          </p>
          <p
            v-if="resourceForm.resource"
            class="fr-text--xs fr-m-0 dash-after"
          >
            <!-- Not sure if this date is useful, since it's about modification on a ressource  -->
            {{ $t('Updated {date}', { date: formatRelativeIfRecentDate(resourceForm.resource.last_modified) }) }}
          </p>
          <p
            v-if="guessFormat(resourceForm, extensions)"
            class="fr-text--xs fr-m-0"
          >
            {{ guessFormat(resourceForm, extensions) }}
            <template v-if="resourceForm.filetype === 'file' && resourceForm.file">
              ({{ formatFilesize(resourceForm.file.raw.size) }})
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
            <FileEditModal
              v-model="resourceForm"
              @submit="(close) => close()"
            />
          </p>
        </div>
      </div>
    </div>
    <template v-if="errors && showEditAndWarning">
      <template
        v-for="(fieldErrors, key) in errors"
        :key="key"
      >
        <p
          v-if="fieldErrors && fieldErrors.length"
          class="fr-mt-1w fr-mb-0 fr-text--xs text-default-error"
        >
          <span
            class="fr-icon-error-line fr-icon--sm"
            aria-hidden="true"
          />
          {{ fieldErrors[0] }}
        </p>
      </template>
    </template>
    <template v-if="warnings && showEditAndWarning">
      <template
        v-for="(fieldWarnings, key) in warnings"
        :key="key"
      >
        <p
          v-if="fieldWarnings && fieldWarnings.length"
          class="fr-mt-1w fr-mb-0 fr-text--xs text-default-warning"
        >
          <span
            class="fr-icon-warning-line fr-icon--sm"
            aria-hidden="true"
          >
            {{ fieldWarnings[0] }}
          </span>
        </p>
      </template>
    </template>
    <p
      v-if="resourceForm.filetype === 'file' && resourceForm.file?.state.status === 'failed'"
      class="fr-mt-1w fr-mb-0 fr-text--xs text-default-error"
    >
      <span
        class="fr-icon-error-line fr-icon--sm"
        aria-hidden="true"
      />
      {{ resourceForm.file.state.message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { filesize as formatFilesize, formatRelativeIfRecentDate } from '@datagouv/components'
import File from '../Icons/File.vue'
import FileEditModal from '../Datasets/FileEditModal.vue'
import FileLoader from './FileLoader.vue'
import type { ResourceForm } from '~/types/types'

const resourceForm = defineModel<ResourceForm>({ required: true })

withDefaults(defineProps<{
  showEditAndWarning?: boolean
  hideActions?: boolean
  extensions: Array<string>
}>(), {
  showEditAndWarning: true,
  hideActions: false,
})

defineEmits<{
  (e: 'delete' | 'edit'): void
}>()

const loading = computed(() => resourceForm.value.filetype === 'file' && resourceForm.value.file?.state.status === 'loading')
const loaded = computed(() => resourceForm.value.filetype === 'file' && resourceForm.value.file?.state.status === 'uploaded')

// Only useful to get potentials errors (no modification here)
const { errors, warnings, validate } = useResourceForm(resourceForm)
watchEffect(() => validate())
</script>
