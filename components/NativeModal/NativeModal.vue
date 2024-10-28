<template>
    <slot name="button" :close :attrs="{
        'data-fr-opened': false,
        'aria-controls': id,
    }" />
    <ClientOnly>
        <Teleport to="body">
          <dialog
            :aria-labelledby="modalTitleId"
            role="dialog"
            :id="id"
            class="fr-modal"
          >
            <div class="fr-container fr-container--fluid fr-container-md">
              <div class="fr-grid-row fr-grid-row--center">
                <div class="fr-col-12 fr-col-md-8">
                  <div class="fr-modal__body">
                    <div class="fr-modal__header">
                      <button
                        class="fr-btn--close fr-btn"
                        :title="t('Close the modal dialog')"
                        :aria-controls="id"
                      >
                        {{ t("Close") }}
                      </button>
                    </div>
                    <div class="fr-modal__content">
                      <h1
                        :id="modalTitleId"
                        class="fr-modal__title fr-mb-2w"
                      >
                        <slot name="title" :close />
                      </h1>
                      <slot :close />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </dialog>
        </Teleport>
    </ClientOnly>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  
  const { t } = useI18n();
  const id = useId() as string;
  
  const modalTitleId = computed(() => `fr-modal-title-user-${id}`);
  
  const close = () => {
    const modal = document.getElementById(id);
    globalThis.dsfr(modal).modal.conceal();
  }
  </script>
  