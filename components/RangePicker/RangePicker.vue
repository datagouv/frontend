<template>
  <div
    class="rangepicker fr-select"
    :class="{ 'rangepicker--selected': model.start }"
  >
    <div v-show="selectorShown === selectorShownStart">
      <p class="rangepicker__hint fr-m-0">
        {{ $t('Select lower bound:') }}
      </p>
      <DatePickerClient
        ref="start"
        v-model="model.start"
        :upper-limit="model.end"
        :locale="locale"
        @update:model-value="showEndSelector"
      />
    </div>
    <div v-show="selectorShown === selectorShownEnd">
      <p class="rangepicker__hint fr-m-0">
        {{ $t('Select upper bound:') }}
      </p>
      <DatePickerClient
        ref="end"
        v-model="model.end"
        :lower-limit="model.start"
        :locale="locale"
        @update:model-value="hideSelector"
      />
    </div>
    <button
      v-if="selectorShown === null"
      class="rangepicker__button w-100 text-align-left"
      type="button"
      @click.prevent="showStartSelector"
    >
      <template v-if="!model.start">
        {{ $t('from dd/mm/yyyy to dd/mm/yyyy') }}
      </template>
      <template v-else>
        {{ formatDate(model.start, formatTemplate) }}<template v-if="model.end">
          –{{ formatDate(model.end, formatTemplate) }}
        </template>
        <button
          v-if="model.start"
          class="fr-fi-close-line clear"
          @click.stop="clear"
        />
      </template>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatDate } from '@datagouv/components'
import DatePickerClient from '../DatePicker.client.vue'
import { getDatepickerLocale } from '~/utils/i18n'

type RangePickerValue = { start: Date | null, end: Date | null }

const model = defineModel<RangePickerValue>({ default: { start: null, end: null } })

const nuxtApp = useNuxtApp()

const locale = getDatepickerLocale(nuxtApp.$i18n.locale)

const start = ref()
const end = ref()

const selectorShown = ref<string | null>(null)

const selectorShownStart = 'START'
const selectorShownEnd = 'END'

/**
 * Format for dayjs
 * L is for localized DD/MM/YYYY
 */
const formatTemplate = 'L'

const clear = () => {
  model.value = { start: null, end: null }
}

const showSelector = (selectorRef: Ref<InstanceType<any> | null>) => {
  if (selectorRef.value) {
    selectorRef.value.renderView(selectorRef.value.initialView)
  }
}

const showStartSelector = () => {
  selectorShown.value = selectorShownStart
  showSelector(start)
}

const showEndSelector = () => {
  selectorShown.value = selectorShownEnd
  showSelector(end)
}

const hideSelector = () => {
  selectorShown.value = null
}
</script>

<style>
/* not working with scoped because maybe it's teleported outside the component? */
.rangepicker .v3dp__datepicker .v3dp__input_wrapper {
  display: none;
}
</style>
