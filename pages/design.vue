<template>
  <DevOnly>
    <div class="fr-container space-y-8 my-8 bg-gray-200 pb-64">
      <div>
        <h1 class="!mb-3">
          Colors
        </h1>

        <div class="space-y-4">
          <div>
            <h2 class="!mb-2">
              Info
            </h2>

            <div class="flex space-x-4">
              <div class="size-12 bg-datagouv" />
              <div class="size-12 bg-datagouv-lightest" />
            </div>
          </div>
          <div>
            <h2 class="!mb-2">
              Danger
            </h2>

            <div class="flex space-x-4">
              <div class="size-12 bg-danger-dark" />
              <div class="size-12 bg-danger-lightest" />
            </div>
          </div>
          <div>
            <h2 class="!mb-2">
              Warning
            </h2>

            <div class="flex space-x-4">
              <div class="size-12 bg-warning-dark" />
              <div class="size-12 bg-warning-lightest" />
            </div>
          </div>
          <div>
            <h2 class="!mb-2">
              Success
            </h2>

            <div class="flex space-x-4">
              <div class="size-12 bg-success-dark" />
              <div class="size-12 bg-success-lightest" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 class="!mb-3">
          AdminBadge
        </h1>

        <AdminBadge />
      </div>
      <div>
        <h1 class="!mb-3">
          BannerAction
        </h1>

        <BannerAction />
      </div>
      <div>
        <h1 class="!mb-3">
          BannerNotif
        </h1>

        <BannerNotif />
      </div>
    </div>
  </DevOnly>
</template>

<script setup lang="ts">
import AdminBadge from '~/components/DesignSystem/AdminBadge.vue'
import BannerAction from '~/components/DesignSystem/BannerAction.vue'
import BannerNotif from '~/components/DesignSystem/BannerNotif.vue'
</script>
