<template>
  <div class="fr-grid-row">
    <Sidemenu
      class="fr-col-12 fr-col-md-5"
      :button-text="t('Help')"
      :on-right="true"
      :fixed="true"
    >
      <template #title>
        <span
          class="fr-icon--sm fr-icon-question-line"
          aria-hidden="true"
        />
        {{ t('Help') }}
      </template>
      <AccordionGroup>
        <Accordion
          :id="nameOrganizationAccordionId"
          :title="t('Naming your organization')"
          :state="state.name"
        >
          <p class="fr-m-0">
            {{ t("The public name of your organization.") }} <br>
          </p>
        </Accordion>
        <Accordion
          :id="addAcronymAccordionId"
          :title="t('Choose an acronym')"
          :state="state.acronym"
        >
          <div class="markdown fr-m-0">
            <p class="fr-m-0">
              {{ t('The acronym of your organization, if it exists.') }}
            </p>
          </div>
        </Accordion>
        <Accordion
          :id="addSiretAccordionId"
          :title="t('Why provide a SIRET number?')"
          :state="state.business_number_id"
        >
          <p class="fr-m-0">
            {{ t("A SIRET number will allow us to assign a type to your organization (administrations, collectivities, companies, etc.) and will facilitate your certification.") }} <br>
            {{ t("Please note that all administrations have a SIRET number.") }} <br>
            {{ t("You can find your SIRET on ") }}<a
              class="text-decoration-underline"
              href="https://annuaire-entreprises.data.gouv.fr/"
              target="_blank"
            >{{ t("l’Annuaire des Entreprises.") }}</a>
          </p>
        </Accordion>
        <Accordion
          :id="addDescriptionAccordionId"
          :title="t('Write a good description')"
          :state="state.description"
        >
          <p class="fr-m-0">
            {{ t("Please indicate here what your organization does and what mission it fulfills. Add any information that will allow users to contact you: email address, mailing address, Twitter account, etc.") }}
          </p>
          <Well
            v-if="fieldHasWarning('description')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getWarningText("description") }}
          </Well>
        </Accordion>
        <Accordion
          :id="addWebsiteAccordionId"
          :title="t('Provide a website')"
          :state="state.url"
        >
          <p class="fr-m-0">
            {{ t("If your organization has a website, please provide its URL.") }}
          </p>
        </Accordion>
        <Accordion
          :id="addLogoAccordionId"
          :title="t('Choose the right logo')"
          :state="state.logo"
        >
          <p class="fr-m-0">
            {{ t(`If your organization has a logo or a profile picture, please upload it here. To upload a logo, click on the "Choose a file from your computer" button. The following image formats are accepted: png, jpg/jpeg.`) }}
          </p>
          <Well
            v-if="fieldHasWarning('frequency')"
            class="fr-mt-1w"
            color="orange-terre-battue"
          >
            {{ getWarningText("frequency") }}
          </Well>
        </Accordion>
      </AccordionGroup>
    </Sidemenu>
    <div class="fr-col-12 fr-col-md-7">
      <PaddedContainer>
        <Well
          v-if="showWell"
          color="blue-cumulus"
          weight="regular"
          class="fr-mb-2w"
        >
          <div class="fr-grid-row">
            <div class="fr-col-auto fr-mr-3v">
              <!-- <img
                :src="organizationIcon"
                alt=""
              > -->
            </div>
            <div class="fr-col">
              <p class="fr-m-0 fr-text--bold">
                {{ t('What is an organization?') }}
              </p>
              <p class="fr-m-0 fr-text--xs">
                {{ t('An organization is an entity in which many users can collaborate. The datasets published under the organization can be edited by its members.') }}
              </p>
            </div>
          </div>
        </Well>
        <fieldset
          class="fr-fieldset"
          :aria-labelledby="legend"
        >
          <legend
            v-if="showLegend"
            :id="legend"
            class="fr-fieldset__legend"
          >
            <h2 class="subtitle subtitle--uppercase fr-mb-3v">
              {{ t("Description") }}
            </h2>
          </legend>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="nameOrganizationAccordionId"
            @blur="vWarning$.name.$touch"
          >
            <InputGroup
              v-model="organization.name"
              data-testid="nameInput"
              :aria-describedby="nameOrganizationAccordionId"
              :label="t('Name')"
              :required="true"
              :has-error="fieldHasError('name')"
              :has-warning="fieldHasWarning('name')"
              :error-text="getErrorText('name')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="addAcronymAccordionId"
          >
            <InputGroup
              v-model="organization.acronym"
              data-testid="acronymInput"
              :aria-describedby="addAcronymAccordionId"
              :label="t('Acronym')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="addSiretAccordionId"
          >
            <InputGroup
              v-model="organization.business_number_id"
              data-testid="siretInput"
              :aria-describedby="addSiretAccordionId"
              :label="t('SIRET Number')"
              :has-error="fieldHasError('business_number_id')"
              :has-warning="fieldHasWarning('business_number_id')"
              :error-text="t('This SIRET is not valid')"
            />
          </LinkedToAccordion>
          <div
            v-if="checkOrga.exists !== null"
            class="fr-col fr-mx-1w fr-mb-1w bg-contrast-grey text-align-center fr-p-2w"
          >
            <div v-if="checkOrga.exists">
              <p class="fr-m-0 fr-text--sm fr-text--bold">
                {{ t('The SIRET n° {number} is matching', { number: organization.business_number_id }) }}
              </p>
              <p class="fr-m-0 fr-text--xs">
                {{ checkOrga.name }}
              </p>
              <OwnerType
                :type="checkOrga.type"
                color="black"
                size="xs"
              />
            </div>
            <div v-else>
              <p>{{ t('No organization found matching this SIRET on annuaire-entreprises.data.gouv.fr') }}</p>
            </div>
          </div>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="addDescriptionAccordionId"
            @blur="vWarning$.description.$touch"
          >
            <InputGroup
              v-model="organization.description"
              data-testid="descriptionInput"
              :aria-describedby="addDescriptionAccordionId"
              :label="t('Description')"
              :required="true"
              type="textarea"
              :has-error="fieldHasError('description')"
              :has-warning="fieldHasWarning('description')"
              :error-text="getErrorText('description')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="addWebsiteAccordionId"
          >
            <InputGroup
              v-model="organization.url"
              data-testid="websiteInput"
              :aria-describedby="addDescriptionAccordionId"
              :label="t('Website')"
              type="url"
              :has-error="fieldHasError('url')"
              :has-warning="fieldHasWarning('url')"
              :error-text="getErrorText('url')"
            />
          </LinkedToAccordion>
          <LinkedToAccordion
            class="fr-fieldset__element"
            :accordion="addLogoAccordionId"
            @blur="vWarning$.acronym.$touch"
          >
            <p>{{ t('Logo') }}</p>
            <!-- <UploadGroup
              :label="t('Logo')"
              :title="t('Logo')"
              hint-text="Max size: 4Mo. Accepted formats: JPG, JPEG, PNG"
              accept=".jpeg, .jpg, .png"
              :is-valid="!!file"
              :valid-text="t('Your file is valid')"
              @change="addFiles"
            /> -->
            <div
              v-show="imagePreview?.src"
              class="text-align-center"
            >
              <img
                ref="imagePreview"
                class="fr-col fr-mx-1w fr-mb-1w"
                width="300px"
              >
            </div>
          </LinkedToAccordion>
        </fieldset>
        <Alert
          v-if="errors.length"
          type="error"
          class="fr-mt-n2w fr-mb-2w"
        >
          <template #title>
            {{ t("An error occured | Some errors occured", errors.length) }}
          </template>
          <ul v-if="errors.length > 1">
            <li
              v-for="error in errors"
              :key="error"
            >
              {{ error }}
            </li>
          </ul>
          <p v-else>
            {{ errors[0] }}
          </p>
        </Alert>
        <div class="fr-grid-row fr-grid-row--right">
          <slot
            name="submitButton"
            :submit="submit"
          >
            <button
              class="fr-btn"
              data-testid="submitButton"
              @click="submit"
            >
              {{ t("Next") }}
            </button>
          </slot>
        </div>
        <slot />
      </PaddedContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OwnerType, Well, type NewOrganization, type Organization, type OrganizationTypes } from '@datagouv/components'
