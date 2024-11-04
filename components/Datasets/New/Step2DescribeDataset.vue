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
          :id="nameDatasetAccordionId"
          :title="$t('Naming your dataset')"
          :state="state.title"
        >
          <p class="fr-m-0">
            {{ $t("The title of your dataset should be as precise and specific as possible.") }} <br>
            {{ $t("It should also correspond to the vocabulary used by users.") }} <br>
            {{ $t("They often search for data in a search engine.") }}
          </p>
        </Accordion>
        <Accordion
          :id="addAcronymAccordionId"
          :title="$t('Add an acronym to the dataset')"
          :state="state.acronym"
        >
          <p class="fr-m-0">
            {{ $t("You have the option to add an acronym to your dataset. The letters that make up this acronym do not need to be separated by periods.") }}
          </p>
        </Accordion>
        <Accordion
          :id="writeAGoodDescriptionAccordionId"
          :title="$t('Write a good description')"
          :state="state.description"
        >
          <div class="markdown fr-m-0">
            <p class="fr-m-0">
              {{ $t(`The description of your dataset allows to obtain information about the content and structure of the published resources. You can provide:`) }}
            </p>
            <ul class="fr-mt-3v">
              <li>{{ $t("A list of the files available ;") }}</li>
              <li>{{ $t("A description of the file format ;") }}</li>
              <li>{{ $t("The update frequency.") }}</li>
            </ul>
            <ul class="fr-mt-3v">
              <li>{{ $t("Motivations for creating the dataset ;") }}</li>
              <li>{{ $t("The composition of the dataset ;") }}</li>
              <li>{{ $t("The data collection process ;") }}</li>
              <li>{{ $t("Data preprocessing ;") }}</li>
              <li>{{ $t("Dataset dissemination ;") }}</li>
              <li>{{ $t("Dataset maintenance ;") }}</li>
              <li>{{ $t("Legal and ethical considerations.") }}</li>
            </ul>
            <Well
              v-if="fieldHasWarning('description')"
              class="fr-mt-1w"
              color="orange-terre-battue"
            >
              {{ getWarningText("description") }}
            </Well>
          </div>
        </Accordion>
        <Accordion
          :id="useTagsAccordionId"
          :title="$t('Use tags')"
          :state="state.tags"
        >
          <p class="fr-m-0">
            {{ $t("Tags characterize your dataset. They are public and improve the dataset's search engine optimization during a user search.") }}
          </p>
          <Well
            v-if="fieldHasWarning('tags')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getWarningText("tags") }}
          </Well>
        </Accordion>
        <Accordion
          :id="selectLicenseAccordionId"
          :title="$t('Select a license')"
          :state="state.license"
        >
          <p class="fr-m-0">
            {{ $t("Licenses define the rules for reuse. By choosing a reuse license, you ensure that the published dataset will be reused according to the usage conditions you have defined.") }}
          </p>
          <Well
            v-if="fieldHasWarning('license')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getWarningText("license") }}
          </Well>
        </Accordion>
        <Accordion
          :id="chooseFrequencyAccordionId"
          :title="$t('Choose the update frequency')"
          :state="state.frequency"
        >
          <p class="fr-m-0">
            {{ $t("The update frequency corresponds to how often you plan to update the published data. This update frequency is only indicative.") }}
          </p>
          <Well
            v-if="fieldHasWarning('frequency')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getWarningText("frequency") }}
          </Well>
        </Accordion>
        <Accordion
          :id="addTemporalCoverageAccordionId"
          :title="$t('Provide the temporal coverage')"
          :state="state.temporal_coverage"
        >
          <p class="fr-m-0">
            {{ $t("The temporal coverage indicates the time range of the published data.") }} <br>
            {{ $t("For example : from 2012 to 2015.") }}
          </p>
          <Well
            v-if="fieldHasWarning('temporal_coverage')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getWarningText("temporal_coverage") }}
          </Well>
        </Accordion>
        <Accordion
          :id="addSpatialInformationAccordionId"
          :title="$t('Complete the spatial information')"
          :state="state.spatial_information"
        >
          <p class="fr-m-0">
            {{ $t("The spatial granularity indicates the finest geographical level of detail that your data can cover.") }} <br>
            {{ $t("For example: at the department or municipality scale.") }}
          </p>
          <Well
            v-if="fieldHasWarning('spatial_information')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getWarningText("spatial") }}
          </Well>
        </Accordion>
      </AccordionGroup>
    </Sidemenu>
    <div class="fr-col-12 fr-col-md-7">
      <Container>
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
                {{ $t('What is a dataset?') }}
              </p>
              <p class="fr-m-0 fr-text--xs">
                {{ $t('On {site}, a dataset is a set of files.', { site: config.public.title }) }}
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
            <SearchableSelect
              v-model="form.owner"
              :options="[...user.organizations, user]"
              :label="t('Check the identity with which you want to publish')"
              :placeholder="t('Search…')"
              :display-value="(option) => 'name' in option ? option.name : `${option.first_name} ${option.last_name}`"
              :multiple="false"
            >
              <template #option="{ option }">
                <div class="flex items-center space-x-2">
                  <Placeholder
                    v-if="option.logo_thumbnail"
                    type="organization"
                    :src="option.logo_thumbnail"
                    :size="20"
                  />
                  <img
                    v-else
                    class="rounded-full border border-default-grey size-5"
                    :src="`${config.public.apiBase}/api/1/avatars/${option.id}/24`"
                    loading="lazy"
                    alt=""
                  >
                  <span v-if="option.name">{{ option.name }}</span>
                  <span v-else>{{ option.first_name }} {{ option.last_name }}</span>
                </div>
              </template>
            </SearchableSelect>
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
              {{ $t("Description") }}
            </h2>
          </legend>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="nameDatasetAccordionId"
            @blur="vWarning$.title.$touch"
          >
            <InputGroup
              v-model="form.title"
              :aria-describedby="nameDatasetAccordionId"
              :label="$t('Dataset name')"
              :required="true"
              :has-error="fieldHasError('title')"
              :has-warning="fieldHasWarning('title')"
              :error-text="getErrorText('title')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="addAcronymAccordionId"
            @blur="vWarning$.acronym.$touch"
          >
            <InputGroup
              v-model="form.acronym"
              :label="$t('Acronym')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element min-width-0"
            :accordion="writeAGoodDescriptionAccordionId"
            @blur="vWarning$.description.$touch"
          >
            <InputGroup
              v-model="form.description"
              :label="$t('Description')"
              :required="true"
              type="textarea"
              :has-error="fieldHasError('description')"
              :has-warning="fieldHasWarning('description')"
              :error-text="getErrorText('description')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="useTagsAccordionId"
            @blur="vWarning$.tags.$touch"
          >
            <div class="mb-6">
              <SearchableSelect
                v-model="form.tags"
                :label="$t('Tags')"
                :placeholder="$t('Search a tag…')"
                :get-option-id="(tag) => tag.text"
                :display-value="(tags) => ''"
                :suggest="suggestTags"
                :multiple="true"
                class="mb-2"
              >
                <template #option="{ option: tag }">
                  <div class="flex items-center space-x-2">
                    <span>{{ tag.text }}</span>
                  </div>
                </template>
              </SearchableSelect>
              <div class="flex space-x-2">
                <button
                  v-for="tag in form.tags"
                  :key="tag.text"
                  class="fr-tag fr-tag--sm fr-tag--dismiss"
                  type="button"
                  @click="removeTag(tag)"
                >
                  {{ tag.text }}
                </button>
              </div>
            </div>
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="selectLicenseAccordionId"
            @blur="vWarning$.license.$touch"
          >
            <SearchableSelect
              v-model="form.license"
              :options="licenses"
              :label="t('License')"
              :placeholder="t('Select a license')"
              :display-value="(option) => option.title"
              :multiple="false"
              :group-by="(option) => option.group"
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
        <fieldset
          class="fr-fieldset"
          aria-labelledby="time-legend"
        >
          <legend
            id="time-legend"
            class="fr-fieldset__legend"
          >
            <h2 class="subtitle subtitle--uppercase fr-mb-3v">
              {{ $t("Time") }}
            </h2>
          </legend>
          <LinkedToAccordion
            :accordion="chooseFrequencyAccordionId"
            class="fr-fieldset__element"
            @blur="vWarning$.frequency.$touch"
          >
            <SearchableSelect
              v-model="form.frequency"
              :label="$t('Update frequency')"
              :placeholder="$t('Search a frequency…')"
              class="mb-6"
              :get-option-id="(frequency) => frequency.label"
              :display-value="(frequency) => frequency.label"
              :options="frequencies"
              :multiple="false"
            >
              <template #option="{ option: frequency }">
                <div>
                  {{ frequency.label }}
                </div>
              </template>
            </SearchableSelect>
          </LinkedToAccordion>
          <LinkedToAccordion
            :accordion="addTemporalCoverageAccordionId"
            class="fr-fieldset__element"
            @blur="vWarning$.temporal_coverage.$touch"
          >
            <InputGroup
              v-model="form.temporal_coverage"
              :label="$t('Temporal coverage')"
              type="range"
            />
          </LinkedToAccordion>
        </fieldset>
        <fieldset
          class="fr-fieldset"
          aria-labelledby="space-legend"
        >
          <legend
            id="space-legend"
            class="fr-fieldset__legend"
          >
            <h2 class="subtitle subtitle--uppercase fr-mb-3v">
              {{ $t("Space") }}
            </h2>
          </legend>
          <LinkedToAccordion
            :accordion="addSpatialInformationAccordionId"
            class="fr-fieldset__element"
            @blur="vWarning$.spatial.$touch"
          >
            <div class="fr-grid-row fr-grid-row--gutters">
              <div class="fr-col-12">
                <div class="mb-6">
                  <SearchableSelect
                    v-model="form.spatial.zones"
                    :label="$t('Spatial coverage')"
                    :placeholder="$t('Search a spatial coverage…')"
                    :suggest="suggestSpatial"
                    :multiple="true"
                    class="mb-2"
                  >
                    <template #option="{ option: zone, active }">
                      <div class="w-full">
                        <div class="flex items-center justify-between space-x-2">
                          <div>{{ zone.name }}</div>
                          <div
                            class="font-mono  px-2 py-1 border border-transparent text-xs"
                            :class="{ 'bg-gray-100': ! active, 'border-white': active }"
                          >
                            Insee : {{ zone.code }}
                          </div>
                        </div>
                        <div
                          class="flex items-center justify-between space-x-2"
                          :class="{
                            'text-gray-500': !active,
                          }"
                        >
                          {{ getGranularityName(zone) }}
                        </div>
                      </div>
                    </template>
                  </SearchableSelect>
                  <div class="flex space-x-2">
                    <button
                      v-for="zone in form.spatial.zones"
                      :key="zone.id"
                      class="fr-tag fr-tag--sm fr-tag--dismiss"
                      type="button"
                      @click="removeZone(zone)"
                    >
                      {{ zone.name }}
                    </button>
                  </div>
                </div>
              <!-- <MultiSelect
                  :placeholder="$t('Spatial coverage')"
                  :search-placeholder="$t('Search a spatial coverage...')"
                  suggest-url="/spatial/zones/suggest/"
                  entity-url="/spatial/zone/"
                  :values="dataset.spatial?.zones"
                  :has-warning="fieldHasWarning('spatial_information')"
                  :all-option="$t('e.g. France')"
                  :add-all-option="false"
                  :multiple="true"
                  helper-label="Insee : "
                  :on-suggest="formatSpatialZones"
                  :show-description="true"
                  @change="(value: Array<string>) => dataset.spatial ? dataset.spatial.zones = value : dataset.spatial = { zones: value }"
                /> -->
              </div>
              <div class="fr-col-12">
              <!-- <MultiSelect
                  :placeholder="$t('Spatial granularity')"
                  :search-placeholder="$t('Search a granularity...')"
                  :initial-options="granularities"
                  :values="dataset.spatial?.granularity"
                  :has-warning="fieldHasWarning('spatial_information')"
                  :all-option="$t('Select an option')"
                  :add-all-option="false"
                  @change="setGranularity"
                /> -->
              </div>
            </div>
          </LinkedToAccordion>
        </fieldset>
        <div class="fr-grid-row fr-grid-row--right">
          {{ JSON.stringify(form) }}
          <button
            class="fr-btn"
            @click="submit"
          >
            {{ $t("Next") }}
          </button>
        </div>
      </Container>
      <div class="h-64" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Well, type Frequency, type License, type NewDataset, type Organization } from '@datagouv/components'
