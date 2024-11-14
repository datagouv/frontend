<template>
  <div>
    <Breadcrumb>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/beta/admin"
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
            :icon="RiEyeLine"
          >
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
        type="markdown"
      />
      <InputGroup
        v-model="me.website"
        class="fr-col"
        :label="$t('Website')"
        type="url"
      />
      <div class="flex justify-end">
        <BrandedButton
          size="sm"
          :disabled="loading"
          :icon="RiSaveLine"
          @click="updateMe"
        >
          {{ $t('Save') }}
        </BrandedButton>
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
                :disabled="loading"
                :icon="RiRecycleLine"
                @click="regenerateApiKey"
              >
                {{ $t('Regenerate') }}
              </BrandedButton>
            </div>
            <div class="flex-none">
              <BrandedButton
                color="red"
                size="sm"
                type="secondary"
                :disabled="loading"
                :icon="RiDeleteBin6Line"
                @click="deleteApiKey"
              >
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
              :icon="RiEditLine"
            >
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
              :icon="RiEditLine"
            >
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
            :icon="RiDeleteBin6Line"
            @click="openDeleteModal"
          >
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
                <BrandedButton
                  color="red"
                  type="secondary"
                  role="button"
                  :disabled="loading"
                  @click="deleteUser"
                >
                  {{ $t("Delete your account") }}
                </BrandedButton>
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
import { RiDeleteBin6Line, RiEditLine, RiEyeLine, RiRecycleLine, RiSaveLine } from '@remixicon/vue'
import BrandedButton from '../BrandedButton/BrandedButton.vue'

const me = useMe()
const api = useNuxtApp().$api
const config = useNuxtApp().$config
const { toast } = useToast()
const { t } = useI18n()

const apiKeyId = useId()
const emailId = useId()
const passwordId = useId()
const modalId = useId()
const modalTitleId = useId()

const loading = ref(false)
const openedDeleteModal = ref(false)

function openDeleteModal() {
  openedDeleteModal.value = true
}

function closeDeleteModal() {
  openedDeleteModal.value = false
}

async function updateMe() {
  loading.value = true
  try {
    me.value = await api<Me>('/api/1/me/', {
      method: 'PUT',
      body: {
        first_name: me.value.first_name,
        last_name: me.value.last_name,
        about: me.value.about,
        website: me.value.website,
      },
    })

    toast.success(t('Profile updated !'))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }
  finally {
    loading.value = false
  }
}

async function regenerateApiKey() {
  loading.value = true
  try {
    const res = await api<{ apikey: string }>('/api/1/me/apikey/', {
      method: 'POST',
    })
    me.value.apikey = res.apikey
  }
  finally {
    loading.value = false
  }
}

async function deleteApiKey() {
  loading.value = true
  try {
    await api('/api/1/me/apikey/', {
      method: 'DELETE',
    })
    me.value.apikey = null
  }
  finally {
    loading.value = false
  }
}

async function deleteUser() {
  loading.value = true
  try {
    await api('/api/1/me/', {
      method: 'DELETE',
    })
    navigateTo(`${config.public.apiBase}/en/logout`, { external: true })
  }
  finally {
    loading.value = false
  }
}
</script>
