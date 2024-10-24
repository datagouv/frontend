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
            {{ t('Reuses') }}
          </a>
        </li>
      </Breadcrumb>
      <h1 class="fr-h3 fr-mb-5v">{{ t("Reuses") }}</h1>
      <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
        <div class="fr-col">
          <h2 class="subtitle subtitle--uppercase fr-m-0" v-if="status === 'success'">{{ t('{n} reuses', pageData.total) }}</h2>
        </div>
        <div v-if="status === 'success' && oid && pageData.total" class="fr-col-auto fr-grid-row fr-grid-row--middle">
          <div>
            <a :href="`/organizations/${oid}/reuses.csv`" class="fr-btn fr-btn--sm fr-icon-download-line fr-btn--icon-left">
              {{ t('Download catalog') }}
            </a>
          </div>
        </div>
      </div>
      <AdminReusesTable
        v-if="status === 'pending' || (status === 'success' && pageData.total > 0)"
        :reuses="pageData ? pageData.data : []"
        :loading="status === 'pending'"
        :sort-direction="direction"
        :sortedBy
        @sort="sort"
      />
      <div v-else class="container fr-my-2w">
        <div class="text-align-center fr-py-1w">
          <nuxt-img
                class="ml-6 -mt-7"
                src="/img/reuses.svg"
              />
          <p class="fr-text--bold fr-my-3v">
            {{ t(`You haven't published a reuse yet`) }}
          </p>
          <AdminPublishButton type="reuse" />
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
  import { Pagination, type Reuse } from "@datagouv/components";
  import { refDebounced } from "@vueuse/core";
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import type { PaginatedArray, ReuseSortedBy, SortDirection } from "~/types/types";
  import Breadcrumb from "../Breadcrumb/Breadcrumb.vue";
  import AdminReusesTable from "../AdminTable/AdminReusesTable/AdminReusesTable.vue";
  
  const { t } = useI18n();
  const props = defineProps<{oid?: string}>();
  const config = useRuntimeConfig();
  
  const page = ref(1);
  const pageSize = ref(10);
  const sortedBy = ref<ReuseSortedBy>('created');
  const direction = ref<SortDirection>('desc');
  const sortDirection = computed(() => `${direction.value === 'asc' ? "" : "-"}${sortedBy.value}`);
  const q = ref("");
  const qDebounced = refDebounced(q, 500); // TODO add 500 in config
  
  const { currentOrganization } = useCurrentOrganization();
  const me = useMe();
  
  function sort(column: ReuseSortedBy, newDirection: SortDirection) {
    sortedBy.value = column;
    direction.value = newDirection;
  }
  
  const url = computed(() => {
    let url;
    if (props.oid) {
      url = new URL(`/api/1/organizations/${props.oid}/reuses/`, config.public.apiBase)
    } else {
      url = new URL(`/api/1/reuses/`, config.public.apiBase)
      url.searchParams.set('owner', me.value.id)
    }
  
    url.searchParams.set('sort', sortDirection.value)
    url.searchParams.set('q', qDebounced.value)
    url.searchParams.set('page_size', pageSize.value.toString())
    url.searchParams.set('page', page.value.toString())
  
    return url.toString()
  })
  
  const { data: pageData, status } = await useAPI<PaginatedArray<Reuse>>(url, { lazy: true });
  </script>
  