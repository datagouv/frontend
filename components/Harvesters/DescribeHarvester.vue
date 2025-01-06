<template>
  <FormWithAccordions
    :form-info
    @submit="submit"
  >
    <SimpleBanner
      v-if="type === 'create'"
      type="primary"
      class="mb-4 flex items-center space-x-5"
    >
      <NuxtImg
        src="/illustrations/edit.svg"
        loading="lazy"
        class="size-14 shrink-0"
        alt=""
      />
      <div class="w-full">
        <p class="font-bold mb-1">
          {{ $t('What is a dataset?') }}
        </p>
        <p class="m-0 text-xs/5">
          {{ $t('On {site}, a dataset is a set of files.', { site: config.public.title }) }}
        </p>
      </div>
    </SimpleBanner>

    <RequiredExplanation />

    <FormFieldset :legend="$t('Producer')">
      <FieldsetElement form-key="owned">
        <ProducerSelect
          v-model="form.owned"
          :label="t('Check the identity with which you want to publish')"
          :required="true"
          :error-text="getFirstError('owned')"
          :warning-text="getFirstWarning('owned')"
        />
      </FieldsetElement>
    </FormFieldset>

    <FormFieldset :legend="$t('Description')">
      <FieldsetElement form-key="name">
        <InputGroup
          v-model="form.name"
          :label="$t('Dataset name')"
        />

        <template #accordion>
          <HelpAccordion :title="$t('Naming your dataset')">
            <p class="fr-m-0">
              {{ $t("The title of your dataset should be as precise and specific as possible.") }} <br>
              {{ $t("It should also correspond to the vocabulary used by users.") }} <br>
              {{ $t("They often search for data in a search engine.") }}
            </p>
          </HelpAccordion>
        </template>
      </FieldsetElement>
      <FieldsetElement form-key="description">
        <InputGroupInFieldset
          v-model="form.description"
          type="markdown"
          :label="$t('Description')"
        />

        <template #accordion>
          <HelpAccordion :title="$t('Describe your dataset')">
            <p class="fr-m-0">
              {{ $t("The title of your dataset should be as precise and specific as possible.") }} <br>
              {{ $t("It should also correspond to the vocabulary used by users.") }} <br>
              {{ $t("They often search for data in a search engine.") }}
            </p>
          </HelpAccordion>
        </template>
      </FieldsetElement>
      <FieldsetElement form-key="url">
        <InputGroup
          v-model="form.url"
          type="url"
          :label="$t('URL')"
        />

        <template #accordion>
          <HelpAccordion :title="$t('Describe your dataset')">
            <p class="fr-m-0">
              {{ $t("The title of your dataset should be as precise and specific as possible.") }} <br>
              {{ $t("It should also correspond to the vocabulary used by users.") }} <br>
              {{ $t("They often search for data in a search engine.") }}
            </p>
          </HelpAccordion>
        </template>
      </FieldsetElement>
    </FormFieldset>
    <FormFieldset :legend="$t('Implementation')">
      <FieldsetElement form-key="backend">
        <SelectGroup
          v-model="form.backend"
          :label="t('Type')"
          :options="backendOptions"
        />
        <template #accordion>
          <HelpAccordion :title="$t('Describe your dataset')">
            <p class="fr-m-0">
              {{ $t("The title of your dataset should be as precise and specific as possible.") }} <br>
              {{ $t("It should also correspond to the vocabulary used by users.") }} <br>
              {{ $t("They often search for data in a search engine.") }}
            </p>
          </HelpAccordion>
        </template>
      </FieldsetElement>

      <FieldsetElement form-key="config">
        <SelectGroup
          v-model="form.backend"
          :label="t('Type')"
          :options="backendOptions"
        />
        <template #accordion>
          <HelpAccordion :title="$t('Describe your dataset')">
            <p class="fr-m-0">
              {{ $t("The title of your dataset should be as precise and specific as possible.") }} <br>
              {{ $t("It should also correspond to the vocabulary used by users.") }} <br>
              {{ $t("They often search for data in a search engine.") }}
            </p>
          </HelpAccordion>
        </template>
      </FieldsetElement>
    </FormFieldset>

    <div>
      {{ JSON.stringify(backendInfo) }}
    </div>

    <div>
      {{ JSON.stringify(form) }}
    </div>

    <div
      class="fr-grid-row"
      :class="{ 'fr-grid-row--right': type === 'update', 'justify-between': type === 'create' }"
    >
      <BrandedButton
        v-if="type === 'create'"
        color="secondary"
        @click="$emit('previous')"
      >
        {{ $t('Previous') }}
      </BrandedButton>
      <BrandedButton
        type="submit"
        color="primary"
      >
        {{ $t('Test') }}
      </BrandedButton>
    </div>
    <slot />
  </FormWithAccordions>
</template>

<script setup lang="ts">
import HelpAccordion from '../Form/HelpAccordion.vue'
import FieldsetElement from '../Form/FieldsetElement.vue'
import SelectGroup from '../Form/SelectGroup/SelectGroup.vue'
import ProducerSelect from '~/components/ProducerSelect.vue'
import type { HarvestBackend, HarvesterForm } from '~/types/harvesters'

const model = defineModel<HarvesterForm>({ required: true })

const { t } = useI18n()
const config = useRuntimeConfig()

const { data: backends } = await useAPI<Array<HarvestBackend>>('/api/1/harvest/backends', { lazy: true })

const type = 'create' as 'create' | 'update'

const { form, getFirstError, getFirstWarning, formInfo } = useForm(model, {
  name: [required()],
}, {
  description: [minLength(500)],
})

const backendOptions = computed(() => {
  if (!backends.value) return []
  return backends.value.map(backend => ({
    value: backend.id,
    label: backend.label,
  }))
})

const backendInfo = computed(() => {
  if (!backends.value) return null
  return backends.value.find(backend => backend.id === form.value.backend)
})

const submit = () => {}
</script>
