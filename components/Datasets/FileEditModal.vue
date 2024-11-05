<template>
  <ModalWithButton
    :title="t('File metadata')"
    size="fullscreen"
    @open="removeErrorsAndWarnings"
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
                    v-model="form"
                    class="fr-mb-3v"
                    :hide-actions="true"
                  />
                </div>
                <LinkedToAccordion
                  v-if="'url' in form"
                  class="fr-fieldset__element min-width-0"
                  :accordion="chooseTheCorrectLinkAccordionId"
                  @blur="touch('url')"
                >
                  <InputGroup
                    v-model="form.url"
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
                    v-model="form.title"
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
                  <SelectGroup
                    v-model="form.type"
                    :label="$t('Type')"
                    :required="true"
                    :has-error="!!getFirstError('type')"
                    :error-text="getFirstError('type') || undefined"
                    :options="fileTypes"
                  />
                </LinkedToAccordion>
                <LinkedToAccordion
                  class="fr-fieldset__element min-width-0"
                  :accordion="chooseTheCorrectFormatAccordionId"
                  @blur="touch('format')"
                >
                  <SearchableSelect
                    v-model="form.format"
                    :label="$t('Format')"
                    :placeholder="$t('Search a format…')"
                    :display-value="(option) => option"
                    :options="extensions"
                    :multiple="false"
                    class="mb-6"

                    :error-text="getFirstError('format')"
                    :warning-text="getFirstWarning('format')"
                  />
                </LinkedToAccordion>
                <LinkedToAccordion
                  class="fr-fieldset__element min-width-0"
                  :accordion="writeAGoodDescriptionAccordionId"
                  @blur="touch('description')"
                >
                  <InputGroup
                    v-model="form.description"
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
                  <SearchableSelect
                    v-model="form.schema"
                    :label="$t('Schema')"
                    :placeholder="$t('Search a schema…')"
                    :display-value="(option) => option.name"
                    :get-option-id="(option) => option.name"
                    :options="schemas"
                    :multiple="false"
                    class="mb-6"

                    :error-text="getFirstError('schema')"
                    :warning-text="getFirstWarning('schema')"
                  />
                </LinkedToAccordion>
                <LinkedToAccordion
                  class="fr-fieldset__element min-width-0"
                  :accordion="whatIsAMimeTypeAccordionId"
                  @blur="touch('mime')"
                >
                  <SearchableSelect
                    v-model="form.mime"
                    :label="$t('Mime type')"
                    :placeholder="$t('Search a mime type…')"
                    :display-value="(option) => option.text"
                    :get-option-id="(option) => option.text"
                    :suggest="suggestMime"
                    :multiple="false"
                    class="mb-6"

                    :error-text="getFirstError('mime')"
                    :warning-text="getFirstWarning('mime')"
                  />
                </LinkedToAccordion>
              </fieldset>
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
import { getResourceLabel, RESOURCE_TYPE, Well, type SchemaResponseData } from '@datagouv/components'
import { cloneDeep } from 'lodash'
import ModalWithButton from '../Modal/ModalWithButton.vue'
import SelectGroup from '../Form/SelectGroup/SelectGroup.vue'
import type { NewDatasetFile } from '~/types/types'
import type { KeysOfUnion } from '~/composables/useForm'

const { t } = useI18n()
const config = useRuntimeConfig()
const { $api } = useNuxtApp()
const formId = useId()

const file = defineModel<NewDatasetFile>({ required: true })

const isRemote = computed(() => file.value.filetype === 'remote')
const nameAFile = computed(() => isRemote.value ? t('Name a link') : t('Name a file'))
const fileTitle = computed(() => isRemote.value ? t('Link title') : t('File title'))
const fileTypes = RESOURCE_TYPE.map(type => ({ label: getResourceLabel(type), value: type }))

const { form, getFirstError, getFirstWarning, touch, validate, errors, warnings, removeErrorsAndWarnings } = useNewDatasetFileForm(cloneDeep(file.value))

const chooseTheCorrectLinkAccordionId = useId()
const nameAFileAccordionId = useId()
const chooseTheRightTypeOfFileAccordionId = useId()
const chooseTheCorrectFormatAccordionId = useId()
const writeAGoodDescriptionAccordionId = useId()
const selectASchemaAccordionId = useId()
const whatIsAMimeTypeAccordionId = useId()

const { data: extensions } = await useAPI<Array<string>>('/api/1/datasets/extensions/')
const { data: schemas } = await useAPI<SchemaResponseData>('/api/1/datasets/schemas/')

const submit = (close: () => void) => {
  if (validate()) {
    file.value = form.value
    close()
  }
}
const cancel = (close: () => void) => {
  form.value = file.value
  close()
}

const suggestMime = async (query: string) => {
  return await $api<Array<{ text: string }>>('/api/1/datasets/suggest/mime/', {
    query: {
      q: query,
      size: 5,
    },
  })
}
const accordionState = (key: KeysOfUnion<typeof form.value>) => {
  if (getFirstError(key)) return 'error'
  if (getFirstWarning(key)) return 'warning'

  return 'default'
}
</script>
