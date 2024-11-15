<template>
  <SearchableSelect
    v-model="model"
    :options="ownedOptions"
    :label="t('Check the identity with which you want to publish')"
    :placeholder="t('Search…')"
    :get-option-id="(option) => option.organization ? option.organization.id : option.owner.id"
    :display-value="(option) => option.organization ? option.organization.name : `${option.owner.first_name} ${option.owner.last_name}`"
    :filter="(option, query) => (option.organization ? option.organization.name : `${option.owner.first_name} ${option.owner.last_name}`).toLocaleLowerCase().includes(query.toLocaleLowerCase())"
    :multiple="false"

    :error-text
    :warning-text
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
          :src="avatar"
          loading="lazy"
          alt=""
        >
        <span v-if="option.organization">{{ option.organization.name }}</span>
        <span v-else>{{ option.owner.first_name }} {{ option.owner.last_name }}</span>
      </div>
    </template>
  </SearchableSelect>
</template>

<script setup lang="ts">
import { useUserAvatar } from '@datagouv/components'
import type { Owned } from '~/types/types'

defineProps<{
  errorText?: string | null
  warningText?: string | null
}>()
const model = defineModel<Owned | null>({ required: true })

const { t } = useI18n()
const user = useMe()

const avatar = computed(() => useUserAvatar(user.value, 24))

const ownedOptions = computed<Array<Owned>>(() => {
  return [...user.value.organizations.map(organization => ({ organization, owner: null })), { owner: user.value, organization: null }]
})
</script>
