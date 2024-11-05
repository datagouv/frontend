<template>
  <div class="fr-grid-row">
    <Sidemenu
      class="fr-col-12 fr-col-md-5"
      :button-text="$t('Help')"
      :on-right="true"
      :fixed="true"
      :show-border="false"
    >
      <template #title>
        <span
          class="fr-icon--sm fr-icon-question-line"
          aria-hidden="true"
        />
        {{ $t('Help') }}
      </template>
      <AccordionGroup>
        <Accordion
          :id="publishFileAccordionId"
          :title="$t('Choose the right format')"
          :state="accordionState('files')"
          :opened="true"
        >
          <div class="markdown fr-m-0">
            <p class="fr-m-0 fr-mb-1w">
              {{ $t("Formats should be :") }}
            </p>
            <ul>
              <li>{{ $t("open : an open format doesn't add technical specifications that restrict data use (i.e. using a paid software) ;") }}</li>
              <li>{{ $t("easily reusable : a format easily reusable implies that anybody or server can reuse easily the dataset ;") }}</li>
              <li>{{ $t("usable in an automated processing system : an automated processing system allows to make automatic operations, related to data exploitation (i.e. a CSV file is easily usable by an automated system unlike a PDF file).") }}</li>
            </ul>
          </div>
          <Well
            v-if="getFirstWarning('files')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getFirstWarning("files") }}
          </Well>
        </Accordion>
        <Accordion
          :id="addDescriptionAccordionId"
          :title="$t('Add documentation')"
          :state="hasDocumentation ? 'warning': 'default'"
        >
          <div class="markdown fr-m-0">
            <p class="fr-m-0 fr-mb-1w">
              {{ $t("The description of a file facilitates the reuse of data. It includes, among others:") }}
            </p>
            <ul>
              <li>{{ $t("a general description of the dataset ;") }}</li>
              <li>{{ $t("a description of the data production mode ;") }}</li>
              <li>{{ $t("a description of the data model ;") }}</li>
              <li>{{ $t("a description of the data schema ;") }}</li>
              <li>{{ $t("a description of the metadata ;") }}</li>
              <li>{{ $t("a description of major changes.") }}</li>
            </ul>
          </div>
          <Well
            v-if="! hasDocumentation"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ t("You have not added a documentation file or described your files.") }}
          </Well>
        </Accordion>
      </AccordionGroup>
    </Sidemenu>
    <div class="fr-col-12 fr-col-md-7">
      <div>
        <Well
          color="blue-cumulus"
          weight="regular"
          class="fr-mb-2w"
        >
          <div class="fr-grid-row">
            <div class="fr-col-auto fr-mr-3v">
              <img
                src="/illustrations/edit.svg"
                alt=""
              >
            </div>
            <div class="fr-col">
              <p class="fr-m-0 fr-text--bold">
                {{ $t('What is a file?') }}
              </p>
              <p class="fr-m-0 fr-text--xs">
                {{ $t('A dataset can contain multiple types of files (updates, history, documentation, source code, API, link, etc.)') }}
              </p>
            </div>
          </div>
        </Well>
        <fieldset
          class="fr-fieldset min-width-0"
          aria-labelledby="description-legend"
        >
          <legend
            id="description-legend"
            class="fr-fieldset__legend"
          >
            <h2 class="subtitle subtitle--uppercase fr-mb-3v">
              {{ $t("Files") }}
            </h2>
          </legend>
          <LinkedToAccordion
            class="fr-fieldset__element min-width-0"
            :accordion="publishFileAccordionId"
            @blur="touch('files')"
          >
            <div
              v-if="form.files.length === 0"
              class="bg-white p-8 flex flex-col items-center"
            >
              <h3 class="fr-text--md fr-text--bold fr-m-0 fr-mb-2w">
                {{ $t("Add your first files") }}
              </h3>
              <UploadResourceModal @new-files="addFiles" />
              <!-- <UploadModalButton
                group-class="fr-grid-row flex-direction-column fr-grid-row--middle"
                :label="$t('Add files')"
                :title="$t('Add files (opens a modal dialog)')"
                :multiple="true"
                :required="true"
                :has-error="!!getFirstError('files')"
                :error-text="getFirstError('files')"
                @change="addFiles"
              /> -->
            </div>
            <template v-else>
              <FileCard
                v-for="(resource, index) in form.files"
                :key="index"
                v-model="form.files[index]"
                class="fr-mb-3v"
                @delete="removeFile(index)"
              />
              <div class="fr-grid-row fr-grid-row--center">
                <!-- <ButtonLoader
                  v-if="loading"
                  :width="114"
                />
                <UploadModalButton
                  v-else
                  :label="$t('Add files')"
                  :title="$t('Add files (opens a modal dialog)')"
                  :multiple="true"
                  :required="true"
                  :has-error="!!getFirstError('files')"
                  :error-text="getFirstError('files')"
                  @change="addFiles"
                /> -->
              </div>
            </template>
          </LinkedToAccordion>
        </fieldset>
        <Alert
          v-if="errors.length"
          type="error"
          class="fr-mt-n2w fr-mb-2w"
        >
          <template #title>
            {{ $t("An error occured | Some errors occured", errors.length) }}
          </template>
          <ul v-if="errors.length > 1">
            <li
              v-for="error in errors"
              :key="error"
            >
              {{ error }}
            </li>
          </ul>
          <p v-else>
            {{ errors[0] }}
          </p>
        </Alert>
        <div class="fr-grid-row fr-grid-row--right">
          <!-- <ButtonLoader
            v-if="loading"
            :width="66"
          />
          <button
            v-else
            class="fr-btn"
            @click="submit"
          >
            {{ $t("Next") }}
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Well } from '@datagouv/components'
import UploadResourceModal from '../UploadResourceModal.vue'
import type { NewDatasetFile } from '~/types/types'

