<template>
  <Teleport to="body">
    <dialog
      v-bind="$attrs"
      :id="id"
      ref="modalRef"
      :aria-labelledby="imageModalTitleId"
      role="dialog"
      class="fr-modal"
    >
      <div class="fr-container fr-container--fluid fr-container-md">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
            <div class="fr-modal__body">
              <div class="fr-modal__header">
                <button
                  class="fr-btn--close fr-btn"
                  aria-controls="fr-modal-2"
                  @click="close"
                >
                  {{ t('Close') }}
                </button>
              </div>
              <div class="fr-modal__content">
                <h1
                  :id="imageModalTitleId"
                  class="fr-mb-2w fr-modal__title"
                >
                  <span class="fr-icon-image-line fr-icon--lg" />
                  {{ t('Add an image') }}
                </h1>
                <p>{{ t("Paste a link of your image to add it to your description. It is recommended to also provide a textual alternative for an informative image and a title.") }}</p>
                <RequiredExplanation />
                <InputGroup
                  v-model="form.src"
                  :label="t('Image link')"
                  :placeholder="t('Paste your link...')"
                  :required="true"
                  type="url"
                  :has-error="fieldHasError('src')"
                  :error-text="getErrorText('src')"
                />
                <details>
                  <summary data-testid="summary">
                    {{ t("Customize accessibility options") }}
                  </summary>
                  <div class="fr-my-1w">
                    <InputGroup
                      v-model="form.alt"
                      :label="t('Image alternative text')"
                    />
                    <InputGroup
                      v-model="form.title"
                      :label="t('Image title')"
                    />
                  </div>
                </details>
              </div>
              <div class="fr-modal__footer">
                <div class="fr-btns-group fr-btns-group--right">
                  <button
                    class="fr-btn"
                    data-testid="add-image-button"
                    @click="send"
                  >
                    {{ t('Add image') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<script lang="ts">
</script>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import InputGroup from '~/components/InputGroup/InputGroup.vue'
import RequiredExplanation from '~/components/RequiredExplanation/RequiredExplanation.vue'

export type ImageModalProps = {
  id: string
}
export type ImageModalForm = {
  src: string
  title: string
  alt: string
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<ImageModalProps>()

const emit = defineEmits<{
  (event: 'sendModal', form: ImageModalForm): void
}>()

const nuxtApp = useNuxtApp()

const required = createRequired(nuxtApp.$i18n)

const { t } = useI18n()
const imageModalTitleId = computed(() => props.id + '-title')
const modalRef = ref<HTMLDialogElement | null>()

const initialState = {
  src: '',
  title: '',
  alt: '',
}

const form = reactive<ImageModalForm>({ ...initialState })

const requiredRules = {
  src: { required },
}

const { getErrorText, getFunctionalState, hasError, reset, validateRequiredRules, v$ } = useFunctionalState(form, requiredRules, requiredRules)

const state = computed(() => {
  return {
    src: getFunctionalState(v$.value.src.$dirty, v$.value.src.$error, false),
  }
})

function fieldHasError(field: string) {
  return hasError(state, field)
}

function close() {
  // TODO: Fix without dsfr js
  globalThis.dsfr(modalRef.value).modal.conceal()
  form.src = initialState.src
  form.title = initialState.title
  form.alt = initialState.alt
  reset()
};

function send() {
  validateRequiredRules().then((valid) => {
    if (valid) {
      emit('sendModal', { ...form })
      close()
    }
  })
};
</script>
