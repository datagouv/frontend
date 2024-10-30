<template>
  <div>
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
    <Combobox v-model="model">
      <div class="relative mt-1">
        <div
          class="relative w-full cursor-default overflow-hidden bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
        >
          <ComboboxInput
            :id
            class="fr-input"
            :display-value="(option: T) => option ? displayValue(option): null"
            :placeholder
            @change="query = $event.target.value"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center pr-4 hover:bg-transparent"
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
            class="z-10 mt-1 absolute max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm pl-0"
          >
            <div
              v-if="filteredOptions.length === 0 && query !== ''"
              class="relative cursor-default select-none px-4 py-2 text-gray-700"
            >
              Nothing found.
            </div>

            <ComboboxOption
              v-for="option in filteredOptions"
              :key="getOptionId(option)"
              v-slot="comboboxSlot"
              as="template"
              :value="option"
            >
              <li
                class="relative cursor-default select-none py-2 px-4 list-none"
                :class="{
                  'bg-primary text-white': comboboxSlot.active,
                  'text-gray-900': !comboboxSlot.active,
                }"
              >
                <slot
                  name="option"
                  v-bind="{ ...comboboxSlot, option }"
                />
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number | object">
import { ref, computed } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'

const props = withDefaults(defineProps<{
  validText?: string
  errorText?: string
  hintText?: string
  explanation?: string
  label: string
  placeholder?: string

  getOptionId: (option: T) => string | number
  displayValue: (option: T) => string
  options?: Array<T>
  suggest?: (query: string) => Promise<Array<T>>

  required?: boolean
  isBlue?: boolean
}>(), {
  required: false,
  isBlue: false,
})

const model = defineModel<T | null>()

const id = useId()
const query = ref('')

const suggestedOptions = ref<Array<T> | null>(null)

watchEffect(async () => {
  if (!props.suggest) return

  suggestedOptions.value = await props.suggest(query.value)
})

const filteredOptions = computed(() => {
  if (props.suggest) {
    return suggestedOptions.value
  }
  else {
    // TODO
    return []
  }
})
</script>
