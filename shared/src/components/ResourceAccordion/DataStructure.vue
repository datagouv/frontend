<template>
  <div
    v-if="hasError"
    class="bg-alt-green-tilleul-verveine fr-p-3v fr-mb-2w"
  >
    <p class="fr-grid-row fr-m-0">
      <span
        class="fr-icon-warning-line"
        aria-hidden="true"
      />
      {{ $t("The data structure of this file failed to load.") }}
    </p>
  </div>
  <PreviewLoader v-else-if="loading" />
  <div
    v-else
    class="fr-grid-row fr-grid-row--gutters"
  >
    <div
      v-if="!hasColumnInfo"
      class="bg-alt-green-tilleul-verveine fr-p-3v fr-mb-2w"
    >
      <p class="fr-grid-row fr-m-0">
        <span
          class="fr-icon-warning-line"
          aria-hidden="true"
        />
        {{ $t("No data structure found for this file.") }}
      </p>
    </div>
    <template v-if="hasColumnInfo">
      <div
        v-for="(column, index) in columns"
        :key="index"
        class="fr-col-12 fr-col-sm-6 fr-col-md-4 fr-col-lg-3"
      >
        <h5 class="fr-text--sm fr-text--bold fr-mt-0 fr-mb-1v">
          {{ column }}
        </h5>
        <code class="code">
          {{ columnsInfo[column].format }}
        </code>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Resource } from '../../types/resources'
import { getProfile } from '../../functions/tabularApi'
import PreviewLoader from './PreviewLoader.vue'

const props = defineProps<{ resource: Resource }>()

type ColumnInfo = {
  score: number
  format: string
  python_type: string
}

const columns = ref<Array<string>>([])
const columnsInfo = ref<Record<string, ColumnInfo>>({})
const loading = ref(true)
const hasError = ref(false)
const hasColumnInfo = ref(false)

onMounted(async () => {
  try {
    const { data } = await getProfile(props.resource.id) // Assurez-vous que cette fonction retourne bien les données attendues
    if ('profile' in data && data.profile) {
      columns.value = Object.keys(data.profile.columns)
      columnsInfo.value = data.profile.columns
      hasColumnInfo.value = true
      loading.value = false
    }
    else {
      hasError.value = true
      loading.value = false
    }
  }
  catch {
    hasError.value = true
    loading.value = false
  }
})
</script>
