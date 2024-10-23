<template>
  <div>
    <Breadcrumb>
      <li>
        <router-link class="fr-breadcrumb__link" to="/">
          {{ t('Administration') }}
        </router-link>
      </li>
      <li v-if="currentOrganization">
        <router-link class="fr-breadcrumb__link" to="/">
          {{ currentOrganization.name }}
        </router-link>
      </li>
      <li>
        <a class="fr-breadcrumb__link" aria-current="page">
          {{ t('Datasets') }}
        </a>
      </li>
    </Breadcrumb>
    <h1 class="fr-h3 fr-mb-5v">{{ t("Datasets") }}</h1>
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col">
        <h2 class="subtitle subtitle--uppercase fr-m-0" v-if="status === 'success'">{{ t('{n} datasets', pageData.total) }}</h2>
      </div>
      <div v-if="status === 'success' && oid && pageData.total" class="fr-col-auto fr-grid-row fr-grid-row--middle">
        <div>
          <a :href="`/organizations/${oid}/datasets.csv`" class="fr-btn fr-btn--sm fr-icon-download-line fr-btn--icon-left">
            {{ t('Download catalog') }}
          </a>
        </div>
      </div>
    </div>
    <AdminDatasetsTable
      v-if="status === 'pending' || (status === 'success' && pageData.total > 0)"
      :datasets="pageData.data"
      :loading="status === 'pending'"
      :sort-direction="direction"
      :sortedBy
      @sort="sort"
    />
    <div v-else class="container fr-my-2w">
      <div class="text-align-center fr-py-1w">
        <nuxt-img
              class="ml-6 -mt-7"
              src="/img/dataset.svg"
            />
        <p class="fr-text--bold fr-my-3v">
          {{ t(`You haven't published a dataset yet`) }}
        </p>
        <AdminPublishButton type="dataset" />
      </div>
    </div>
    <Pagination
      v-if="status === 'success' && pageData.total > pageSize"
      :page="page"
      :page-size="pageSize"
      :total-results="pageData.total"
      @change="(changedPage: number) => page = changedPage"
    />
  </div>
</template>
<script setup lang="ts">
import { Pagination, type Dataset } from "@datagouv/components";
import { refDebounced } from "@vueuse/core";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb.vue";
import AdminDatasetsTable from "~/components/AdminTable/AdminDatasetsTable/AdminDatasetsTable.vue";

type DatasetSortedBy = 'title' | 'created' | 'last_update' | 'reuses' | 'followers' | 'views';
export type SortDirection = 'asc' | 'desc';

const { t } = useI18n();
const props = defineProps<{oid?: string}>();
const config = useRuntimeConfig();

// const datasets = ref<Array<Dataset>>([]);
// const loading = ref(false);
const page = ref(1);
const pageSize = ref(10);
// const totalResult = ref(0);;
const sortedBy = ref<DatasetSortedBy>('created');
const direction = ref<SortDirection>('desc');
const sortDirection = computed(() => `${direction.value === 'asc' ? "" : "-"}${sortedBy.value}`);
const q = ref("");
const qDebounced = refDebounced(q, 500); // TODO add 500 in config

const { currentOrganization } = useCurrentOrganization();
const me = useMe();

function sort(column: DatasetSortedBy, newDirection: SortDirection) {
  sortedBy.value = column;
  direction.value = newDirection;
}

const url = computed(() => {
  let url;
  if (props.oid) {
    url = new URL(`/api/1/organizations/${props.oid}/datasets/`, config.public.apiBase)
  } else {
    url = new URL(`/api/1/datasets/`, config.public.apiBase)
    url.searchParams.set('owner', me.value.id)
  }

  url.searchParams.set('sort', sortDirection.value)
  url.searchParams.set('q', qDebounced.value)
  url.searchParams.set('page_size', pageSize.value.toString())
  url.searchParams.set('page', page.value.toString())

  return url
})

const { data: pageData, status } = await useAPI<PaginatedArray<Dataset>>(url, { lazy: true });

// watchEffect(async () => {
//   loading.value = true;
//   datasets.value = [];
//   try {
//     let response;
//     if (props.oid) {
//       response = await getOrganizationDatasets(props.oid, qDebounced.value, page.value, pageSize.value, sortDirection.value);
//     } else if (me) {
//       response = await getUserDatasets(me.id, qDebounced.value, page.value, pageSize.value, sortDirection.value);
//     } else {
//       return
//     }
//     datasets.value = response.data;
//     page.value = response.page;
//     pageSize.value = response.page_size;
//     totalResult.value = response.total;
//   } finally {
//     loading.value = false;
//   }
// });
</script>
