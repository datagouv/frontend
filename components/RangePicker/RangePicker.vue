<template>
  <div
    class="rangepicker fr-select"
    :class="{ 'rangepicker--selected': start }"
  >
    <div v-show="selectorShown === selectorShownStart">
      <p class="rangepicker__hint fr-m-0">
        {{ $t('Select lower bound:') }}
      </p>
      <Datepicker
        ref="start"
        v-model="start"
        :upper-limit="end"
        :locale="locale"
        @update:model-value="showEndSelector"
      />
    </div>
    <div v-show="selectorShown === selectorShownEnd">
      <p class="rangepicker__hint fr-m-0">
        {{ $t('Select upper bound:') }}
      </p>
      <Datepicker
        ref="end"
        v-model="end"
        :lower-limit="start"
        :locale="locale"
        @update:model-value="hideSelector"
      />
    </div>
    <button
      v-if="selectorShown === null"
      class="rangepicker__button w-100 text-align-left"
      @click.prevent="showStartSelector"
    >
      <template v-if="!start">
        {{ $t('from dd/mm/yyyy to dd/mm/yyyy') }}
      </template>
      <template v-else>
        {{ formatDate(start, formatTemplate) }}<template v-if="end">
          –{{ formatDate(end, formatTemplate) }}
        </template>
        <button
          v-if="start"
          class="fr-fi-close-line clear"
          @click.stop="clear"
        />
      </template>
    </button>
  </div>
</template>

<script setup lang="ts">
import Datepicker from 'vue3-datepicker'
import { ref, watch } from 'vue'
import { formatDate } from '@datagouv/components'
import { getDatepickerLocale } from '~/utils/i18n'

type RangePickerValue = { start: Date | null, end: Date | null }
type RangePickerReturn = { [Property in keyof RangePickerValue]: string | null }

const props = withDefaults(defineProps<{
  modelValue: RangePickerValue
}>(), {
  modelValue: () => { return { start: null, end: null } },
})

const emit = defineEmits<{
  'change': [value: RangePickerReturn]
  'update:modelValue': [value: RangePickerReturn]
}>()

const nuxtApp = useNuxtApp()

const locale = getDatepickerLocale(nuxtApp.$i18n.locale)

const start = ref<string | Date | undefined>(props.modelValue.start ?? undefined)

const end = ref<string | Date | undefined>(props.modelValue.end ?? undefined)

const startRef = useTemplateRef<InstanceType<typeof Datepicker> | null>('start')

const endRef = useTemplateRef<InstanceType<typeof Datepicker> | null>('end')

const selectorShown = ref<string | null>(null)

const selectorShownStart = 'START'
const selectorShownEnd = 'END'

/**
 * Format for dayjs
 * L is for localized DD/MM/YYYY
 */
const formatTemplate = 'L'

watch([start, end], () => {
  let value: { [Property in keyof RangePickerValue]: string | null } = {
    start: null,
    end: null,
  }

  if (start.value && end.value) {
    value = {
      start: formatDate(start.value, 'yyyy-MM-dd'),
      end: formatDate(end.value, 'yyyy-MM-dd'),
    }
  }

  emit('update:modelValue', value)
  emit('change', value)
})

const clear = () => {
  start.value = undefined
  end.value = undefined
}

const showSelector = (selectorRef: Ref<InstanceType<typeof Datepicker> | null>) => {
  if (selectorRef.value) {
    selectorRef.value.renderView(selectorRef.value.initialView)
  }
}

const showStartSelector = () => {
  selectorShown.value = selectorShownStart
  showSelector(startRef)
}

const showEndSelector = () => {
  selectorShown.value = selectorShownEnd
  showSelector(endRef)
}

const hideSelector = () => {
  selectorShown.value = null
}
</script>
