<template>
  <div class="w-full">
    <SimpleBanner
      type="primary"
      class="mb-4 flex items-center space-x-5"
    >
      <AdminLoader class="size-14" />

      <div class="w-full">
        <p class="font-bold mb-1">
          {{ $t("Your harvester's preview is loading.") }}
        </p>
        <p class="m-0 text-xs/5">
          {{ $t('This may take a few moments, thank you for your patience.') }}
        </p>
      </div>
    </SimpleBanner>
    <div class="animate-pulse-placeholder space-y-8">
      <div class="bg-gray-200 w-64 h-6 mb-3 " />
      <div class="space-y-1.5 mb-5">
        <div class="bg-gray-200 w-48 h-4 " />
        <div class="bg-gray-200 w-72 h-4 " />
        <div class="bg-gray-200 w-64 h-4 " />
        <div class="bg-gray-200 w-52 h-4 " />
      </div>
      <div class="bg-gray-200 w-64 h-4 mb-2.5" />
      <AdminTable class="!pt-0">
        <thead>
          <tr>
            <AdminTableTh scope="col">
              <div class="bg-gray-200 w-32 h-4 mb-0.5" />
            </AdminTableTh>
            <AdminTableTh scope="col">
              <div class="bg-gray-200 w-32 h-4 mb-0.5" />
            </AdminTableTh>
            <AdminTableTh scope="col">
              <div class="bg-gray-200 w-32 h-4 mb-0.5" />
            </AdminTableTh>
            <AdminTableTh scope="col">
              <div class="bg-gray-200 w-32 h-4 mb-0.5" />
            </AdminTableTh>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="i in 2"
            :key="i"
          >
            <td>
              <div class="bg-gray-200 w-64 h-4 " />
            </td>
            <td>
              <div class="bg-gray-200 w-64 h-4 " />
            </td>
            <td>
              <div class="bg-gray-200 w-64 h-4 " />
            </td>
            <td class="font-mono !text-right">
              <div class="bg-gray-200 w-64 h-4 " />
            </td>
          </tr>
        </tbody>
      </AdminTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminLoader from '../AdminLoader/AdminLoader.vue'
import AdminTable from '~/components/AdminTable/Table/AdminTable.vue'
import AdminTableTh from '~/components/AdminTable/Table/AdminTableTh.vue'
</script>
