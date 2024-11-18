<template>
  <div class="fr-grid-row">
    <Sidemenu
      class="fr-col-12 fr-col-md-5"
      :button-text="$t('Help')"
      :on-right="true"
      :fixed="true"
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
          :id="nameReuseAccordionId"
          :title="t('Naming your reuse')"
          :state="accordionState('title')"
        >
          <p class="fr-m-0">
            {{ t('Prefer a title that allows understanding of the use made of the data rather than the name of the website or application ("Search Engine for Company Agreements" rather than "Accords-entreprise.fr" for example).') }}
          </p>
        </Accordion>
        <Accordion
          :id="addLinkAccordionId"
          :title="t('What link to provide')"
          :state="accordionState('url')"
        >
          <p class="fr-m-0">
            {{ t("Enter the link of the page on which the reuse is visible. Point directly to the reuse itself rather than a homepage. Make sure the link is stable over time.") }}
          </p>
        </Accordion>
        <Accordion
          :id="addTypeAccordionId"
          :title="('Choose a type')"
          :state="accordionState('type')"
        >
          <div class="prose prose-neutral fr-m-0">
            <p class="fr-m-0">
              {{ t('Please indicate the type under which to categorize the reuse (API, application, news article, visualization, etc.).') }}
            </p>
            <Well
              v-if="getFirstWarning('type')"
              class="fr-mt-1w"
              color="orange-terre-battue"
            >
              {{ getFirstWarning("type") }}
            </Well>
          </div>
        </Accordion>
        <Accordion
          :id="addTopicAccordionId"
          :title="t('Choose a theme')"
          :state="accordionState('topic')"
        >
          <p class="fr-m-0">
            {{ t("Choose the theme associated with your reuse.") }}
          </p>
          <Well
            v-if="getFirstWarning('topic')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getFirstWarning("topic") }}
          </Well>
        </Accordion>
        <Accordion
          :id="addDescriptionAccordionId"
          :title="t('Describe your reuse')"
          :state="accordionState('description')"
        >
          <p class="fr-m-0">
            {{ t("You can provide information about the method of creating the reuse, what the reuse allows to do or show, or tell more about yourself and the context of this reuse. It is preferable to maintain a neutral tone: if the reuse resembles too much like a promotional message, we may delete it.") }}
          </p>
          <Well
            v-if="getFirstWarning('description')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getFirstWarning("description") }}
          </Well>
        </Accordion>
        <Accordion
          :id="addTagsAccordionId"
          :title="t('Add keywords')"
          :state="accordionState('tags')"
        >
          <p class="fr-m-0">
            {{ t("Keywords appear on the presentation page and improve search engine optimization when a user is searching. From each keyword, you can obtain a list of reuses for which the keyword has also been assigned.") }}
          </p>
          <Well
            v-if="getFirstWarning('tags')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getFirstWarning("tags") }}
          </Well>
        </Accordion>
        <Accordion
          :id="addImageAccordionId"
          :title="t('Choose an image')"
          :state="accordionState('image')"
        >
          <p class="fr-m-0">
            {{ t(`If your reuse takes the form of a graphical representation, you can provide a preview to other users through an image or screenshot. This image will appear in the "Reuses" section of the associated dataset page. When relevant, screenshots are more effective in conveying what the reuse is about, so they are preferable to logos or illustrations, for example.`) }}
          </p>
          <Well
            v-if="getFirstWarning('image')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getFirstWarning("image") }}
          </Well>
        </Accordion>
      </AccordionGroup>
    </Sidemenu>
    <form
      class="fr-col-12 fr-col-md-7"
      @submit.prevent="submit"
    >
      <div class="fr-p-3w bg-white">
        <Well
          v-if="type === 'create'"
          color="blue-cumulus"
          weight="regular"
          class="fr-mb-2w"
        >
          <div class="fr-grid-row">
            <div class="fr-col-auto fr-mr-3v">
              <NuxtImg
                src="/illustrations/reuse.svg"
                loading="lazy"
                alt=""
              />
            </div>
            <div class="fr-col">
              <p class="fr-m-0 fr-text--bold">
                {{ t('What is a reuse?') }}
              </p>
              <p class="fr-m-0 fr-text--xs">
                {{ t("A reuse is an exemple of public data's usage.") }} {{ t('Publishing a reuse can allow you to gain visibility and start start a dialogue with the dataset producer.') }}
              </p>
            </div>
          </div>
        </Well>

        <fieldset
          v-if="type === 'create'"
          class="fr-fieldset"
          aria-labelledby="description-legend"
        >
          <legend
            id="description-legend"
            class="fr-fieldset__legend"
          >
            <h2 class="subtitle subtitle--uppercase fr-mb-3v">
              {{ $t("Producer") }}
            </h2>
          </legend>
          <div class="fr-fieldset__element">
            <ProducerSelect
              v-model="form.owned"
              :options="ownedOptions"
              :required="true"
              :error-text="getFirstError('owned')"
              :warning-text="getFirstWarning('owned')"
              @focusout="touch('owned')"
            />
          </div>
        </fieldset>
        <fieldset
          class="fr-fieldset"
          aria-labelledby="description-legend"
        >
          <legend
            id="description-legend"
            class="fr-fieldset__legend"
          >
            <h2 class="subtitle subtitle--uppercase fr-mb-3v">
              {{ t("Description") }}
            </h2>
          </legend>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="nameReuseAccordionId"
            @blur="touch('title')"
          >
            <InputGroup
              v-model="reuseForm.title"
              :aria-describedby="nameReuseAccordionId"
              :label="t('Reuse name')"
              :required="true"
              :has-error="!!getFirstError('title')"
              :has-warning="!!getFirstWarning('title')"
              :error-text="getFirstError('title')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="addLinkAccordionId"
            @blur="touch('url')"
          >
            <InputGroup
              v-model="reuseForm.url"
              :aria-describedby="addLinkAccordionId"
              :label="t('Link')"
              type="url"
              placeholder="https://..."
              :required="true"
              :has-error="!!getFirstError('url')"
              :has-warning="!!getFirstWarning('url')"
              :error-text="getFirstError('url')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="addTypeAccordionId"
            @blur="touch('type')"
          >
            <SearchableSelect
              v-model="reuseForm.type"
              :label="$t('Type')"
              :placeholder="$t('Search a type…')"
              class="mb-6"
              :get-option-id="(type) => type.label"
              :display-value="(type) => type.label"
              :options="types"
              :multiple="false"
              :required="true"
              :error-text="getFirstError('type')"
              :warning-text="getFirstWarning('type')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="addTopicAccordionId"
            @blur="touch('topic')"
          >
            <SearchableSelect
              v-model="reuseForm.topic"
              :label="$t('Theme')"
              :placeholder="$t('Search a theme…')"
              class="mb-6"
              :get-option-id="(topic) => topic.label"
              :display-value="(topic) => topic.label"
              :options="topics"
              :multiple="false"
              :required="true"
              :error-text="getFirstError('topic')"
              :warning-text="getFirstWarning('topic')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="addDescriptionAccordionId"
            @blur="touch('description')"
          >
            <InputGroup
              v-model="reuseForm.description"
              :label="t('Description')"
              :required="true"
              type="markdown"
              :has-error="!!getFirstError('description')"
              :has-warning="!!getFirstWarning('description')"
              :error-text="getFirstError('description')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="addTagsAccordionId"
            @blur="touch('tags')"
          >
            <TagsSelect
              v-model="form.tags"
              class="mb-6"
              :error-text="getFirstError('tags')"
              :warning-text="getFirstWarning('tags')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="addImageAccordionId"
            @blur="touch('image')"
          >
            <UploadGroup
              :label="$t('Cover picture')"
              type="drop"
              accept=".jpeg, .jpg, .png"
              :hint-text="$t('Max size: 4Mo. Accepted formats: JPG, JPEG, PNG')"
              :has-error="!!getFirstError('image')"
              :has-warning="!!getFirstWarning('image')"
              :error-text="getFirstError('image')"
              @change="setFiles"
            />
            <div
              v-if="imagePreview"
              class="text-align-center"
            >
              <NuxtImg
                :src="imagePreview"
                class="border mx-auto max-h-40 aspect-square"
                loading="lazy"
                alt=""
              />
            </div>
          </LinkedToAccordion>
        </fieldset>
        <div class="fr-grid-row fr-grid-row--right">
          <slot />
        </div>
      </div>
      <div class="h-64" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { Well, type ReuseType } from '@datagouv/components'
