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
      <template v-if="harvester">
        <li v-if="harvester.organization">
          <NuxtLinkLocale
            class="fr-breadcrumb__link"
            :to="`/beta/admin/organizations/${harvester.organization.id}/profile`"
          >
            {{ harvester.organization.name }}
          </NuxtLinkLocale>
        </li>
        <li v-if="harvester.organization">
          <NuxtLinkLocale
            class="fr-breadcrumb__link"
            :to="`/beta/admin/organizations/${harvester.organization.id}/harvesters`"
          >
            {{ t('Harvesters') }}
          </NuxtLinkLocale>
        </li>
        <template v-if="job">
          <li>
            <NuxtLinkLocale
              class="fr-breadcrumb__link"
              :to="getHarvesterAdminUrl(harvester)"
            >
              {{ harvester.name }}
            </NuxtLinkLocale>
          </li>
          <li>
            <a
              class="fr-breadcrumb__link"
              aria-current="page"
            >
              {{ job.id }}
            </a>
          </li>
        </template>
        <li v-else>
          <a
            class="fr-breadcrumb__link"
            aria-current="page"
          >
            {{ harvester.name }}
          </a>
        </li>
      </template>
    </Breadcrumb>

    <div v-if="harvester && !job">
      <div class="mb-5">
        <div class="flex items-center justify-between mb-3">
          <h1 class="fr-h3 !mb-0">
            {{ harvester.name }}
          </h1>
          <BrandedButton
            v-if="harvester.validation.state === 'accepted'"
            :icon="RiPlayLargeLine"
            size="xs"
            :loading
            @click="run"
          >
            {{ $t('Run') }}
          </BrandedButton>
        </div>

        <div class="text-sm text-mentionGrey space-y-1.5">
          <div class="space-x-1">
            <RiToolsLine class="inline size-3" />
            <span>{{ $t('Implementation:') }}</span>
            <span class="font-mono">{{ harvester.backend }}</span>
          </div>
          <div class="space-x-1">
            <RiLink class="inline size-3" />
            <span>{{ $t('URL:') }}</span>
            <span class="font-mono">{{ harvester.url }}</span>
          </div>
          <div class="space-x-1">
            <RiCalendarEventLine class="inline size-3" />
            <span>{{ $t('Schedule:') }}</span>
            <span class="font-mono">{{ harvester.schedule || 'N/A' }}</span>
          </div>
          <div
            v-if="harvester.validation.state !== 'accepted'"
            class="space-x-1"
          >
            <RiCheckboxCircleLine class="inline size-3" />
            <span>{{ $t('Status:') }}</span>
            <AdminBadge
              v-if="harvester.validation.state === 'pending'"
              type="secondary"
              size="xs"
            >
              {{ $t('Waiting validation') }}
            </AdminBadge>
            <AdminBadge
              v-if="harvester.validation.state === 'refused'"
              type="danger"
              size="xs"
            >
              {{ $t('Refused') }}
            </AdminBadge>
          </div>
        </div>

        <BannerAction
          v-if="harvester.validation.state === 'pending'"
          class="mt-3"
          type="primary"
          :title="$t('Your harvester is created, it\'s waiting the validation from the administration team.')"
        >
          {{ $t("Please notify us via the contact form below if you want this harvester validated. You'll be notify when approved (or refused)") }}

          <template #button>
            <BrandedButton
              :href="config.public.harvesterRequestValidationUrl"
              new-tab
            >
              {{ $t("Request validation") }}
            </BrandedButton>
          </template>
        </BannerAction>

        <BannerAction
          v-if="isGlobalAdmin && harvester.validation.state === 'pending'"
          class="mt-3"
          type="primary"
          :title="$t('Harvester validation')"
        >
          {{ $t("Please note that the data will be published once the harvester has been validated.") }}

          <template #button>
            <ModalWithButton
              :title="$t('Harvester validation')"
              size="lg"
            >
              <template #button="{ attrs, listeners }">
                <BrandedButton
                  v-bind="attrs"
                  v-on="listeners"
                >
                  {{ $t('Validate or refuse…') }}
                </BrandedButton>
              </template>

              <div>
                <InputGroup
                  v-model="comment"
                  type="textarea"
                  :label="$t('Comment')"
                />
              </div>
              <template #footer="{ close }">
                <div
                  class="w-full flex justify-end space-x-4"
                >
                  <BrandedButton
                    color="primary"
                    :loading
                    @click="validate(close, 'accepted')"
                  >
                    {{ $t('Validate') }}
                  </BrandedButton>
                  <BrandedButton
                    color="danger"
                    :loading
                    @click="validate(close, 'refused')"
                  >
                    {{ $t('Refuse') }}
                  </BrandedButton>
                </div>
              </template>
            </ModalWithButton>
          </template>
        </BannerAction>
      </div>

      <TabLinks
        class="mb-5"
        :links="[
          { href: getHarvesterAdminUrl(harvester), label: t('Jobs') },
          { href: `${getHarvesterAdminUrl(harvester)}/configuration`, label: t('Configuration') },
        ]"
      />
    </div>

    <NuxtPage :page-key="route => route.fullPath" />
  </div>
</template>

<script setup lang="ts">
import { RiCalendarEventLine, RiCheckboxCircleLine, RiExternalLinkLine, RiLink, RiPlayLargeLine, RiToolsLine } from '@remixicon/vue'
import BrandedButton from '~/components/BrandedButton/BrandedButton.vue'
import TabLinks from '~/components/TabLinks.vue'
import type { HarvesterJob, HarvesterSource } from '~/types/harvesters'

const config = useRuntimeConfig()
const { t } = useI18n()
const { $api } = useNuxtApp()
const { toast } = useToast()

const me = useMe()
const isGlobalAdmin = computed(() => isAdmin(me.value))

const route = useRoute()
const url = computed(() => `/api/1/harvest/source/${route.params.id}`)
const { data: harvester, refresh } = await useAPI<HarvesterSource>(url, { lazy: true })
const job = ref<HarvesterJob | null>(null)
watchEffect(async () => {
  if (!harvester.value) return
  if (!route.params.jobid) return

  job.value = await $api(`/api/1/harvest/job/${route.params.jobid}/`)
})

const loading = ref(false)
const run = async () => {
  loading.value = true

  try {
    await $api(`/api/1/harvest/source/${route.params.id}/run`, {
      method: 'POST',
    })
    toast.success(t('The run is scheduled'))
  }
  finally {
    loading.value = false
  }
}

const comment = ref('')
const validate = async (close: () => void, state: 'accepted' | 'refused') => {
  try {
    loading.value = true
    await $api(`/api/1/harvest/source/${route.params.id}/validate`, {
      method: 'POST',
      body: JSON.stringify({
        state,
        comment: comment.value,
      }),
    })

    close()

    await refresh()
  }
  finally {
    loading.value = false
  }
}
</script>
