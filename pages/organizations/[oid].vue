<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="bg-blue-lightest">
    <div class="container">
      <div class="flex items-center">
        <Breadcrumb class="flex-1 !text-gray-title">
          <BreadcrumbItem
            to="/"
            :external="true"
          >
            {{ $t('Home') }}
          </BreadcrumbItem>
          <BreadcrumbItem to="/organizations">
            {{ $t('Organizations') }}
          </BreadcrumbItem>
          <BreadcrumbItem>
            {{ organization.name }}
          </BreadcrumbItem>
        </Breadcrumb>
        <div v-if="isAdmin(me) || isMember">
          <EditButton
            :id="organization.id"
            type="organizations"
          />
        </div>
      </div>
    </div>
    <LoadingBlock :status>
      <div class="container">
        <Placeholder
          :src="organization.logo_thumbnail"
          type="organization"
          alt=""
          :size="80"
          class="bg-white p-1 rounded-sm border border-gray-default object-contain mt-14 mb-2.5"
        />
        <h1 class="!text-2xl !font-extrabold !mb-2.5">
          <OrganizationNameWithCertificate
            :certifier="config.public.title"
            :organization
            :show-type="false"
          />
        </h1>
        <OwnerType
          :type
          size="base"
          color="gray"
        />
      </div>
      <FullPageTabs
        class="mt-12"
        :links="[
          { label: $t('Presentation'), href: `/organizations/${route.params.oid}/` },
          { label: $t('Datasets'), href: `/organizations/${route.params.oid}/datasets`, count: organization.metrics.datasets },
          { label: $t('Dataservices'), href: `/organizations/${route.params.oid}/dataservices`, count: organization.metrics.dataservices },
          { label: $t('Reuses'), href: `/organizations/${route.params.oid}/reuses`, count: organization.metrics.reuses },
          { label: $t('Information'), href: `/organizations/${route.params.oid}/information` },
        ]"
      />
      <div class="bg-white pt-5 pb-8 lg:pb-24">
        <NuxtPage
          v-if="organization"
          class="container"
          :organization
        />
      </div>
    </LoadingBlock>
  </div>
</template>

<script setup lang="ts">
import { useOrganizationType, type Organization } from '@datagouv/components'
import EditButton from '~/components/BrandedButton/EditButton.vue'
import BreadcrumbItem from '~/components/Breadcrumbs/BreadcrumbItem.vue'
import Placeholder from '~/components/Placeholder/Placeholder.vue'

const config = useRuntimeConfig()
const route = useRoute()
const me = useMaybeMe()

const url = computed(() => `/api/1/organizations/${route.params.oid}/`)
const { data: organization, status } = await useAPI<Organization>(url)

const { type } = useOrganizationType(organization)
const isMember = computed(() => organization.value.members.some(member => member.user.id === me.value?.id))
</script>
