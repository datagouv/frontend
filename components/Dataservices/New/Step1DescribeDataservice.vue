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
          :id="nameDataserviceAccordionId"
          :title="t('Name your API')"
          :state="accordionState('title')"
        >
          <p class="fr-m-0">
            {{ t('Give your API a relevant and explicit name to reflect its function or application domain. A good name helps users search for and identify the API easily.') }}
          </p>
        </Accordion>
        <Accordion
          :id="acronymDataserviceAccordionId"
          :title="t('Add an acronym to the API')"
          :state="accordionState('acronym')"
        >
          <p class="fr-m-0">
            {{ t('You have the option to add an acronym to your API. The letters that make up this acronym do not need to be separated by periods.') }}
          </p>
        </Accordion>
        <Accordion
          :id="addDescriptionAccordionId"
          :title="t('Write a good description')"
          :state="accordionState('description')"
        >
          <p class="fr-m-0">
            {{ t("Write a clear and precise description of the API. Users need to understand the purpose of the API, the data provided, the scope covered (is the data exhaustive, are there any gaps?), the frequency of data updates, as well as the parameters with which they can make a call.") }}
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
          v-if="true || dataservice.organization"
          :id="contactPointAccordionId"
          :title="$t('Define a point of contact')"
          :state="accordionState('contact_point')"
        >
          <p class="fr-m-0">
            {{ $t("Specify a contact point, such as an email or a link to a form, so users can reach you in case of issues or for questions.") }}
          </p>
        </Accordion>
        <Accordion
          :id="selectIsRestrictedAccordionId"
          :title="$t('Select an access type')"
          :state="accordionState('is_restricted')"
        >
          <p class="fr-m-0">
            {{ $t("Choose the access type (open or restricted). Select open if the data is open data.") }}
          </p>
          <Well
            v-if="getFirstWarning('is_restricted')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getFirstWarning("is_restricted") }}
          </Well>
        </Accordion>
        <Accordion
          :id="selectHasTokenAccordionId"
          :title="$t('Access token')"
          :state="accordionState('has_token')"
        >
          <p class="fr-m-0">
            {{ $t("Please indicate whether the dataservice is freely accessible or whether a user requires a token to access the data.") }}
          </p>
          <Well
            v-if="getFirstWarning('has_token')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getFirstWarning("has_token") }}
          </Well>
        </Accordion>
        <Accordion
          :id="addBaseUrlAccordionId"
          :title="t('Define the correct link to the API')"
          :state="accordionState('base_api_url')"
        >
          <p class="fr-m-0">
            {{ t("The base URL of an API is the common entry point for all requests, often consisting of a domain or server address. It serves as the foundation to which specific paths (endpoints) are added to access the various resources of the API.") }}
          </p>
        </Accordion>
        <Accordion
          :id="addAuthorizationUrlAccordionId"
          :title="t('Add a link to the authorization')"
          :state="accordionState('authorization_request_url')"
        >
          <p class="fr-m-0">
            {{ t("If your API is restricted access, please add the link to the access request form. Are you an administration? The Datapass solution allows you to easily create and manage access request forms for data.") }}
          </p>
        </Accordion>
        <Accordion
          :id="addEndpointUrlAccordionId"
          :title="t('Add a link to the technical documentation')"
          :state="accordionState('endpoint_description_url')"
        >
          <p class="fr-m-0">
            {{ t("Ideally, provide an OpenAPI (swagger) link that allows developers to explore the endpoints, see the available methods, and test requests directly from the documentation. In the case of geographic services, you can provide a link to the service with a GetCapabilities request to obtain the service's metadata.") }}
          </p>
        </Accordion>
        <Accordion
          :id="rateLimitingDataserviceAccordionId"
          :title="t('Set the rate limiting')"
          :state="accordionState('rate_limiting')"
        >
          <p class="fr-m-0">
            {{ t('You can specify the rate limiting for your API.') }}
          </p>
        </Accordion>
        <Accordion
          :id="availabilityDataserviceAccordionId"
          :title="t('Availability')"
          :state="accordionState('availability')"
        >
          <p class="fr-m-0">
            {{ t('Specify the mean availability of your dataservice. Value should be a percentage.') }}
          </p>
        </Accordion>
      </AccordionGroup>
    </Sidemenu>
    <div class="fr-col-12 fr-col-md-7">
      <div class="fr-p-3w bg-white">
        <Well
          color="blue-cumulus"
          weight="regular"
          class="fr-mb-2w"
        >
          <div class="fr-grid-row">
            <div class="fr-col-auto fr-mr-3v">
              <img
                src="/illustrations/dataservice.svg"
                alt=""
              >
            </div>
            <div class="fr-col">
              <p class="fr-m-0 fr-text--bold">
                {{ t('What is a dataservice?') }}
              </p>
              <p class="fr-m-0 fr-text--xs">
                {{ t('A dataservice is a computer tool that allows a website or software to communicate with another computer and exchange data.') }}
              </p>
            </div>
          </div>
        </Well>

        <fieldset
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
              :error-text="getFirstError('owned')"
              :warning-text="getFirstWarning('owned')"
              @focusout="touch('owned')"
            />
          </div>
        </fieldset>
        <fieldset
          class="fr-fieldset min-width-0"
          aria-labelledby="description-legend"
        >
          <legend
            id="description-legend"
            class="fr-fieldset__legend"
          >
            <h2 class="subtitle subtitle--uppercase fr-mb-3v">
              {{ $t("Title") }}
            </h2>
          </legend>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="nameDataserviceAccordionId"
            @blur="touch('title')"
          >
            <InputGroup
              v-model="form.title"
              :aria-describedby="nameDataserviceAccordionId"
              :label="t('Dataservice name')"
              :required="true"
              :has-error="!!getFirstError('title')"
              :has-warning="!!getFirstWarning('title')"
              :error-text="getFirstError('title')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="acronymDataserviceAccordionId"
            @blur="touch('acronym')"
          >
            <InputGroup
              v-model="form.acronym"
              :aria-describedby="acronymDataserviceAccordionId"
              :label="t('Acronym')"
              :required="false"
              :has-error="!!getFirstError('acronym')"
              :has-warning="!!getFirstWarning('acronym')"
              :error-text="getFirstError('acronym')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element min-width-0"
            :accordion="addDescriptionAccordionId"
            @blur="touch('description')"
          >
            <InputGroup
              v-model="form.description"
              :label="$t('Description')"
              :required="true"
              type="markdown"
              :has-error="!!getFirstError('description')"
              :has-warning="!!getFirstWarning('description')"
              :error-text="getFirstError('description')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="selectLicenseAccordionId"
            @blur="touch('license')"
          >
            <SearchableSelect
              v-model="form.license"
              :options="licenses"
              :label="t('License')"
              :placeholder="t('Select a license')"
              :display-value="(option) => option.title"
              :multiple="false"
              :group-by="(option) => option.group"

              :error-text="getFirstError('license')"
              :warning-text="getFirstWarning('license')"
            >
              <template #option="{ option, active }">
                <div class="w-full">
                  <div class="flex items-center justify-between space-x-2">
                    <div>{{ option.title }}</div>
                    <div
                      v-if="option.code"
                      class="font-mono  px-2 py-1 border border-transparent text-xs"
                      :class="{ 'bg-gray-100': ! active, 'border-white': active }"
                    >
                      {{ option.code }}
                    </div>
                  </div>
                  <div
                    v-if="option.recommended || option.description"
                    class="flex items-center justify-between space-x-2"
                    :class="{
                      'text-gray-500': !active,
                    }"
                  >
                    <div
                      v-if="option.recommended"
                      class="flex items-center space-x-1"
                    >
                      <Icon
                        name="ri-star-fill"
                        class="self-center size-3 "
                        :class="{ 'text-primary': !active }"
                        aria-hidden="true"
                      />
                      <span>{{ t('Recommended') }}</span>
                    </div>
                    <div v-if="option.description">
                      {{ option.description }}
                    </div>
                  </div>
                </div>
              </template>
            </SearchableSelect>
          </LinkedToAccordion>
        </fieldset>
        <div class="fr-grid-row fr-grid-row--right">
          <button
            class="fr-btn"
            @click="submit"
          >
            {{ $t("Next") }}
          </button>
        </div>
      </div>
      <div class="h-64" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Well, type License } from '@datagouv/components'