import { computed, reactive, ref } from 'vue'
import Accordion from '~/components/Accordion/Accordion.vue'
import AccordionGroup from '~/components/Accordion/AccordionGroup.vue'
import SearchableSelect from '~/components/SearchableSelect.vue'
import type { PublishingFormAccordionState, SpatialGranularity, SpatialZone, Tag } from '~/types/types'
import { createMinLengthWarning, not, createRequired, requiredWithCustomMessage, createSameAs } from '~/utils/i18n'

// const props = defineProps<{}>()

const emit = defineEmits<{
  (event: 'next', dataset: NewDataset): void
}>()

const { t } = useI18n()
const config = useRuntimeConfig()
const nuxtApp = useNuxtApp()

const user = useMe()

const nameDatasetAccordionId = useId()
const addAcronymAccordionId = useId()
const writeAGoodDescriptionAccordionId = useId()
const useTagsAccordionId = useId()
const selectLicenseAccordionId = useId()
const chooseFrequencyAccordionId = useId()
const addTemporalCoverageAccordionId = useId()
const addSpatialInformationAccordionId = useId()

const dataset = reactive({})

type EnrichedLicense = License & { group: string, recommended?: boolean, code?: string, description?: string }

const { data: frequencies } = await useAPI<Array<Frequency>>('/api/1/datasets/frequencies', { lazy: true })

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

