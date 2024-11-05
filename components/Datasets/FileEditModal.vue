<template>
  <ModalWithButton
    :title="t('File metadata')"
    size="fullscreen"
  >
    <template #button="{ attrs, listeners }">
      <button
        class="fr-btn fr-icon-pencil-line fr-icon--sm"
        v-bind="attrs"
        v-on="listeners"
      >
        {{ $t("Edit file") }}
      </button>
    </template>

    <template #default="{ close }">
      <form
        :id="formId"
        @submit.prevent="submit(close)"
      >
        <div class="fr-grid-row">
          <Sidemenu
            class="fr-col-12 fr-col-md-5"
            :button-text="$t('Help')"
            :on-right="true"
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
                v-if="isRemote"
                :id="chooseTheCorrectLinkAccordionId"
                :title="$t('Choose the correct link')"
                :state="accordionState('url')"
              >
                {{ $t("It's advised to put the link to the file itself instead of a web page to allow {site} to parse it.") }}
              </Accordion>
              <Accordion
                :id="nameAFileAccordionId"
                :title="nameAFile"
                :state="accordionState('title')"
              >
                <div class="markdown fr-m-0">
                  <p class="fr-m-0 fr-mb-1w">
                    {{ $t("It is recommended to choose a title that can inform any user about the content of the file. Some practices to avoid:") }}
                  </p>
                  <ul>
                    <li>{{ $t('giving a too generic title (e.g., "list.csv");') }}</li>
                    <li>{{ $t("giving a too long title that would make the file manipulation difficult;") }}</li>
                    <li>{{ $t("giving a title containing accents or special characters (file interoperability issues);") }}</li>
                    <li>{{ $t("giving a title that is too technical and derived from business nomenclatures.") }}</li>
                  </ul>
                </div>
              </Accordion>
              <Accordion
                :id="chooseTheRightTypeOfFileAccordionId"
                :title="$t('Publish the correct file types')"
                :state="accordionState('type')"
              >
                <div class="markdown fr-m-0">
                  <p class="fr-m-0 fr-mb-1w">
                    {{ $t("You can choose from the following types:") }}
                  </p>
                  <ul>
                    <li
                      v-for="fileType in fileTypes"
                      :key="fileType.value"
                    >
                      {{ fileType.label }}
                    </li>
                  </ul>
                </div>
              </Accordion>
              <Accordion
                :id="chooseTheCorrectFormatAccordionId"
                :title="$t('Choose the right format')"
                :state="accordionState('format')"
              >
                <div class="markdown fr-m-0">
                  <p class="fr-m-0 fr-mb-1w">
                    {{ $t("The formats must be:") }}
                  </p>
                  <ul>
                    <li>{{ $t("open : an open format doesn't add technical specifications that restrict data use (i.e. using a paid software) ;") }}</li>
                    <li>{{ $t("easily reusable : a format easily reusable implies that anybody or server can reuse easily the dataset ;") }}</li>
                    <li>{{ $t("usable in an automated processing system : an automated processing system allows to make automatic operations, related to data exploitation (i.e. a CSV file is easily usable by an automated system unlike a PDF file).") }}</li>
                  </ul>
                </div>
              </Accordion>
              <Accordion
                :id="writeAGoodDescriptionAccordionId"
                :title="$t('Add documentation')"
                :state="accordionState('description')"
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
                  v-if="getFirstWarning('description')"
                  class="fr-mt-1w"
                  color="orange-terre-battue"
                >
                  {{ getFirstWarning("description") }}
                </Well>
              </Accordion>
              <Accordion
                :id="selectASchemaAccordionId"
                :title="$t('Select a schema')"
                :state="accordionState('schema')"
              >
                <i18n-t
                  keypath="It is possible to identify an existing data schema by visiting the {schema} website, that references a list of existing data schema."
                  tag="p"
                  class="fr-m-0 fr-mb-1w"
                >
                  <template #schema>
                    <a :href="config.public.schemasSite.url">{{ config.public.schemasSite.name }}</a>
                  </template>
                </i18n-t>
              </Accordion>
            </AccordionGroup>
          </Sidemenu>
          <div class="fr-col-12 fr-col-md-7">
            <Container>
              <fieldset
                class="fr-fieldset min-width-0"
                aria-labelledby="description-legend"
              >
                <legend
                  id="description-legend"
                  class="fr-fieldset__legend"
                >
                  <h2 class="subtitle subtitle--uppercase fr-mb-3v">
                    {{ $t("File metadata") }}
                  </h2>
                </legend>
                <div class="fr-fieldset__element">
                  <FileCard
                    v-model="file"
                    class="fr-mb-3v"
                    :hide-actions="true"
                  />
                </div>
                <LinkedToAccordion
                  v-if="isRemote"
                  class="fr-fieldset__element min-width-0"
                  :accordion="chooseTheCorrectLinkAccordionId"
                  @blur="touch('url')"
                >
                  <InputGroup
                    v-model="file.url"
                    :label="$t('Link url')"
                    :required="true"
                    :has-error="!!getFirstError('url')"
                    :error-text="getFirstError('url')"
                  />
                </LinkedToAccordion>
                <LinkedToAccordion
                  class="fr-fieldset__element min-width-0"
                  :accordion="nameAFileAccordionId"
                  @blur="touch('title')"
                >
                  <InputGroup
                    v-model="file.title"
                    :label="fileTitle"
                    :required="true"
                    :has-error="!!getFirstError('title')"
                    :error-text="getFirstError('title')"
                  />
                </LinkedToAccordion>
                <LinkedToAccordion
                  class="fr-fieldset__element min-width-0"
                  :accordion="chooseTheRightTypeOfFileAccordionId"
                  @blur="touch('type')"
                >
                  <!-- <SelectGroup
                    v-model="file.type"
                    :label="$t('Type')"
                    :required="true"
                    :has-error="!!getFirstError('type')"
                    :error-text="getFirstError('type')"
                    :options="fileTypes"
                  /> -->
                </LinkedToAccordion>
                <LinkedToAccordion
                  class="fr-fieldset__element min-width-0"
                  :accordion="chooseTheCorrectFormatAccordionId"
                  @blur="touch('format')"
                >
                  <!-- <MultiSelect
                    :placeholder="$t('Format')"
                    :search-placeholder="$t('Search a format...')"
                    :list-url="allowedExtensionsUrl"
                    :suggest-url="isRemote ? 'datasets/suggest/formats/' : null"
                    :values="file.format"
                    :required="true"
                    :has-error="!!getFirstError('format')"
                    :has-warning="!!getFirstWarning('format')"
                    :error-text="getFirstError('format')"
                    :all-option="$t('Select a format')"
                    :add-all-option="false"
                    :add-new-option="isRemote"
                    @change="(value) => file.format = value"
                  /> -->
                </LinkedToAccordion>
                <LinkedToAccordion
                  class="fr-fieldset__element min-width-0"
                  :accordion="writeAGoodDescriptionAccordionId"
                  @blur="touch('description')"
                >
                  <InputGroup
                    v-model="file.description"
                    :label="$t('Description')"
                    :has-warning="!!getFirstWarning('description')"
                    :error-text="getFirstWarning('description')"
                    type="textarea"
                  />
                </LinkedToAccordion>
                <LinkedToAccordion
                  class="fr-fieldset__element min-width-0"
                  :accordion="selectASchemaAccordionId"
                  @blur="touch('schema')"
                >
                  <!-- <SchemaSelect
                    :all-option="$t('Select a schema')"
                    :values="file.schema"
                    :show-explanation="false"
                    @change="(value) => file.schema = value"
                  /> -->
                </LinkedToAccordion>
                <LinkedToAccordion
                  class="fr-fieldset__element min-width-0"
                  :accordion="whatIsAMimeTypeAccordionId"
                  @blur="touch('mime')"
                >
                  <!-- <MultiSelect
                    :placeholder="$t('Mime type')"
                    :search-placeholder="$t('Search a mime type...')"
                    suggest-url="datasets/suggest/mime/"
                    :values="file.mime"
                    :all-option="$t('Select a mime type')"
                    :add-all-option="false"
                    :add-new-option="isRemote"
                    @change="(value) => file.mime = value"
                  /> -->
                </LinkedToAccordion>
              </fieldset>
              <div class="fr-grid-row fr-grid-row--right">
                <button
                  class="fr-btn"
                  @click="submit(close)"
                >
                  {{ $t("Save") }}
                </button>
              </div>
            </Container>
          </div>
        </div>
      </form>
    </template>

    <template #footer="{ close }">
      <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--right">
        <div class="fr-col-auto">
          <button
            class="fr-btn fr-btn--secondary fr-btn--secondary-grey-500"
            type="button"
            @click="cancel(close)"
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
            {{ t("Validate") }}
          </button>
        </div>
      </div>
    </template>
  </ModalWithButton>
