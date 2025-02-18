<template>
  <div class="fr-py-3w fr-mb-3w border-bottom border-default-grey">
    <h2 class="subtitle subtitle--uppercase">
      {{ $t('Informations') }}
    </h2>
    <div class="fr-text--sm fr-m-0">
      <dl class="fr-grid-row fr-grid-row--gutters">
        <div
          v-if="license"
          class="fr-col-12 fr-col-sm-6 fr-col-md-4"
        >
          <dt class="subtitle fr-mb-0">
            {{ $t('License') }}
          </dt>
          <dd class="fr-text--sm fr-m-0 text-mention-grey fr-p-0">
            <code class="bg-alt-grey fr-px-1v text-grey-380">
              <a :href="license.url">
                {{ license.title }}
              </a>
            </code>
          </dd>
        </div>
        <div class="fr-col-12 fr-col-sm-6 fr-col-md-4">
          <dt class="subtitle fr-mb-0">
            ID
          </dt>
          <dd class="fr-text--sm fr-m-0 text-mention-grey fr-p-0">
            {{ dataset.id }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
  <div class="fr-pb-3w fr-mb-3w border-bottom border-default-grey">
    <h2 class="subtitle subtitle--uppercase">
      {{ $t('Temporality') }}
    </h2>
    <div class="fr-text--sm fr-m-0">
      <dl class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-sm-6 fr-col-md-4">
          <dt class="subtitle fr-mb-0">
            {{ $t('Creation') }}
          </dt>
          <dd class="fr-text--sm fr-m-0 text-mention-grey fr-p-0">
            {{ formatDate(dataset.created_at) }}
          </dd>
        </div>
        <div
          v-if="frequency"
          class="fr-col-12 fr-col-sm-6 fr-col-md-4"
        >
          <dt class="subtitle fr-mb-0">
            {{ $t('Frequency') }}
          </dt>
          <dd class="fr-text--sm fr-m-0 text-mention-grey fr-p-0">
            {{ frequency.label }}
          </dd>
        </div>
      </dl>
      <dl class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-sm-6 fr-col-md-4">
          <dt class="subtitle fr-mb-0">
            {{ $t('Last update') }}
          </dt>
          <dd class="fr-text--sm fr-m-0 text-mention-grey fr-p-0">
            {{ formatDate(props.dataset.last_update) }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
  <div class="fr-pb-3w fr-mb-3w border-bottom border-default-grey">
    <h2 class="subtitle subtitle--uppercase">
      {{ $t('Spatial coverage') }}
    </h2>
    <div class="fr-text--sm fr-m-0">
      <dl class="fr-grid-row fr-grid-row--gutters">
        <div
          v-if="zonesLabels.length"
          class="fr-col-12 fr-col-sm-6 fr-col-md-4"
        >
          <dt class="subtitle fr-mb-0">
            {{ $t('Territorial coverage') }}
          </dt>
          <dd class="fr-text--sm fr-m-0 text-mention-grey fr-p-0">
            {{ zonesLabels.join(', ') }}
          </dd>
        </div>
        <div
          v-if="granularity"
          class="fr-col-12 fr-col-sm-6 fr-col-md-4"
        >
          <dt class="subtitle fr-mb-0">
            {{ $t('Granularity of territorial coverage') }}
          </dt>
          <dd class="fr-text--sm fr-m-0 text-mention-grey fr-p-0">
            {{ granularity.name }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
  <div class="fr-pb-3w fr-mb-3w border-bottom border-default-grey">
    <h2 class="subtitle subtitle--uppercase">
      Actions
    </h2>
    <div class="fr-text--sm fr-m-0">
      <h3 class="subtitle fr-mb-1v">
        {{ $t('Integrate on your website') }}
        <CopyButton
          :hide-label="true"
          :label="$t('Copy embed')"
          :copied-label="$t('Embed copied')"
          class="fr-my-1w fr-mr-1w"
          :text="embedText"
        />
      </h3>
      <div class="embed-wrapper">
        <textarea
          ref="textAreaRef"
          v-model="embedText"
          readonly="true"
          rows="1"
          @click="selectContent"
        />
      </div>
    </div>
  </div>
  <div v-if="hasExtras">
    <ExtraAccordion
      :button-text="t('See extras')"
      :title-text="t('Extras')"
      :extra="props.dataset.extras"
      title-level="h2"
    />
  </div>
  <div v-if="props.dataset?.harvest">
    <ExtraAccordion
      :button-text="t('See harvest')"
      :title-text="t('Harvest')"
      :extra="props.dataset.harvest"
      title-level="h2"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDate } from '../functions/dates'
// import useOEmbed from '../../composables/useOEmbed'
// import ExtraAccordion from '../ExtraAccordion/ExtraAccordion.vue'
import type { Dataset, DatasetV2 } from '../types/datasets'
import type { Granularity } from '../types/granularity'
import type { Frequency } from '../types/frequency'
import type { License } from '../types/licenses'
import { useFetch } from '../functions/api'
import CopyButton from './CopyButton.vue'

const props = defineProps<{
  dataset: DatasetV2 | Dataset
  // license: License
  // granularities: Array<Granularity>
  // zones: Array<{ id: string, type: string, features: Array<{ id: string, type: string, geometry: { type: string, coordinates: unknown }, properties: unknown }> }>
  // frequencies: Array<Frequency>
}>()
const { t } = useI18n()
// const embedText = useOEmbed('dataset', props.dataset.id)
const textAreaRef = ref<HTMLTextAreaElement | null>(null)

const hasExtras = computed(() => Object.keys(props.dataset.extras).length > 0)

function selectContent() {
  if (textAreaRef.value) {
    textAreaRef.value.select()
  }
};

const { data: allLicenses } = await useFetch<Array<License>>('/api/1/datasets/licenses')
const license = computed(() => {
  if (!props.dataset.license) return null
  if (!allLicenses.value) return null

  return allLicenses.value.find(license => license.id === props.dataset.license)
})

const { data: frequencies } = await useFetch<Array<Frequency>>('/api/1/dataset/frequencies')
const frequency = computed(() => {
  if (!props.dataset.frequency) return null
  if (!frequencies.value) return null

  return frequencies.value.find(frequency => frequency.id === props.dataset.frequency)
})

const zonesUrl = computed(() => {
  if (!props.dataset.spatial?.zones || !props.dataset.spatial.zones.length) return null

  return `/api/1/spatial/zones/${props.dataset.spatial.zones.join(',')}`
})
const { data: zones } = await useFetch<Array<any>>(zonesUrl)
const zonesLabels = computed(() => {
  if (!zones.value) return []
  return zones.value.map(zone => zone.features[0].properties.name)
})

const { data: granularities } = await useFetch<Array<Granularity>>('/api/1/dataset/granularities')
const granularity = computed(() => {
  if (!props.dataset.spatial?.granularity) return null
  if (!granularities.value) return null

  return granularities.value.find(granularity => granularity.id === props.dataset.spatial?.granularity)
})
</script>
