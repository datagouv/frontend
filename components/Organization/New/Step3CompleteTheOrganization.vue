<template>
  <PaddedContainer>
    <Well
      color="blue-cumulus"
      weight="regular"
      class="-mb-3"
    >
      <div class="flex flex-wrap gap-3">
        <div class="flex-none">
          <NuxtImg
            src="/illustrations/organization.svg"
            width="50"
            loading="lazy"
            alt=""
          />
        </div>
        <div class="flex-1">
          <p class="m-0 font-bold">
            {{ $t('Your organization is created !') }}
          </p>
          <p class="m-0 text-xs">
            {{ $t('You can now publish content or incite members to join your organization.') }}
          </p>
        </div>
      </div>
    </Well>
    <article class="my-6 p-6 !border border-neutral-200 fr-enlarge-link">
      <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--top">
        <div class="fr-col-auto">
          <Placeholder
            v-if="organization.logo_thumbnail"
            type="organization"
            :src="organization.logo_thumbnail"
            alt=""
            :size="60"
          />
          <Placeholder
            v-else
            type="organization"
            :size="60"
          />
        </div>
        <div class="fr-col">
          <h4 class="fr-mb-1v fr-grid-row">
            <a
              :href="organization.page"
              class="text-grey-500"
            >
              {{ organization.name }}
              <small v-if="organization.acronym">{{ organization.acronym }}</small>
            </a>
          </h4>
          <Suspense>
            <AsyncTextClamp
              class="fr-mt-1w fr-mb-2w fr-hidden fr-unhidden-sm overflow-wrap-anywhere"
              :auto-resize="true"
              :text="removeMarkdown(organization.description)"
              :max-lines="2"
            />
          </Suspense>
        </div>
      </div>
    </article>
    <div class="fr-grid-row fr-grid-row--right gap-3">
      <NuxtLinkLocale
        :to="`/beta/admin/organizations/${organization.id}/profile`"
        class="fr-btn fr-btn--secondary fr-btn--secondary-grey-500"
      >
        {{ $t("Manage the organization") }}
      </NuxtLinkLocale>
      <NuxtLinkLocale
        to="/beta/admin/reuses/new"
        class="fr-btn"
      >
        {{ $t("Publish a reuse") }}
      </NuxtLinkLocale>
      <NuxtLinkLocale
        to="/beta/admin/datasets/new"
        class="fr-btn"
      >
        {{ $t("Publish a dataset") }}
      </NuxtLinkLocale>
    </div>
    <Alert
      v-if="errors?.length"
      type="error"
      class="fr-mt-2w fr-mb-2w"
    >
      <template #title>
        {{ $t("An error occured | Some errors occured", errors.length) }}
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
  </PaddedContainer>
</template>

<script setup lang="ts">
import { removeMarkdown, Well, type Organization } from '@datagouv/components'

defineProps<{
  organization: Organization
  errors?: Array<string>
}>()
</script>
