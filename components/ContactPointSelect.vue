<template>
  <div>
    <div>
      <SearchableSelect
        v-model="contact"
        :options="contactsWithNewOption"
        :label="t('Choose the contact point with which you want to publish')"
        :placeholder="t('Select a contact point')"
        :display-value="(option) => 'id' in option ? (option.name || option.email || $t('Unknown')) : t('New contact')"
        :get-option-id="(option) => 'id' in option ? option.id : 'new'"
        :multiple="false"
        :loading
        :error-text
        :warning-text
      >
        <template #option="{ option }">
          <span v-if="'id' in option">
            <template v-if="option.name">
              {{ option.name }} <template v-if="option.email">({{ option.email }})</template>
            </template>
            <template v-else-if="option.email">
              {{ option.email }}
            </template>
            <template v-else>
              {{ $t('Unknown') }}
            </template>
          </span>
          <span v-else>
            {{ t('New contact') }}
          </span>
        </template>
      </SearchableSelect>
    </div>
    <br>
    <div
      v-if="contact && !('id' in contact)"
      class="fr-fieldset__element"
    >
      <InputGroup
        v-model="newContactForm.name"
        required
        :label="t('Contact Name')"
        :has-error="!!getFirstError('name')"
        :has-warning="!!getFirstWarning('name')"
        :error-text="getFirstError('name')"
        @blur="touch('name')"
      />
      <InputGroup
        v-model="newContactForm.email"
        :label="t('Contact Email')"
        placeholder="contact@organization.org"
        :has-error="!!getFirstError('email')"
        :has-warning="!!getFirstWarning('email')"
        :error-text="getFirstError('email')"
        @blur="touch('email')"
      />
      <InputGroup
        v-model="newContactForm.contact_form"
        type="url"
        :label="t('Contact URL')"
        placeholder="https://..."
        :has-error="!!getFirstError('contact_form')"
        :has-warning="!!getFirstWarning('contact_form')"
        :error-text="getFirstError('contact_form')"
        @blur="touch('contact_form')"
      />
    </div>
    <div v-else>
      <div
        v-if="contact?.email"
        class="fr-fieldset__element"
      >
        {{ t("Contact email:") }} {{ contact.email }}
      </div>
      <div
        v-if="contact?.contact_form"
        class="fr-fieldset__element"
      >
        {{ t("Contact link:") }} {{ contact.contact_form }}
      </div>
    </div>
    <button
      v-if="! contact || 'id' in contact"
      class="flex items-center space-x-1 text-datagouv-dark"
      type="button"
      @click="contact = newContactForm"
    >
      <RiAddLine class="size-4" />
      <span>{{ $t('New contact') }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Organization } from '@datagouv/components'
import { RiAddLine } from '@remixicon/vue'
import InputGroup from './InputGroup/InputGroup.vue'
import type { ContactPoint, ContactPointInForm, NewContactPoint, PaginatedArray } from '~/types/types'

const { t } = useI18n()

const { form: newContactForm, getFirstError, getFirstWarning, touch } = useForm({
  name: '',
  email: '',
  contact_form: '',
} as NewContactPoint, {
  name: [required()],
  email: [email()],
  contact_form: [url()],
}, {})

const contact = defineModel<ContactPointInForm | null>()

console.log(contact.value)

const props = defineProps<{
  organization: Organization
  errorText?: string | null
  warningText?: string | null
}>()

const contactsUrl = computed(() => `/api/1/organizations/${props.organization.id}/contacts`)
const { data: contacts, status } = await useAPI<PaginatedArray<ContactPoint>>(contactsUrl, { lazy: true })
const loading = computed(() => status.value === 'pending')
const contactsWithNewOption = computed<Array<ContactPointInForm>>(() => {
  return [
    ...contacts.value?.data || [],
    newContactForm.value,
  ]
})
</script>
