<template>
  <FormWithAccordions
    :form-info
    @submit.prevent="submit"
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
          {{ $t('On {site}, a dataset is a set of files.', { site: runtimeConfig.public.title }) }}
        </p>
      </div>
    </SimpleBanner>

    <RequiredExplanation />

    <FormFieldset
      v-if="type === 'create'"
      :legend="$t('Producer')"
    >
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
          :label="$t('Name')"
          :required="true"
        />

        <template #accordion>
          <HelpAccordion :title="$t('Naming your harvester')">
            <p class="fr-m-0">
              {{ $t("Choose a title that allows you to understand how the data is used rather than the name of the site or application ('Search engine for company agreements' rather than 'Accords-entreprise.fr' for example).") }} <br>
            </p>
          </HelpAccordion>
        </template>
      </FieldsetElement>
      <FieldsetElement form-key="description">
        <InputGroup
          v-model="form.description"
          type="markdown"
          :label="$t('Description')"
        />

        <template #accordion>
          <HelpAccordion :title="$t('Describe your harvester')">
            <p class="fr-m-0" />
          </HelpAccordion>
        </template>
      </FieldsetElement>
      <FieldsetElement form-key="url">
        <InputGroup
          v-model="form.url"
          type="url"
          :label="$t('URL')"
          :required="true"
        />

        <template #accordion>
          <HelpAccordion :title="$t('Select the correct URL')">
            <p class="fr-m-0" />
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
          <HelpAccordion :title="$t('Select the implementation type')">
            <p class="fr-m-0" />
          </HelpAccordion>
        </template>
      </FieldsetElement>

      <FieldsetElement
        v-if="backendInfo && backendInfo.filters.length"
        form-key="filters"
      >
        <label class="fr-label">
          {{ $t('Filters') }}
        </label>

        <div class="space-y-2">
          <div
            v-for="(filter, index) in form.filters"
            :key="index"
            class="flex items-center space-x-2.5"
          >
            <SelectGroup
              v-model="form.filters[index].type"
              class="!mb-0"
              label=""
              :options="[{ value: 'include', label: $t('Include') }, { value: 'exclude', label: $t('Exclude') }]"
            />
            <SelectGroup
              v-model="form.filters[index].key"
              class="!mb-0"
              label=""
              :options="backendInfo.filters.map((filter) => ({ value: filter.key, label: filter.label }))"
            />
            <InputGroup
              v-model="form.filters[index].value"
              class="!mb-0 w-full"
              label=""
            />
            <BrandedButton
              :icon="RiDeleteBinLine"
              size="xs"
              color="secondary"
              @click="form.filters.splice(index, 1)"
            >
              {{ $t('Remove') }}
            </BrandedButton>
          </div>
          <button
            class="flex items-center space-x-1 text-datagouv-dark"
            @click="form.filters.push({ type: 'include', key: backendInfo.filters[0].key, value: '' })"
          >
            <RiAddLine class="size-4" />
            <span>{{ $t('Add filter') }}</span>
          </button>
        </div>
        <template #accordion>
          <HelpAccordion :title="$t('Add config variables')">
            <p class="fr-m-0" />
          </HelpAccordion>
        </template>
      </FieldsetElement>

      <FieldsetElement
        v-if="backendInfo && backendInfo.extra_configs.length"
        form-key="configs"
      >
        <label class="fr-label">
          {{ $t('Configuration variables') }}
        </label>

        <div class="space-y-2">
          <div
            v-for="(config, index) in form.configs"
            :key="index"
            class="flex items-center space-x-2.5"
          >
            <label
              for=""
              class="fr-label whitespace-nowrap"
            >
              {{ getConfigLabel(config.key) }}
            </label>
            <InputGroup
              v-model="form.configs[index].value"
              class="!mb-0 w-full"
              label=""
            />
            <BrandedButton
              :icon="RiDeleteBinLine"
              size="xs"
              color="secondary"
              @click="form.configs.splice(index, 1)"
            >
              {{ $t('Remove') }}
            </BrandedButton>
          </div>

          <div class="flex items-center space-x-10">
            <button
              v-for="config in getMissingConfigs()"
              :key="config.key"
              class="flex items-center space-x-1 text-datagouv-dark"
              @click="form.configs.push({ key: config.key, value: '' })"
            >
              <RiAddLine class="size-4" />
              <span>{{ $t('Configure {label}', { label: config.label }) }}</span>
            </button>
          </div>
        </div>
        <template #accordion>
          <HelpAccordion :title="$t('Add filters')">
            <p class="fr-m-0" />
          </HelpAccordion>
        </template>
      </FieldsetElement>
    </FormFieldset>
    <FormFieldset
      v-if="isGlobalAdmin"
      :legend="$t('Advanced')"
    >
      <FieldsetElement form-key="schedule">
        <InputGroup
          v-model="form.schedule"
          :label="$t('Schedule')"
        />
      </FieldsetElement>
    </FormFieldset>

    <div class="fr-grid-row fr-grid-row--right">
      <slot name="button" />
    </div>
    <slot />
  </FormWithAccordions>
</template>

<script setup lang="ts">
import { RiAddLine, RiDeleteBinLine } from '@remixicon/vue'
import HelpAccordion from '../Form/HelpAccordion.vue'
import FieldsetElement from '../Form/FieldsetElement.vue'
import SelectGroup from '../Form/SelectGroup/SelectGroup.vue'
import InputGroup from '../InputGroup/InputGroup.vue'
import ProducerSelect from '~/components/ProducerSelect.vue'
import type { HarvestBackend, HarvesterForm } from '~/types/harvesters'

const props = defineProps<{
  type: 'create' | 'update'
}>()
const emit = defineEmits<{
  (event: 'submit'): void
}>()

const model = defineModel<HarvesterForm>({ required: true })
const runtimeConfig = useRuntimeConfig()
const { t } = useI18n()

const me = useMe()

onMounted(() => {
  if (props.type === 'update') validate()
})

const { data: backends } = await useAPI<Array<HarvestBackend>>('/api/1/harvest/backends', { lazy: true })

const { form, getFirstError, getFirstWarning, formInfo, validate } = useForm(model, {
  name: [required()],
  url: [required()],
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

const isGlobalAdmin = computed(() => isAdmin(me.value))

const backendInfo = computed(() => {
  if (!backends.value) return null
  return backends.value.find(backend => backend.id === form.value.backend)
})

function getConfigLabel(key: string): string {
  if (!backendInfo.value) return key
  return backendInfo.value.extra_configs.find(config => config.key === key)?.label || key
}

function getMissingConfigs(): HarvestBackend['extra_configs'] {
  if (!backendInfo.value) return []
  return backendInfo.value.extra_configs.filter((config) => {
    return !form.value.configs.find(existingConfig => existingConfig.key === config.key)
  })
}

function submit() {
  console.log('here')
  if (validate()) {
    console.log('there')
    emit('submit')
  }
};
</script>
