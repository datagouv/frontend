<template>
  <div class="fr-grid-row">
    <Sidemenu
      class="fr-col-12 fr-col-lg-5"
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

      <div
        :id="accordionsId"
        class="flex flex-col-reverse"
      />
    </Sidemenu>
    <div class="fr-col-12 fr-col-lg-7">
      <div class="fr-p-3w bg-white">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import type { FormInfo } from '~/composables/useForm'

import { key } from '~/components/Accordion/injectionKey'

const props = defineProps<{
  formInfo: FormInfo<T>
}>()
const accordionsId = useId()

provide('accordionsId', accordionsId)
provide('formInfo', props.formInfo)

const opened = ref<string | null>(null)

provide(key, {
  isOpen(id: string) {
    return opened.value === id
  },

  open(id: string) {
    opened.value = id
  },

  toggle(id: string) {
    if (opened.value === id) {
      opened.value = null
    }
    else {
      opened.value = id
    }
  },

  unregister(id: string) {
    if (opened.value === id) {
      opened.value = null
    }
  },
})
</script>
