<template>
  <div class="fr-p-3w bg-white">
    <RequiredExplanation />
    <fieldset
      class="fr-fieldset min-width-0"
      aria-labelledby="description-legend"
    >
      <legend
        id="description-legend"
        class="fr-fieldset__legend"
      >
        <h2 class="subtitle subtitle--uppercase !mb-3">
          {{ $t("Description") }}
        </h2>
      </legend>
      <div class="fr-fieldset__element">
        <InputGroup
          v-model="form.name"
          :label="$t('Post title')"
          :required="true"
          :has-error="!!getFirstError('name')"
          :has-warning="!!getFirstWarning('name')"
          :error-text="getFirstError('name')"
          @blur="touch('name')"
        />
      </div>
      <div class="fr-fieldset__element">
        <InputGroup
          v-model="form.headline"
          :label="$t('Headline')"
          :has-error="!!getFirstError('headline')"
          :has-warning="!!getFirstWarning('headline')"
          :error-text="getFirstError('headline')"
          required
          @blur="touch('headline')"
        />
      </div>
      <div class="fr-fieldset__element">
        <RadioButtons
          v-model="form.body_type"
          :label="t('Content type')"
          class="!mb-0"
          :options="[
            { value: 'html', label: t('HTML') },
            { value: 'markdown', label: t('Markdown') },
          ]"
        />
      </div>
      <div class="fr-fieldset__element">
        <TagsSelect
          v-model="form.tags"
          :error-text="getFirstError('tags')"
          :warning-text="getFirstWarning('tags')"
        />
      </div>
      <div class="fr-fieldset__element">
        <UploadGroup
          :label="$t('Cover')"
          type="drop"
          accept="jpg,jpeg,png"
          :multiple="true"
          :hint-text="$t('Max size: 4 Mb. Accepted formats: JPEG, JPG and PNG.')"
          show-label
          required
          @change="setFiles"
        />
        <div
          v-if="imagePreview"
          class="text-align-center"
        >
          <NuxtImg
            :src="imagePreview"
            class="border mx-auto max-h-40 aspect-square"
            loading="lazy"
            alt=""
          />
        </div>
      </div>
    </fieldset>
    <div
      class="fr-grid-row"
      :class="{ 'fr-grid-row--right': type === 'update', 'justify-between': type === 'create' }"
    >
      <BrandedButton
        v-if="type === 'create'"
        color="secondary"
        @click="$emit('previous')"
      >
        {{ $t('Previous') }}
      </BrandedButton>
      <BrandedButton
        color="primary"
        @click="submit"
      >
        {{ submitLabel }}
      </BrandedButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post, PostForm } from '~/types/posts'
import { toForm } from '~/utils/posts'

const props = defineProps<{
  submitLabel: string
  post: Post
  type: 'create' | 'update'
}>()
const emit = defineEmits<{
  previous: []
  submit: [PostForm]
}>()

const { t } = useI18n()

const { form, touch, getFirstError, getFirstWarning, validate } = useForm(toForm(props.post), {
  name: [required()],
  headline: [required()],
  image: [required()],
}, {
})

const imagePreview = computed(() => {
  if (!form.value.image) return null
  if (typeof form.value.image === 'string') return form.value.image
  return URL.createObjectURL(form.value.image)
})

function submit() {
  if (validate()) {
    emit('submit', form.value)
  }
};
const setFiles = (files: Array<File>) => {
  form.value.image = files[0]
}
</script>