const suggestSpatial = async (query: string): Promise<Array<SpatialZone>> => {
  return await $api<Array<SpatialZone>>('/api/1/spatial/zones/suggest/', {
    query: {
      q: query,
      size: 5,
    },
  })
}

const { data: granularities } = await useAPI<Array<SpatialGranularity>>('/api/1/spatial/granularities/', { lazy: true })
const getGranularityName = (zone: SpatialZone): string | undefined => {
  if (!granularities.value) return ''
  return granularities.value.find(granularity => granularity.id === zone.level)?.name
}

const notUnknown = not(t('The value must be different than unknown.'), createSameAs(nuxtApp.$i18n))
const tagsRequired = requiredWithCustomMessage(t('Adding tags helps improve the SEO of your data.'))
const temporalCoverageRequired = requiredWithCustomMessage(t('You did not provide the temporal coverage.'))
const spatialGranularityRequired = requiredWithCustomMessage(t('You have not specified the spatial granularity.'))
const isSelectedProducer = ref<boolean>(false)

function checkOwned() {
  return isSelectedProducer.value
};

const form = ref({
  title: '',
  acronym: '',
  description: '',
  owner: null as Me | Organization | null,
  tags: [] as Array<Tag>,
  license: null as EnrichedLicense | null,
  frequency: null as Frequency | null,
  // temporal_coverage: { start: '1453-04-14', end: '2000-08-12' },
  temporal_coverage: { start: null, end: null },
  spatial: {
    zones: [] as Array<SpatialZone>,

  },
})