import { url } from '@vuelidate/validators'
import { computed, reactive, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { createMinLengthWarning, createRequired } from '~/utils/i18n'
import AccordionGroup from '~/components/Accordion/AccordionGroup.vue'
import Alert from '~/components/Alert/Alert.vue'
import InputGroup from '~/components/InputGroup/InputGroup.vue'
import LinkedToAccordion from '~/components/LinkedToAccordion/LinkedToAccordion.vue'
// import UploadGroup from '../../components/Form/UploadGroup/UploadGroup.vue'
// import organizationIcon from '../../../../templates/svg/illustrations/organization.svg'
import Accordion from '~/components/Accordion/Accordion.vue'
import type { PublishingFormAccordionState } from '~/types/form'
import Sidemenu from '~/components/Sidemenu/Sidemenu.vue'

const props = withDefaults(defineProps<{
  organization: NewOrganization | Organization
  errors: Array<string>
  showLegend?: boolean
  showWell?: boolean
}>(), {
  showLegend: true,
  showWell: true,
})

const emit = defineEmits<{
  (event: 'submit', submittedOrganization: typeof props.organization, file: File | null): void
}>()

const legend = 'description-legend'

defineExpose({ legend })

const nameOrganizationAccordionId = useId()
const addAcronymAccordionId = useId()
const addDescriptionAccordionId = useId()
const addSiretAccordionId = useId()
const addWebsiteAccordionId = useId()
const addLogoAccordionId = useId()

const config = useRuntimeConfig()
const nuxtApp = useNuxtApp()
const { t } = useI18n()

const organization = reactive<NewOrganization | Organization>({ ...props.organization })
const file = ref<File | null>(null)
const imagePreview = ref<HTMLImageElement | null>(null)

const required = createRequired(nuxtApp.$i18n)
const minLengthWarning = createMinLengthWarning(nuxtApp.$i18n)

const checkOrga = ref({
  name: '',
  siren: '',
  type: 'other' as OrganizationTypes,
  exists: null as boolean | null,
})

const checkBusinessId = () => {
  if (!organization.business_number_id || organization.business_number_id.length == 0) {
    return true
  }
  else if (organization.business_number_id.length == 14 && checkOrga.value.exists) {
    return true
  }
  else {
    return false
  }
}

const requiredRules = {
  business_number_id: { custom: checkBusinessId },
  description: { required },
  name: { required },
  url: { url },
}

const warningRules = {
  acronym: {},
  business_number_id: { custom: checkBusinessId },
  description: { required, minLengthValue: minLengthWarning(config.public.qualityDescriptionLength) },
  logo: {},
  name: { required },
  url: { url },
}

const { getErrorText, getFunctionalState, getWarningText, hasError, hasWarning, validateRequiredRules, v$, vWarning$ } = useFunctionalState(organization, requiredRules, warningRules)

const state = computed<Record<string, PublishingFormAccordionState>>(() => {
  return {
    acronym: vWarning$.value.acronym.$dirty ? 'info' : 'disabled',
    business_number_id: getFunctionalState(vWarning$.value.business_number_id.$dirty, v$.value.business_number_id.$invalid, vWarning$.value.business_number_id.$error),
    description: getFunctionalState(vWarning$.value.description.$dirty, v$.value.description.$invalid, vWarning$.value.description.$error),
    logo: vWarning$.value.logo.$dirty ? 'info' : 'disabled',
    name: getFunctionalState(vWarning$.value.name.$dirty, v$.value.name.$invalid, vWarning$.value.name.$error),
    url: getFunctionalState(vWarning$.value.url.$dirty, v$.value.url.$invalid, vWarning$.value.url.$error),
  }
})

function fieldHasError(field: string) {
  return hasError(state, field)
}

function fieldHasWarning(field: string) {
  return hasWarning(state, field)
}

function submit() {
  validateRequiredRules().then((valid) => {
    if (valid) {
      emit('submit', organization, file.value)
    }
  })
}

function addFiles(newFile: Array<File>) {
  file.value = newFile[0]
  if (imagePreview.value) {
    imagePreview.value.src = URL.createObjectURL(file.value)
  }
}

  type SearchAdditionalData = {
    collectivite_territoriale: { code: number } | null
    est_service_public: boolean
    est_association: boolean
  }

function getOrganizationType(complements: SearchAdditionalData): OrganizationTypes {
  if (complements.collectivite_territoriale) {
    return 'Local authority'
  }
  if (complements.est_service_public) {
    return 'public-service'
  }
  if (complements.est_association) {
    return 'Association'
  }
  return 'Company'
}

watchEffect(() => {
  const siret = organization.business_number_id?.replace(/\s/g, '')
  if (config.public.searchSirenUrl && siret?.length === 14) {
      type SearchSirenResponse = {
        total_results: number
        results: Array<{
          nom_complet: string
          siren: string
          complements: SearchAdditionalData
        }>
      }
      useAPI<SearchSirenResponse>(config.public.searchSirenUrl, {
        params: {
          q: siret,
          mtm_campaign: 'udata-front',
        },
      })
        .then(res => res.data)
        .then((result) => {
          if (result.value.total_results === 0) {
            checkOrga.value.exists = false
            checkOrga.value.type = 'other'
          }
          else {
            checkOrga.value.name = result.value.results[0].nom_complet
            checkOrga.value.siren = result.value.results[0].siren
            checkOrga.value.type = getOrganizationType(result.value.results[0].complements)
            checkOrga.value.exists = true
          }
        })
  }
  else {
    checkOrga.value.exists = null
  }
})
</script>
