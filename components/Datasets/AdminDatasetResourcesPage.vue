<template>
  <div class="bg-white fr-p-3w">
    <div class="flex justify-between items-center">
      <h2
        v-if="resourcesPage"
        class="subtitle subtitle--uppercase fr-m-0"
      >
        {{ t('{n} files', resourcesPage.total) }}
      </h2>
      <UploadResourceModal
        :extensions
        @new-files="addFiles"
      />
    </div>

    <!-- :key is here to force re-render when length change and then re-call onMounted -->
    <FileEditModal
      v-if="resourceForms.length"
      :key="resourceForms.length"
      v-model="resourceForms[0]"
      open-on-mounted
      @submit="saveFirstNewFile"
      @cancel="removeFirstNewFile"
    />

    <LoadingBlock :status>
      <AdminTable v-if="resourcesPage && resourcesPage.data.length">
        <thead>
          <tr>
            <AdminTableTh
              scope="col"
            >
              {{ t('File name') }}
            </AdminTableTh>
            <AdminTableTh scope="col">
              {{ t("Status") }}
            </AdminTableTh>
            <AdminTableTh scope="col">
              {{ t("Type") }}
            </AdminTableTh>
            <AdminTableTh scope="col">
              {{ t("Format") }}
            </AdminTableTh>
            <AdminTableTh
              scope="col"
            >
              {{ t('Created at') }}
            </AdminTableTh>
            <AdminTableTh
              scope="col"
            >
              {{ t('Updated at') }}
            </AdminTableTh>
            <AdminTableTh
              scope="col"
            >
              {{ t("Action") }}
            </AdminTableTh>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="resource, index in resourcesPage.data"
            :key="resource.id"
          >
            <td>
              <TextClamp
                :text="resource.title"
                :auto-resize="true"
                :max-lines="2"
              />
            </td>
            <td>
              <AdminBadge
                size="xs"
                :type="getStatus(resource).type"
              >
                {{ getStatus(resource).label }}
              </AdminBadge>
            </td>
            <td>
              {{ resource.type }}
            </td>
            <td>
              {{ resource.format }}
            </td>
            <td>
              {{ formatDate(resource.created_at) }}
            </td>
            <td>
              {{ formatDate(resource.last_modified) }}
            </td>
            <td>
              <FileEditModal
                :model-value="resourceToForm(resource, schemas || [])"
                button-classes="fr-btn fr-btn--sm fr-btn--secondary-grey-500 fr-btn--tertiary-no-outline fr-icon-pencil-line"
                @update:model-value="() => {}"
                @submit="(file, newFile) => saveFile(index, resource, file, newFile)"
              />
            </td>
          </tr>
        </tbody>
      </AdminTable>
      <Pagination
        v-if="resourcesPage && resourcesPage.total > pageSize"
        :page="page"
        :page-size="pageSize"
        :total-results="resourcesPage.total"
        @change="(changedPage: number) => page = changedPage"
      />
    </LoadingBlock>
  </div>
</template>

<script setup lang="ts">
import { formatDate, Pagination, type DatasetV2, type Resource, type SchemaResponseData } from '@datagouv/components'
import { useI18n } from 'vue-i18n'
import AdminTable from '../AdminTable/Table/AdminTable.vue'
import AdminTableTh from '../AdminTable/Table/AdminTableTh.vue'
import UploadResourceModal from './UploadResourceModal.vue'
import FileEditModal from './FileEditModal.vue'
import type { AdminBadgeType, PaginatedArray, ResourceForm } from '~/types/types'

const route = useRoute()
const { toast } = useToast()
const { $api } = useNuxtApp()

const { data: schemas } = await useAPI<SchemaResponseData>('/api/1/datasets/schemas/')
const { data: extensions } = await useAPI<Array<string>>('/api/1/datasets/extensions/')

const datasetUrl = computed(() => `/api/2/datasets/${route.params.id}`)
const { data: dataset, status } = await useAPI<DatasetV2>(datasetUrl, { lazy: true })
const resourcesPage = ref<PaginatedArray<Resource> | null>(null)
const page = ref(1)
const pageSize = ref(10)

const resourcesUrl = computed(() => {
  if (!dataset.value) return

  const url = new URL(dataset.value.resources.href)
  url.searchParams.set('page_size', pageSize.value.toString())
  url.searchParams.set('page', page.value.toString())
  return url.toString()
})

const refreshResources = async () => {
  if (!resourcesUrl.value) return
  resourcesPage.value = await $api<PaginatedArray<Resource>>(resourcesUrl.value)
}
watchEffect(async () => await refreshResources())

const { t } = useI18n()

const resourceForms = ref<Array<ResourceForm>>([])

const addFiles = (files: Array<ResourceForm>) => {
  resourceForms.value = files
}
const removeFirstNewFile = () => {
  resourceForms.value = [...resourceForms.value.slice(1)]
}
const saveFirstNewFile = async () => {
  await saveResourceForm(dataset.value, resourceForms.value[0])
  removeFirstNewFile()

  page.value = 1
  refreshResources()
}
const saveFile = async (index: number, resource: Resource, resourceForm: ResourceForm, newFile: File | null) => {
  if (newFile) {
    if (resourceForm.filetype !== 'file') throw new Error('Cannot update file of not local file')

    resourceForm.file = {
      raw: newFile,
      state: { status: 'waiting' },
    }
  }
  const updated = await saveResourceForm(dataset.value, resourceForm)
  if (resourcesPage.value) {
    resourcesPage.value.data[index] = updated
  }
  toast.success(t('Resource updated!'))
}

function getStatus(resource: Resource): { label: string, type: AdminBadgeType } {
  if (resource.extras['check:available'] === true) {
    return {
      label: t('Available'),
      type: 'primary',
    }
  }

  if (resource.extras['check:available'] === false) {
    return {
      label: t('Unavailable'),
      type: 'danger',
    }
  }

  return {
    label: t('Unknown'),
    type: 'warning',
  }
}
</script>
