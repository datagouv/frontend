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
          :state="accordionState('title')"
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
          :state="accordionState('acronym')"
        >
          <p class="fr-m-0">
            {{ $t("You have the option to add an acronym to your dataset. The letters that make up this acronym do not need to be separated by periods.") }}
          </p>
        </Accordion>
        <Accordion
          :id="writeAGoodDescriptionAccordionId"
          :title="$t('Write a good description')"
          :state="accordionState('description')"
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
              v-if="getFirstWarning('description')"
              class="fr-mt-1w"
              color="orange-terre-battue"
            >
              {{ getFirstWarning("description") }}
            </Well>
          </div>
        </Accordion>
        <Accordion
          :id="useTagsAccordionId"
          :title="$t('Use tags')"
          :state="accordionState('tags')"
        >
          <p class="fr-m-0">
            {{ $t("Tags characterize your dataset. They are public and improve the dataset's search engine optimization during a user search.") }}
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
          :id="selectLicenseAccordionId"
          :title="$t('Select a license')"
          :state="accordionState('license')"
        >
          <p class="fr-m-0">
            {{ $t("Licenses define the rules for reuse. By choosing a reuse license, you ensure that the published dataset will be reused according to the usage conditions you have defined.") }}
          </p>
          <Well
            v-if="getFirstWarning('license')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getFirstWarning('license') }}
          </Well>
        </Accordion>
        <Accordion
          :id="chooseFrequencyAccordionId"
          :title="$t('Choose the update frequency')"
          :state="accordionState('frequency')"
        >
          <p class="fr-m-0">
            {{ $t("The update frequency corresponds to how often you plan to update the published data. This update frequency is only indicative.") }}
          </p>
          <Well
            v-if="getFirstWarning('frequency')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getFirstWarning("frequency") }}
          </Well>
        </Accordion>
        <Accordion
          :id="addTemporalCoverageAccordionId"
          :title="$t('Provide the temporal coverage')"
          :state="accordionState('temporal_coverage')"
        >
          <p class="fr-m-0">
            {{ $t("The temporal coverage indicates the time range of the published data.") }} <br>
            {{ $t("For example : from 2012 to 2015.") }}
          </p>
          <Well
            v-if="getFirstWarning('temporal_coverage')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getFirstWarning("temporal_coverage") }}
          </Well>
        </Accordion>
        <Accordion
          :id="addSpatialInformationAccordionId"
          :title="$t('Complete the spatial information')"
          :state="accordionState('spatial_granularity')"
        >
          <!-- TODO add spatial zones too -->
          <p class="fr-m-0">
            {{ $t("The spatial granularity indicates the finest geographical level of detail that your data can cover.") }} <br>
            {{ $t("For example: at the department or municipality scale.") }}
          </p>
          <Well
            v-if="getFirstWarning('spatial_granularity')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getFirstWarning("spatial_granularity") }}
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
              v-model="form.owned"
              :options="ownedOptions"
              :label="t('Check the identity with which you want to publish')"
              :placeholder="t('Search…')"
              :get-option-id="(option) => option.organization ? option.organization.id : option.owner.id"
              :display-value="(option) => option.organization ? option.organization.name : `${option.owner.first_name} ${option.owner.last_name}`"
              :multiple="false"
            >
              <template #option="{ option }">
                <div class="flex items-center space-x-2">
                  <Placeholder
                    v-if="option.organization"
                    type="organization"
                    :src="option.organization.logo_thumbnail"
                    :size="20"
                  />
                  <img
                    v-else
                    class="rounded-full border border-default-grey size-5"
                    :src="`${config.public.apiBase}/api/1/avatars/${option.owner.id}/24`"
                    loading="lazy"
                    alt=""
                  >
                  <span v-if="option.organization">{{ option.organization.name }}</span>
                  <span v-else>{{ option.owner.first_name }} {{ option.owner.last_name }}</span>
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
            @blur="touch('title')"
          >
            <InputGroup
              v-model="form.title"
              :aria-describedby="nameDatasetAccordionId"
              :label="$t('Dataset name')"
              :required="true"
              :has-error="!!getFirstError('title')"
              :has-warning="!!getFirstWarning('title')"
              :error-text="getFirstError('title')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="addAcronymAccordionId"
            @blur="touch('acronym')"
          >
            <InputGroup
              v-model="form.acronym"
              :label="$t('Acronym')"
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
              :required="true"
              type="textarea"
              :has-error="!!getFirstError('description')"
              :has-warning="!!getFirstWarning('description')"
              :error-text="getFirstError('description')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="useTagsAccordionId"
            @blur="touch('tags')"
          >
            <div class="mb-6">
              <SearchableSelect
                v-model="form.tags"
                :label="$t('Tags')"
                :placeholder="$t('Search a tag…')"
                :get-option-id="(tag) => tag.text"
                :suggest="suggestTags"
                :multiple="true"
                class="mb-2"

                :error-text="getFirstError('tags')"
                :warning-text="getFirstWarning('tags')"
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
            @blur="touch('frequency')"
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

              :error-text="getFirstError('frequency')"
              :warning-text="getFirstWarning('frequency')"
            >
              <template #option="{ option: frequency }">
                {{ frequency.label }}
              </template>
            </SearchableSelect>
          </LinkedToAccordion>
          <LinkedToAccordion
            :accordion="addTemporalCoverageAccordionId"
            class="fr-fieldset__element"
            @blur="touch('temporal_coverage')"
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
            @blur="touch('spatial_zones')"
          >
            <div class="fr-grid-row fr-grid-row--gutters">
              <div class="fr-col-12">
                <div class="mb-6">
                  <SearchableSelect
                    v-model="form.spatial_zones"
                    :label="$t('Spatial coverage')"
                    :placeholder="$t('Search a spatial coverage…')"
                    :suggest="suggestSpatial"
                    :multiple="true"
                    class="mb-2"

                    :error-text="getFirstError('spatial_zones')"
                    :warning-text="getFirstWarning('spatial_zones')"
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
                          v-if="getGranularityName(zone)"
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
                      v-for="zone in form.spatial_zones"
                      :key="zone.id"
                      class="fr-tag fr-tag--sm fr-tag--dismiss"
                      type="button"
                      @click="removeZone(zone)"
                    >
                      {{ zone.name }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="fr-col-12">
                <SearchableSelect
                  v-model="form.spatial_granularity"
                  :label="$t('Spatial granularity')"
                  :placeholder="$t('Search a granularity…')"
                  class="mb-6"
                  :get-option-id="(granularity) => granularity.id"
                  :display-value="(granularity) => granularity.name"
                  :options="granularities"
                  :multiple="false"

                  :error-text="getFirstError('spatial_granularity')"
                  :warning-text="getFirstWarning('spatial_granularity')"
                >
                  <template #option="{ option: granularity }">
                    {{ granularity.name }}
                  </template>
                </SearchableSelect>
              </div>
            </div>
          </LinkedToAccordion>
        </fieldset>
        <div class="fr-grid-row fr-grid-row--right">
          <div>{{ JSON.stringify(form) }}</div>
          <div>{{ JSON.stringify(errors) }}</div>
          <div>{{ JSON.stringify(warnings) }}</div>
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
import { computed, reactive } from 'vue'
import Accordion from '~/components/Accordion/Accordion.vue'
import AccordionGroup from '~/components/Accordion/AccordionGroup.vue'
import SearchableSelect from '~/components/SearchableSelect.vue'
import type { SpatialGranularity, SpatialZone, Tag } from '~/types/types'

// const props = defineProps<{}>()

const emit = defineEmits<{
  (event: 'next', dataset: NewDataset): void
}>()

const { t } = useI18n()
const config = useRuntimeConfig()

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

type Owned = { organization: Organization, owner: null } | { owner: Me, organization: null }
const ownedOptions = computed<Array<Owned>>(() => {
  return [...user.value.organizations.map(organization => ({ organization, owner: null })), { owner: user.value, organization: null }]
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
  form.value.spatial_zones = form.value.spatial_zones.filter(otherZone => otherZone.id !== zone.id)
}

const { form, errors, warnings, touch, getFirstError, getFirstWarning } = useForm({
  title: '',
  acronym: '',
  description: '',
  owned: null as Owned | null,
  tags: [] as Array<Tag>,
  license: null as EnrichedLicense | null,
  temporal_coverage: { start: null, end: null },
  frequency: null as Frequency | null,
  spatial_zones: [] as Array<SpatialZone>,
  spatial_granularity: null as SpatialGranularity | null,
}, {
  owned: [required()],
  title: [required()],
  description: [required()],
  frequency: [required()],
}, {
  description: [minLength(200, t('It\'s advised to have a description of at least {min} characters.', { min: 200 }))],
  tags: [required(t('Adding tags helps improve the SEO of your data.'))],
  license: [required()],
  frequency: [(f) => {
    if (f && f.id === 'unknown') return t('The value must be different than unknown.')

    return null
  }],
  spatial_granularity: [required(t('You have not specified the spatial granularity.'))],
  temporal_coverage: [required(t('You did not provide the temporal coverage.'))],

})

const accordionState = (key: keyof typeof form.value) => {
  if (getFirstError(key)) return 'error'
  if (getFirstWarning(key)) return 'warning'

  return 'default'
}

function submit() {
  validateRequiredRules().then((valid) => {
    if (valid) {
      console.log('here')
      // emit('next', dataset)
    }
  })
};
</script>
