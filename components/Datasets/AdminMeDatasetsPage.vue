<template>
  <div>
    <Breadcrumb>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/beta/admin"
        >
          {{ t('Administration') }}
        </NuxtLinkLocale>
      </li>
      <li>
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ t('Datasets') }}
        </a>
      </li>
    </Breadcrumb>
    <h1 class="fr-h3 fr-mb-5v">
      {{ t("Datasets") }}
    </h1>

    <div
      v-if="transfers && transfers.length"
      class="space-y-8 mb-8 max-w-6xl"
    >
      <TransferRequest
        v-for="transfer in transfers"
        :key="transfer.id"
        :transfer
        @done="refreshTransfers(); refreshDatasets()"
      />
    </div>

    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col">
        <h2
          v-if="pageData && pageData.length"
          class="subtitle subtitle--uppercase fr-m-0"
        >
          {{ t('{n} datasets', pageData.length) }}
        </h2>
      </div>
    </div>

    <LoadingBloc :status>
      <AdminDatasetsTable
        v-if="pageData && pageData.length > 0"
        :datasets="pageData ? pageData : []"
        :loading="false"
      />
    </LoadingBloc>

    <div
      v-if="pageData && !pageData.length"
      class="flex flex-col items-center"
    >
      <nuxt-img
        src="/illustrations/dataset.svg"
        class="h-20"
      />
      <p class="fr-text--bold fr-my-3v">
        {{ t(`You haven't published a dataset yet`) }}
      </p>
      <AdminPublishButton type="dataset" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Dataset } from '@datagouv/components'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
import AdminDatasetsTable from '~/components/AdminTable/AdminDatasetsTable/AdminDatasetsTable.vue'
import type { TransferRequest } from '~/types/types'

const { t } = useI18n()
const config = useRuntimeConfig()
const me = useMe()

const url = computed(() => {
  const url = new URL(`/api/1/me/datasets/`, config.public.apiBase)
  return url.toString()
})

const { data: pageData, status, refresh: refreshDatasets } = await useAPI<Array<Dataset>>(url, { lazy: true })

const transfersUrl = computed(() => {
  const url = new URL(`/api/1/transfer/`, config.public.apiBase)
  url.searchParams.set('subject_type', 'Dataset')
  url.searchParams.set('status', 'pending')
  url.searchParams.set('recipient', me.value.id)

  return url.toString()
})
const { data: transfers, refresh: refreshTransfers } = await useAPI<Array<TransferRequest>>(transfersUrl, { lazy: true })
</script>
