<template>
  <div
    class="fr-input-group"
    :class="{ 'fr-input-group--error': errorText, 'fr-input-group--warning': !errorText && warningText, 'fr-input-group--valid': validText }"
  >
    <label
      :for="id"
      :title="explanation"
      class="fr-label"
    >
      {{ label }}
      <Required :required="required" />
      <span
        v-if="explanation"
        class="fr-icon-information-line"
        aria-hidden="true"
      />
      <span
        v-if="hintText"
        class="fr-hint-text"
      >{{ hintText }}</span>
    </label>
    <Combobox
      v-model="model"
      :multiple
      :by="compareTwoOptions"
      :aria-describedby="ariaDescribedBy"
    >
      <div class="relative mt-1">
        <div
          class="relative w-full cursor-default overflow-hidden bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
        >
          <ComboboxInput
            :id
            class="fr-input"
            :display-value="(option: ModelType) => option ? displayValue(option): null"
            :placeholder
            @change="query = $event.target.value"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center pr-4 hover:!bg-transparent"
          >
            <Icon
              name="ri:arrow-down-s-line"
              class="size-4 text-gray-800"
              aria-hidden="true"
            />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leave-from="opacity-100"
          leave-to="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            ref="popover"
            class="z-10 mt-1 absolute max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm pl-0"
          >
            <div
              v-if="!filteredAndGroupedOptions && query !== ''"
              class="relative cursor-default select-none px-4 py-2 text-gray-700"
            >
              Nothing found.
            </div>

            <div
              v-for="(groupOptions, group) in filteredAndGroupedOptions"
              :key="group"
            >
              <li
                v-if="group"
                class="relative select-none py-4 px-4 list-none bg-gray-100 uppercase text-gray-800 font-semibold text-xs"
              >
                {{ group }}
              </li>
              <ComboboxOption
                v-for="option in groupOptions"
                :key="getOptionId(unref(option))"
                v-slot="comboboxSlot"
                as="template"
                :value="option"
              >
                <li
                  class="relative cursor-default select-none py-2 px-4 list-none flex items-center space-x-2"
                  :class="{
                    'bg-primary text-white': comboboxSlot.active,
                    'text-gray-900': !comboboxSlot.active,
                  }"
                >
                  <div
                    v-if="multiple"
                    class="flex items-center justify-center aspect-square"
                  >
                    <span v-if="comboboxSlot.selected">✓</span>
                  </div>
                  <slot
                    name="option"
                    v-bind="{ option, active: comboboxSlot.active as boolean }"
                  >
                    {{ displayValue(option) }}
                  </slot>
                </li>
              </ComboboxOption>
            </div>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
    <p
      v-if="errorText"
      :id="errorTextId"
      class="fr-error-text"
    >
      {{ errorText }}
    </p>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number | object, Multiple extends true | false">
import { ref, computed } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'

type ModelType = Multiple extends false ? T : Array<T>

const props = withDefaults(defineProps<{
  validText?: string
  errorText?: string | null
  warningText?: string | null
  hintText?: string
  explanation?: string
  label: string
  placeholder?: string

  getOptionId?: (option: T) => string | number
  groupBy?: (option: T) => string
  displayValue?: (option: ModelType) => string
  filter?: (option: T, query: string) => boolean
  options?: Array<T>
  suggest?: (query: string) => Promise<Array<T>>
  allowNewOption?: (query: string) => T

  required?: boolean
  multiple: Multiple
  isBlue?: boolean
}>(), {
  required: false,
  isBlue: false,
  displayValue: (_: ModelType): string => '',
  groupBy: (_: T): string => '',
  getOptionId: (option: T): string | number => {
    if (typeof option === 'string') return option
    if (typeof option === 'number') return option
    if (typeof option === 'object' && 'id' in option) return option.id as string

    throw new Error('Please set getOptionId()')
  },
  filter: (option: T, query: string): boolean => {
    const searchables = []

    if (typeof option === 'string') searchables.push(option)
    if (typeof option === 'number') searchables.push(option.toString())
    if (typeof option === 'object') {
      for (const value of Object.values(option)) {
        if (typeof value !== 'string') continue

        searchables.push(value)
      }
    }

    for (const searchable of searchables) {
      if (searchable.toLocaleLowerCase().includes(query.toLocaleLowerCase())) {
        return true
      }
    }

    return false
  },
})

const model = defineModel<ModelType | null>()

const id = useId()
const errorTextId = useId()

const ariaDescribedBy = computed(() => {
  if (props.errorText) return errorTextId
  return ''
})

const query = ref('')

const suggestedOptions = ref<Array<T> | null>(null)

watchEffect(async () => {
  if (!props.suggest) return

  suggestedOptions.value = await props.suggest(query.value)
})

const filteredOptions = computed<Array<T>>(() => {
  if (props.suggest) {
    return suggestedOptions.value as Array<T>
  }

  if (!props.options) throw new Error('Please set options or suggest')

  if (!query.value) return props.options
  return props.options.filter(option => props.filter(option, query.value))
})
const filteredOptionsWithNewOption = computed(() => {
  if (!props.allowNewOption || !query.value) return filteredOptions.value

  const newOption = props.allowNewOption(query.value)
  if (filteredOptions.value.find(option => compareTwoOptions(option, newOption))) return filteredOptions.value

  return [
    newOption,
    ...filteredOptions.value,
  ]
})

const filteredAndGroupedOptions = computed<Record<string, Array<T>>>(() => {
  if (!filteredOptionsWithNewOption.value) return {}

  const groups = {} as Record<string, Array<T>>
  for (const option of filteredOptionsWithNewOption.value) {
    const group = props.groupBy(option)
    groups[group] = groups[group] || []
    groups[group].push(option)
  }

  return groups
})

const compareTwoOptions = (a: T, b: T) => props.getOptionId(a) === props.getOptionId(b)
</script>