import { computed } from 'vue'
import Accordion from '~/components/Accordion/Accordion.vue'
import AccordionGroup from '~/components/Accordion/AccordionGroup.vue'
import ProducerSelect from '~/components/ProducerSelect.vue'
import type { ReuseForm, Owned, ReuseTopic } from '~/types/types'

const reuseForm = defineModel<ReuseForm>({ required: true })
defineProps<{
  type: 'create' | 'update'
}>()

const emit = defineEmits<{
  (event: 'submit'): void
}>()

const { t } = useI18n()

const user = useMe()

const nameReuseAccordionId = useId()
const addLinkAccordionId = useId()
const addTypeAccordionId = useId()
const addTopicAccordionId = useId()
const addDescriptionAccordionId = useId()
const addTagsAccordionId = useId()
const addImageAccordionId = useId()

const { data: types } = await useAPI<Array<ReuseType>>('/api/1/reuses/types', { lazy: true })
const { data: topics } = await useAPI<Array<ReuseTopic>>('/api/1/reuses/topics', { lazy: true })

const ownedOptions = computed<Array<Owned>>(() => {
  return [...user.value.organizations.map(organization => ({ organization, owner: null })), { owner: user.value, organization: null }]
})

const { form, touch, getFirstError, getFirstWarning, validate } = useForm(reuseForm, {
  // owned: [required()],
  // title: [required()],
  // description: [required()],
  // base_api_url: [url()],
  // authorization_request_url: [url()],
  // endpoint_description_url: [url()],
}, {
  // description: [minLength(200, t('It\'s advised to have a {property} of at least {min} characters.', { property: t('description'), min: 200 }))],
  // license: [required()],
})

const accordionState = (key: keyof typeof form.value) => {
  if (getFirstError(key)) return 'error'
  if (getFirstWarning(key)) return 'warning'

  return 'default'
}

const setFiles = (files: Array<File>) => {
  reuseForm.value.image = files[0]
}
const imagePreview = computed(() => {
  if (!reuseForm.value.image) return null
  if (typeof reuseForm.value.image === 'string') return reuseForm.value.image
  return URL.createObjectURL(reuseForm.value.image)
})

function submit() {
  if (validate()) {
    emit('submit')
  }
};
</script>