const { t } = useI18n()

const publishFileAccordionId = useId()
const addDescriptionAccordionId = useId()

const { form, getFirstError, getFirstWarning, touch } = useForm({
  files: [] as Array<NewDatasetFile>,
})

const loading = ref(false)
const errors = ref([])
const addFiles = (files: Array<NewDatasetFile>) => {
  for (const file of files) form.value.files.push(file)
}
const removeFile = (position: number) => form.value.files.splice(position, 1)

const submit = () => {}

const hasDocumentation = computed(() => {
  if (!form.value.files.length) return true // If no file, do not bother the user with missing documentation
  if (form.value.files.some(file => file.type === 'documentation')) return true // TODO fix here
  return false
})

const accordionState = (key: keyof typeof form.value) => {
  if (getFirstError(key)) return 'error'
  if (getFirstWarning(key)) return 'warning'

  return 'default'
}

// import { Well } from '@datagouv/components/ts'
// import { computed, ref, toValue, watchEffect } from 'vue'
// import { useI18n } from 'vue-i18n'
// import type { Step } from '../../components/Form/Stepper/Stepper.vue'
// import Accordion from '../../components/Accordion/Accordion.vue'
// import Alert from '../../components/Alert/Alert.vue'
// import ButtonLoader from '../../components/Form/ButtonLoader.vue'
// import Container from '../../components/Ui/Container/Container.vue'
// import FileCard from '../../components/Form/FileCard/FileCard.vue'
// import LinkedToAccordion from '../../components/Form/LinkedToAccordion/LinkedToAccordion.vue'
// import Sidemenu from '../../components/Sidemenu/Sidemenu.vue'
// import Stepper from '../../components/Form/Stepper/Stepper.vue'
// import UploadModalButton from '../../components/Form/UploadGroup/UploadModalButton.vue'
// import useUid from '../../composables/useUid'
// import useFunctionalState from '../../composables/form/useFunctionalState'
// import { requiredWithCustomMessage, withMessage } from '../../i18n'
// import editIcon from '../../../../templates/svg/illustrations/edit.svg'
// import { isClosedFormat } from '../../helpers'

// export type Step3AddFilesProps = {
//   errors: Array<string>
//   loading?: boolean
//   steps: Array<Step>
//   originalFiles: Array<NewDatasetFile>
// }

// const props = withDefaults(defineProps<Step3AddFilesProps>(), {
//   loading: false,
// })

// const emit = defineEmits<{
//   editFile: [files: Step3AddFilesProps['originalFiles'], index: number]
//   next: [files: Step3AddFilesProps['originalFiles']]
// }>()

// const { t } = useI18n()

// const files = ref<Step3AddFilesProps['originalFiles']>([])

// watchEffect(() => {
//   files.value = [...props.originalFiles]
// })

// const fileRequired = requiredWithCustomMessage(t('At least one file is required.'))

// /**
//    * Validates that the dataset contains an open format file.
//    */
// const onefileHasOpenFormats = (value: Array<NewDatasetFile>) => value.reduce((previous, current) => previous || !isClosedFormat(current.format), false)

// /**
//    * Validates that the dataset contains a documentation file.
//    */
// const hasDocumentation = (_value: undefined, siblings: { files: Array<NewDatasetFile> }) => siblings.files.reduce((previous, current) => previous || current.type === 'documentation' || !!current.description?.trim(), false)

// const requiredRules = {
//   files: { fileRequired },
// }

// const warningRules = {
//   files: { fileRequired, openFormat: withMessage(t('You did not add a file with an open format.'), onefileHasOpenFormats) },
//   hasDocumentation: { hasDocumentation: withMessage(t('You have not added a documentation file or described your files.'), hasDocumentation) },
// }

// const { getErrorText, getFunctionalState, getWarningText, hasError, hasWarning, validateRequiredRules, v$, vWarning$ } = useFunctionalState({ files, hasDocumentation: {} }, requiredRules, warningRules)

// const addFiles = (newFiles: Array<NewDatasetFile>) => {
//   files.value.push(...newFiles)
//   if (newFiles.length === 1 && newFiles[0].filetype === 'remote') {
//     emit('editFile', toValue(files), files.value.length - 1)
//   }
// }

// const removeFile = (position: number) => files.value.splice(position, 1)

// const state = computed(() => {
//   return {
//     files: getFunctionalState(vWarning$.value.files.$dirty, v$.value.files.$invalid, vWarning$.value.files.$error),
//     hasDocumentation: getFunctionalState(vWarning$.value.hasDocumentation.$dirty, false, vWarning$.value.hasDocumentation.$error),
//   }
// })

// const touch = () => {
//   v$.value.files.$touch()
//   vWarning$.value.files.$touch()
//   vWarning$.value.hasDocumentation.$touch()
// }

// const submit = () => {
//   validateRequiredRules().then((validated) => {
//     if (validated) {
//       emit('next', toValue(files))
//     }
//   })
// }

// const fieldHasError = (field: string) => hasError(state, field)

// const fieldHasWarning = (field: string) => hasWarning(state, field)
</script>
