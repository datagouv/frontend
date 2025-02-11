<template>
  <div class="fr-container--fluid">
    <AdminBreadcrumb>
      <BreadcrumbItem>{{ t('Profile') }}</BreadcrumbItem>
    </AdminBreadcrumb>

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
      type="update"
      :submit-label="$t('Save')"
      :organization="organization"
      :errors="errors"
      :show-legend="false"
      :show-well="false"
      @submit="updateCurrentOrganization"
    >
      <template #default>
        <BannerAction
          class="mt-12"
          type="danger"
          :title="$t('Delete the organization')"
        >
          {{ t("Be careful, this action can't be reverse.") }}
          <template #button>
            <ModalWithButton
              :title="t('Are you sure you want to delete this organization ?')"
              size="lg"
            >
              <template #button="{ attrs, listeners }">
                <BrandedButton
                  :disabled="loading"
                  color="danger"
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
          </template>
        </BannerAction>
      </template>
    </DescribeOrganizationFrom>
  </div>
</template>

<script setup lang="ts">
import { Placeholder, useOrganizationCertified, type NewOrganization, type Organization } from '@datagouv/components'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiDeleteBin6Line } from '@remixicon/vue'
import AdminLoader from '~/components/AdminLoader/AdminLoader.vue'
import AdminBreadcrumb from '~/components/Breadcrumbs/AdminBreadcrumb.vue'
import BreadcrumbItem from '~/components/Breadcrumbs/BreadcrumbItem.vue'
import PaddedContainer from '~/components/PaddedContainer/PaddedContainer.vue'
import DescribeOrganizationFrom from '~/components/Organization/New/Step2DescribeOrganization.vue'
import { updateOrganization, uploadLogo } from '~/api/organizations'

const props = defineProps<{
  organization: Organization | null
}>()
const emit = defineEmits<{
  refresh: []
}>()

const { t } = useI18n()
const { toast } = useToast()
const route = useRoute()
const { $api } = useNuxtApp()
const oid = route.params.oid as string
const localPath = useLocalePath()
const form = ref<InstanceType<typeof DescribeOrganizationFrom> | null>(null)

const { currentOrganization } = useOrganizations()

const errors = ref([])

const loading = computed(() => !props.organization)

const { organizationCertified } = useOrganizationCertified(props.organization)

async function deleteCurrentOrganization() {
  if (currentOrganization.value) {
    await $api(`api/1/organizations/${oid}/`, { method: 'DELETE' })
    reloadNuxtApp({
      path: localPath('/beta/admin/me/profile'),
    })
  }
}

async function updateCurrentOrganization(updatedOrganization: NewOrganization | Organization, logo_file: File | null) {
  await updateOrganization(updatedOrganization as Organization)
  if (logo_file && props.organization) {
    await uploadLogo(props.organization.id, logo_file)
  }

  emit('refresh')
  toast.success(t('Organization updated !'))

  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}
</script>
