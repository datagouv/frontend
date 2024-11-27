<template>
  <div class="fr-container--fluid">
    <Breadcrumb>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/beta/admin"
        >
          {{ t('Administration') }}
        </NuxtLinkLocale>
      </li>
      <li v-if="currentOrganization">
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ currentOrganization.name }}
        </NuxtLinkLocale>
      </li>
      <li>
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ t('Profile') }}
        </a>
      </li>
    </Breadcrumb>
    <h1 class="fr-h3 fr-mb-5v">
      {{ t("Profile") }}
    </h1>
    <PaddedContainer
      v-if="organization"
      class="fr-mb-5v"
    >
      <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle justify-between">
        <div class="fr-col-12 fr-col-md fr-grid-row fr-grid-row--middle">
          <Placeholder
            :src="organization.logo"
            type="organization"
            :size="80"
            class="rounded border"
          />
          <div class="fr-col fr-ml-3v fr-my-0 fr-h3">
            {{ organization.name }}
            <span
              v-if="organizationCertified"
              class="fr-icon-success-line fr-icon--lg text-blue-400"
              :title="t('The identity of this public service is certified by {certifier}', { certifier: $config.public.title })"
              aria-hidden="true"
            />
          </div>
        </div>
        <div class="fr-col-auto">
          <a
            :href="organization.page"
            class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--secondary-grey-500 fr-btn--icon-left fr-icon-eye-line"
          >
            {{ t('See the organization page') }}
          </a>
        </div>
      </div>
    </PaddedContainer>
    <h2
      v-if="form"
      :id="form.legend"
      class="subtitle subtitle--uppercase fr-mb-5v"
    >
      {{ t("Edit profile") }}
    </h2>
    <AdminLoader v-if="loading && !organization" />
    <DescribeOrganizationFrom
      v-if="organization"
      ref="form"
      :organization="organization"
      :errors="errors"
      :show-legend="false"
      :show-well="false"
      @submit="updateCurrentOrganization"
    >
      <template #submitButton="{ submit }">
        <button
          class="fr-btn fr-btn--icon-left fr-icon-save-line"
          :disabled="loading"
          data-testid="submitButton"
          @click="submit"
        >
          {{ t("Save") }}
        </button>
      </template>
      <template #default>
        <AdminDangerZone
          class="fr-mt-6w"
        >
          <div class="fr-col">
            <p class="fr-m-0 text-neutral-800">
              {{ t('Delete the organization') }}
            </p>
            <p class="fr-m-0 fr-text--xs text-default-error">
              {{ t("Be careful, this action can't be reverse.") }}
            </p>
          </div>
          <div class="fr-col-auto">
            <ModalWithButton
              :title="t('Are you sure you want to delete this organization ?')"
              size="lg"
            >
              <template #button="{ attrs, listeners }">
                <BrandedButton
                  :disabled="loading"
                  level="secondary"
                  color="red"
                  :icon="RiDeleteBin6Line"
                  v-bind="attrs"
                  v-on="listeners"
                >
                  {{ t('Delete') }}
                </BrandedButton>
              </template>
              <template #default>
                <p class="fr-text--bold">
                  {{ t("This action can't be reverse.") }}
                </p>
                <p>{{ t("All content published with this organization will stay online, with the same URL but in an anonymous form, i.e. without being linked to a data producer.") }}</p>
                <p>{{ t("If you want to delete your published content too, start by deleting the contents before deleting your account.") }}</p>
              </template>
              <template #footer>
                <div class="flex-1 fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                  <button
                    class="fr-btn fr-btn--secondary rounded-full !text-red-600 !border border-solid !border-red-600 !shadow-none"
                    role="button"
                    :disabled="loading"
                    @click="deleteCurrentOrganization"
                  >
                    {{ t("Delete the organization") }}
                  </button>
                </div>
              </template>
            </ModalWithButton>
          </div>
        </AdminDangerZone>
      </template>
    </DescribeOrganizationFrom>
  </div>
</template>

<script setup lang="ts">
import { Placeholder, useOrganizationCertified, type NewOrganization, type Organization } from '@datagouv/components'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiDeleteBin6Line } from '@remixicon/vue'
import AdminDangerZone from '~/components/AdminDangerZone/AdminDangerZone.vue'
import AdminLoader from '~/components/AdminLoader/AdminLoader.vue'
import Breadcrumb from '~/components/Breadcrumb/Breadcrumb.vue'
import PaddedContainer from '~/components/PaddedContainer/PaddedContainer.vue'
import DescribeOrganizationFrom from '~/components/Organization/New/Step2DescribeOrganization.vue'
import { updateOrganization, uploadLogo } from '~/api/organizations'

const { t } = useI18n()
const { toast } = useToast()
const route = useRoute()
const { $api } = useNuxtApp()
const oid = route.params.oid as string
const localPath = useLocalePath()
const form = ref<InstanceType<typeof DescribeOrganizationFrom> | null>(null)

const { currentOrganization } = await useOrganizations()

const errors = ref([])

const { data: organization, status, refresh: refreshOrganization } = await useAPI<Organization>(`api/1/organizations/${oid}/`, { lazy: true })

const loading = computed(() => status.value === 'pending')

const { organizationCertified } = useOrganizationCertified(organization)

async function deleteCurrentOrganization() {
  if (currentOrganization.value) {
    try {
      await $api(`api/1/organizations/${oid}/`, { method: 'DELETE' })
      reloadNuxtApp({
        path: localPath('/beta/admin/me/profile'),
      })
    }
    catch (e) {
      toast.error(t('An error occured when deleting the organization.'))
    }
  }
}

async function updateCurrentOrganization(updatedOrganization: NewOrganization | Organization, logo_file: File | null) {
  try {
    await updateOrganization(updatedOrganization as Organization)
    refreshOrganization()
    toast.success(t('Organization updated !'))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }
  catch (e) {
    toast.error(t('An error occured when updating the organization.'))
  }
  if (logo_file && organization.value) {
    try {
      const resp = await uploadLogo(organization.value.id, logo_file)
      organization.value.logo_thumbnail = resp.image
    }
    catch (e) {
      toast.error(t('Failed to upload logo, you can upload it again in your management panel'))
    }
  }
}
</script>
