<template>
  <div class="flex items-start md:flex-wrap">
    <PaddedContainer class="mb-6">
      <ActionCard
        actions-alignment="center"
        :title="t('Join an Organization')"
        :content="t(`An organization is an entity in which many users can collaborate. The published datasets on the organization's name can be edited by its members.`)"
        icon="/illustrations/organization.svg"
        :stretch-height="true"
      >
        <template #actions>
          <div class="fr-col-12 flex items-start relative">
            <div class="fr-col-12 fr-col-lg-8">
              <OrganizationSearch />
            </div>
            <div class="fr-col-12 fr-col-lg-4 ml-auto">
              <div class="flex items-center md:flex-wrap">
                <p class="flex-1 text-center ml-3v m-0">
                  {{ t('or') }}
                </p>
                <div class="flex-1 ml-3v m-0">
                  <button
                    class="fr-btn"
                    @click="$emit('start')"
                  >
                    {{ t("Create an organization") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </ActionCard>
    </PaddedContainer>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineEmits<{
  (event: 'start'): void
}>()
</script>
