<template>
  <div>
    <Breadcrumb>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/newadmin"
        >
          {{ $t('Administration') }}
        </NuxtLinkLocale>
      </li>
      <li>
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ $t('Profile') }}
        </a>
      </li>
    </Breadcrumb>
    <h1 class="fr-h3 !mb-5">
      {{ $t("Profil") }}
    </h1>
    <PaddedContainer class="!p-5">
      <div class="flex items-center">
        <div class="flex-none">
          <Avatar
            :user="me"
            :rounded="true"
            :size="80"
          />
        </div>
        <h2 class="flex-1 !ml-3 !mb-0 fr-h3">
          {{ me.first_name }} {{ me.last_name }}
        </h2>
        <div class="flex-none">
          <BrandedButton
            size="sm"
            type="secondary"
            as="a"
            :href="me.page"
          >
            <Icon
              name="ri:eye-line"
              class="mr-1"
            />
            {{ $t('See public profile') }}
          </BrandedButton>
        </div>
      </div>
    </PaddedContainer>
    <h2 class="uppercase !text-sm !my-5">
      {{ $t('Edit Profile') }}
    </h2>
    <PaddedContainer class="!p-5">
      <fieldset class="fr-grid-row fr-grid-row--gutters">
        <InputGroup
          v-model="me.first_name"
          class="fr-col"
          autocomplete="given-name"
          :label="$t('First name')"
          :required="true"
          :spellcheck="false"
        />
        <InputGroup
          v-model="me.last_name"
          class="fr-col"
          autocomplete="family-name"
          :label="$t('Last name')"
          :required="true"
          :spellcheck="false"
        />
      </fieldset>
      <InputGroup
        v-model="me.about"
        class="fr-col"
        :label="$t('Biography')"
        type="textarea"
      />
      <InputGroup
        v-model="me.website"
        class="fr-col"
        :label="$t('Website')"
        type="url"
      />
      <div class="flex justify-end">
        <button class="fr-btn fr-btn--sm">
          <Icon
            class="mr-1"
            name="ri:save-line"
          />
          {{ $t('Save') }}
        </button>
      </div>
      <div class="fr-input-group">
        <label
          class="fr-label"
          :for="apiKeyId"
        >
          {{ $t('API Key') }}
          <span class="fr-hint-text">
            {{ $t('Warning: If you erase your API key you risk to loose acces to {site} services', { site: config.public.title }) }}
          </span>
        </label>
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-12 fr-col-sm">
            <div class="fr-input-wrap relative">
              <input
                :id="apiKeyId"
                v-model="me.apikey"
                class="fr-input pr-12"
                disabled
                type="text"
              >
              <CopyButton
                v-if="me.apikey"
                class="absolute right-1 top-1"
                :label="$t('Copy API key')"
                :copied-label="$t('API ley copied')"
                :text="me.apikey"
              />
            </div>
          </div>
          <div class="fr-col-auto flex gap-4">
            <div class="flex-none">
              <BrandedButton
                color="neutral"
                size="sm"
                type="secondary"
                :disabled="apiLoading"
                @click="regenerateApiKey"
              >
                <Icon
                  name="ri:recycle-line"
                  class="mr-1"
                />
                {{ $t('Regenerate') }}
              </BrandedButton>
            </div>
            <div class="flex-none">
              <BrandedButton
                color="red"
                size="sm"
                type="secondary"
                :disabled="apiLoading"
                @click="deleteApiKey"
              >
                <Icon
                  name="ri:delete-bin-6-line"
                  class="mr-1"
                />
                {{ $t('Delete') }}
              </BrandedButton>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-input-group">
        <label
          class="fr-label mb-2"
          :for="emailId"
        >
          {{ $t('E-mail address') }}
        </label>
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-12 fr-col-sm-7 fr-col-lg-8 fr-col-xl-9">
            <div class="fr-input-wrap relative">
              <input
                :id="emailId"
                v-model="me.email"
                class="fr-input"
                disabled
                type="text"
              >
            </div>
          </div>
          <div class="fr-col-auto">
            <BrandedButton
              color="neutral"
              size="sm"
              type="secondary"
              as="a"
              :href="`${config.public.apiBase}/${config.public.changeEmailPage}`"
            >
              <Icon
                name="ri:edit-line"
                class="mr-1"
              />
              {{ $t('Change e-mail address') }}
            </BrandedButton>
          </div>
        </div>
      </div>
      <div class="fr-input-group">
        <label
          class="fr-label mb-2"
          :for="passwordId"
        >
          {{ $t('Password') }}
        </label>
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-12 fr-col-sm-7 fr-col-lg-8 fr-col-xl-9">
            <div class="fr-input-wrap relative">
              <input
                :id="passwordId"
                value="**********"
                class="fr-input"
                disabled
                type="password"
              >
            </div>
          </div>
          <div class="fr-col-auto">
            <BrandedButton
              color="neutral"
              size="sm"
              type="secondary"
              as="a"
              :href="`${config.public.apiBase}/${config.public.changePasswordPage}`"
            >
              <Icon
                name="ri:edit-line"
                class="mr-1"
              />
              {{ $t('Change password') }}
            </BrandedButton>
          </div>
        </div>
      </div>
      <AdminDangerZone
        class="mt-5"
      >
        <div class="fr-col">
          <p class="fr-m-0 text-neutral-800">
            {{ $t('Delete your account') }}
          </p>
          <p class="fr-m-0 fr-text--xs text-red-600">
            {{ $t("Be careful, this action can't be reverse.") }}
          </p>
        </div>
        <div class="fr-col-auto">
          <BrandedButton
            color="red"
            size="sm"
            type="secondary"
            :aria-controls="modalId"
            @click="openDeleteModal"
          >
            <Icon
              name="ri:delete-bin-6-line"
              class="mr-1"
            />
            {{ $t('Delete') }}
          </BrandedButton>
          <Modal
            :id="modalId"
            :opened="openedDeleteModal"
            :aria-labelledby="modalTitleId"
            role="dialog"
            :title="$t('Are you sure you want to delete this organization ?')"
            size="lg"
            @close="closeDeleteModal"
          >
            <p class="fr-text--bold">
              {{ $t("This action can't be reverse.") }}
            </p>
            <p>{{ $t("All content published with this organization will stay online, with the same URL but in an anonymous form, i.e. without being linked to a data producer.") }}</p>
            <p>{{ $t("If you want to delete your published content too, start by deleting the contents before deleting your account.") }}</p>
            <template #footer>
              <div class="flex-1 fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                <button
                  class="fr-btn fr-btn--secondary rounded-full !text-red-600 !border border-solid !border-red-600 !shadow-none"
                  role="button"
                  @click="deleteUser"
                >
                  {{ $t("Delete your account") }}
                </button>
              </div>
            </template>
          </Modal>
        </div>
      </AdminDangerZone>
    </PaddedContainer>
  </div>
</template>

<script setup lang="ts">
import { Avatar, CopyButton } from '@datagouv/components'
import BrandedButton from '../BrandedButton/BrandedButton.vue'

const me = useMe()
const api = useNuxtApp().$api
const config = useNuxtApp().$config
const apiKeyId = useId()
const emailId = useId()
const passwordId = useId()
const modalId = useId()
const modalTitleId = useId()

const apiLoading = ref(false)
const openedDeleteModal = ref(false)

function openDeleteModal() {
  openedDeleteModal.value = true
}

function closeDeleteModal() {
  openedDeleteModal.value = false
}

async function regenerateApiKey() {
  apiLoading.value = true
  try {
    const res = await api<{ apikey: string }>('/api/1/me/apikey', {
      method: 'POST',
    })
    me.value.apikey = res.apikey
  }
  finally {
    apiLoading.value = false
  }
}

async function deleteApiKey() {
  apiLoading.value = true
  try {
    await api('/api/1/me/apikey', {
      method: 'DELETE',
    })
    me.value.apikey = null
  }
  finally {
    apiLoading.value = false
  }
}

function deleteUser() {

}
</script>