</template>

<script setup lang="ts">
import { getResourceLabel, RESOURCE_TYPE, Well } from '@datagouv/components'
import ModalWithButton from '../Modal/ModalWithButton.vue'
import type { NewDatasetFile } from '~/types/types'

const file = defineModel<NewDatasetFile>({ required: true })
const { form, getFirstError, getFirstWarning, touch } = useForm(file.value, {}, {})

const { t } = useI18n()
const config = useRuntimeConfig()
const formId = useId()

const chooseTheCorrectLinkAccordionId = useId()
const nameAFileAccordionId = useId()
const chooseTheRightTypeOfFileAccordionId = useId()
const chooseTheCorrectFormatAccordionId = useId()
const writeAGoodDescriptionAccordionId = useId()
const selectASchemaAccordionId = useId()
const whatIsAMimeTypeAccordionId = useId()

const isRemote = computed(() => file.value.filetype === 'remote')
const nameAFile = computed(() => isRemote.value ? t('Name a link') : t('Name a file'))
const fileTitle = computed(() => isRemote.value ? t('Link title') : t('File title'))
const fileTypes = RESOURCE_TYPE.map(type => ({ label: getResourceLabel(type), value: type }))

const submit = (close: () => void) => {
  file.value = form.value
  close()
}
const cancel = (close: () => void) => {
  form.value = file.value
  close()
}

const accordionState = (key: keyof typeof form.value) => {
  if (getFirstError(key)) return 'error'
  if (getFirstWarning(key)) return 'warning'

  return 'default'
}
</script>