import { computed } from 'vue'
import Accordion from '~/components/Accordion/Accordion.vue'
import AccordionGroup from '~/components/Accordion/AccordionGroup.vue'
import ProducerSelect from '~/components/ProducerSelect.vue'
import SearchableSelect from '~/components/SearchableSelect.vue'
import type { DataserviceForm, EnrichedLicense, Owned } from '~/types/types'

const dataserviceForm = defineModel<DataserviceForm>({ required: true })

const emit = defineEmits<{
  (event: 'next', dataservice: DataserviceForm): void
}>()

const { t } = useI18n()
const config = useRuntimeConfig()

const user = useMe()

const nameDataserviceAccordionId = useId()
const acronymDataserviceAccordionId = useId()
const addDescriptionAccordionId = useId()
const selectLicenseAccordionId = useId()
const selectIsRestrictedAccordionId = useId()
const selectHasTokenAccordionId = useId()
const addBaseUrlAccordionId = useId()
const addAuthorizationUrlAccordionId = useId()
const addEndpointUrlAccordionId = useId()
const rateLimitingDataserviceAccordionId = useId()
const availabilityDataserviceAccordionId = useId()
const contactPointAccordionId = useId()

const { data: allLicenses } = await useAPI<Array<License>>('/api/1/datasets/licenses', { lazy: true })

// Merge some information between database (all licenses) and config (selectable license, some recommanded, codes…)
// Maybe all these information could be better stored in database too…
const licenses = computed(() => {
  if (!allLicenses.value) return []

  const licenses = [] as Array<EnrichedLicense>
  const licensesChoices = config.public.licenses as unknown as Record<string, Array<{ value: string, recommended?: boolean, code?: string, description?: string }>>
  for (const [group, licensesInGroup] of Object.entries(licensesChoices)) {
    for (const license of licensesInGroup) {
      const found = allLicenses.value.find(({ id }) => license.value === id)
      if (!found) continue
      licenses.push({ ...found, ...license, group })
    }
  }
  return licenses
})

const ownedOptions = computed<Array<Owned>>(() => {
  return [...user.value.organizations.map(organization => ({ organization, owner: null })), { owner: user.value, organization: null }]
})

const { form, touch, getFirstError, getFirstWarning, validate } = useForm(dataserviceForm, {
  owned: [required()],
  title: [required()],
  description: [required()],
}, {
  description: [minLength(200, t('It\'s advised to have a {property} of at least {min} characters.', { property: t('description'), min: 200 }))],
  license: [required()],
})

const accordionState = (key: keyof typeof form.value) => {
  if (getFirstError(key)) return 'error'
  if (getFirstWarning(key)) return 'warning'

  return 'default'
}

function submit() {
  if (validate()) {
    emit('next', form.value)
  }
};
</script>