const { $api } = useNuxtApp()

const suggestTags = async (query: string) => {
  return await $api<Array<Tag>>('/api/1/tags/suggest/', {
    query: {
      q: query,
      size: 5,
    },
  })
}
const removeTag = (tag: Tag) => {
  form.value.tags = form.value.tags.filter(otherTag => otherTag.text !== tag.text)
}
const removeZone = (zone: SpatialZone) => {
  form.value.spatial.zones = form.value.spatial.zones.filter(otherZone => otherZone.id !== zone.id)
}

// function updateOwned(owned: OwnedWithId) {
//   dataset.organization = owned.organization
//   dataset.owner = owned.owner
//   isSelectedProducer.value = true
// }

const requiredRules = {
  description: { required: createRequired(nuxtApp.$i18n) },
  frequency: { required: createRequired(nuxtApp.$i18n) },
  title: { required: createRequired(nuxtApp.$i18n) },
  owned: { custom: checkOwned },
}

const warningRules = {
  acronym: {},
  description: { required: createRequired(nuxtApp.$i18n), minLengthValue: createMinLengthWarning(nuxtApp.$i18n) },
  frequency: { required: createRequired(nuxtApp.$i18n), notUnknown },
  license: { required: createRequired(nuxtApp.$i18n) },
  spatial: {
    granularity: { required: spatialGranularityRequired },
  },
  tags: { required: tagsRequired },
  temporal_coverage: { required: temporalCoverageRequired },
  title: { required: createRequired(nuxtApp.$i18n) },
  owned: { custom: checkOwned },
}

const { getErrorText, getFunctionalState, getWarningText, hasError, hasWarning, validateRequiredRules, v$, vWarning$ } = useFunctionalState(form, requiredRules, warningRules)

const state = computed<Record<string, PublishingFormAccordionState>>(() => {
  return {
    acronym: vWarning$.value.acronym.$dirty ? 'info' : 'disabled',
    title: getFunctionalState(vWarning$.value.title.$dirty, v$.value.title.$invalid, vWarning$.value.title.$error),
    description: getFunctionalState(vWarning$.value.description.$dirty, v$.value.description.$invalid, vWarning$.value.description.$error),
    tags: getFunctionalState(vWarning$.value.tags.$dirty, false, vWarning$.value.tags.$error),
    license: getFunctionalState(vWarning$.value.license.$dirty, false, vWarning$.value.license.$error),
    frequency: getFunctionalState(vWarning$.value.frequency.$dirty, v$.value.frequency.$invalid, vWarning$.value.frequency.$error),
    temporal_coverage: getFunctionalState(vWarning$.value.temporal_coverage.$dirty, false, vWarning$.value.temporal_coverage.$error),
    spatial_information: getFunctionalState(vWarning$.value.spatial.granularity.$dirty, false, vWarning$.value.spatial.granularity.$error),
    owned: getFunctionalState(vWarning$.value.owned.$dirty, v$.value.owned.$invalid, vWarning$.value.owned.$error),
  }
})

const fieldHasError = (field: string) => hasError(state, field)

const fieldHasWarning = (field: string) => hasWarning(state, field)

function setGranularity(value: string) {
  if (dataset.spatial) {
    dataset.spatial.granularity = value
  }
  else {
    dataset.spatial = { granularity: value }
  }
};

function submit() {
  validateRequiredRules().then((valid) => {
    if (valid) {
      emit('next', dataset)
    }
  })
};
</script>
