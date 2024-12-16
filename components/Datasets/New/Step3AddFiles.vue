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
          <div class="prose prose-neutral fr-m-0">
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
          :state="accordionState('hasDocumentation')"
        >
          <div class="prose prose-neutral fr-m-0">
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
            v-if="getFirstWarning('hasDocumentation')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getFirstWarning('hasDocumentation') }}
          </Well>
        </Accordion>
      </AccordionGroup>
    </Sidemenu>
    <div class="fr-col-12 fr-col-md-7">
      <PaddedContainer>
        <NewWell
          type="primary"
          class="mb-4 flex items-center space-x-5"
        >
          <NuxtImg
            src="/illustrations/edit.svg"
            loading="lazy"
            class="size-14 shrink-0"
            alt=""
          />
          <div class="w-full">
            <p class="font-bold mb-1">
              {{ $t('What is a file?') }}
            </p>
            <p class="m-0 text-xs/5">
              {{ $t('A dataset can contain multiple types of files (updates, history, documentation, source code, API, link, etc.)') }}
            </p>
          </div>
        </NewWell>

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
          >
            <PaddedContainer
              v-if="form.files.length === 0"
              class="flex flex-col items-center"
              color="alt-grey"
            >
              <h3 class="fr-text--md fr-text--bold fr-m-0 fr-mb-2w">
                {{ $t("Add your first files") }}
              </h3>
              <UploadResourceModal
                :error-text="getFirstError('files')"
                @new-files="addFiles"
              />
            </PaddedContainer>
            <template v-else>
              <FileCard
                v-for="(_, index) in form.files"
                :key="index"
                v-model="form.files[index]"
                class="fr-mb-3v"
                @delete="removeFile(index)"
              />
              <div class="fr-grid-row fr-grid-row--center">
                <UploadResourceModal
                  @new-files="addFiles"
                />
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
        <div class="fr-grid-row justify-between">
          <BrandedButton
            color="secondary"
            @click="$emit('previous')"
          >
            {{ $t("Previous") }}
          </BrandedButton>
          <BrandedButton
            :loading
            color="primary"
            @click="submit"
          >
            {{ $t("Next") }}
          </BrandedButton>
        </div>
      </PaddedContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Well } from '@datagouv/components'
import UploadResourceModal from '../UploadResourceModal.vue'
import type { NewDatasetFile } from '~/types/types'

defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  previous: []
  next: [value: Array<NewDatasetFile>]
}>()

const files = defineModel<Array<NewDatasetFile>>({ required: true })

const { t } = useI18n()

const publishFileAccordionId = useId()
const addDescriptionAccordionId = useId()

const { form, getFirstError, getFirstWarning, touch, validate, errorsAsList: errors } = useForm({
  files,
  hasDocumentation: false,
}, {
  files: [required(t('At least one file is required.'))],
}, {
  files: [files => files.find(file => !isClosedFormat(file.format)) ? null : t('You did not add a file with an open format.')],
  hasDocumentation: [hasDocumentation => !hasDocumentation ? t('You have not added a documentation file or described your files.') : null],
})

watchEffect(() => {
  form.value.hasDocumentation = !!form.value.files.length && form.value.files.some(file => file.type === 'documentation')
  touch('hasDocumentation')
})

const addFiles = (files: Array<NewDatasetFile>) => {
  for (const file of files) form.value.files.push(file)
  touch('files')
}
const removeFile = (position: number) => {
  form.value.files.splice(position, 1)
  touch('files')
}

const submit = () => {
  if (validate()) {
    try {
      emit('next', form.value.files)
    }
    catch {
      // here
    }
    finally {
      //
    }
  }
}

const accordionState = (key: keyof typeof form.value) => {
  if (getFirstError(key)) return 'error'
  if (getFirstWarning(key)) return 'warning'

  return 'default'
}
</script>
