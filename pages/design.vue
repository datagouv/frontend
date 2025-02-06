<template>
  <DevOnly>
    <div class="fr-container space-y-8 py-8 bg-gray-100 pb-32">
      <h1 class="!mb-3">
        Design System
      </h1>
      <section>
        <h2 class="!mb-3">
          Colors
        </h2>

        <div class="space-y-4">
          <div>
            <h3 class="!mb-2">
              Info
            </h3>

            <div class="flex space-x-4">
              <div class="size-12 bg-datagouv" />
              <div class="size-12 bg-datagouv-lightest" />
            </div>
          </div>
          <div>
            <h3 class="!mb-2">
              Danger
            </h3>

            <div class="flex space-x-4">
              <div class="size-12 bg-danger-dark" />
              <div class="size-12 bg-danger-lightest" />
            </div>
          </div>
          <div>
            <h3 class="!mb-2">
              Warning
            </h3>

            <div class="flex space-x-4">
              <div class="size-12 bg-warning-dark" />
              <div class="size-12 bg-warning-lightest" />
            </div>
          </div>
          <div>
            <h3 class="!mb-2">
              Success
            </h3>

            <div class="flex space-x-4">
              <div class="size-12 bg-success-dark" />
              <div class="size-12 bg-success-lightest" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 class="!mb-3">
          BrandedButton
        </h2>

        <BrandedButton />
      </section>
      <section>
        <h2 class="!mb-3">
          AdminBadge
        </h2>

        <AdminBadge />
      </section>
      <section>
        <h2 class="!mb-3">
          BannerAction
        </h2>

        <BannerAction />
      </section>
      <section>
        <h2 class="!mb-3">
          BannerNotif
        </h2>

        <BannerNotif />
      </section>
      <section>
        <h2 class="!mb-3">
          OrganizationNameWithCertificate
        </h2>

        <OrganizationNameWithCertificate />
      </section>
    </div>
    <div class="space-y-8 py-8 pb-64">
      <h2 class="!mb-3">
        Full width content
      </h2>

      <section class="space-y-3">
        <h3 class="!mb-3">
          BannerSticky in a contained page
        </h3>

        <div class="flex gap-3">
          <NuxtLinkLocale
            :external="true"
            to="https://www.figma.com/design/fvtAhJSd1hURLxy8GXmc3k/%F0%9F%8E%81-%5BWIP%5D-Syt%C3%A8me-U?node-id=105-4173&t=5JmPave6D8hPb2gG-4"
          >
            View design
          </NuxtLinkLocale>
          <NuxtLinkLocale
            :external="true"
            to="https://github.com/datagouv/front-end/blob/main/components/BannerSticky.vue"
          >
            View code
          </NuxtLinkLocale>
        </div>

        <DesignSystemBannerSticky />
      </section>
      <section>
        <h2 class="!mb-3">
          FullPageTabs
        </h2>

        <DesignSystemFullPageTabs />
      </section>
    </div>
  </DevOnly>
</template>

<script setup lang="ts">
import AdminBadge from '~/components/DesignSystem/AdminBadge.vue'
import BannerAction from '~/components/DesignSystem/BannerAction.vue'
import BannerNotif from '~/components/DesignSystem/BannerNotif.vue'
import BrandedButton from '~/components/DesignSystem/BrandedButton.vue'
import OrganizationNameWithCertificate from '~/components/DesignSystem/OrganizationNameWithCertificate.vue'
</script>
