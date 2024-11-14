<template>
  <HeadlessDialog
    :id="modalId"
    :aria-labelledby="showTitle ? modalTitleId : null"
    :aria-label="!showTitle ? title : null"
    class="border-none text-inherit z-[1750] p-0 m-0 flex flex-col items-stretch fixed top-0 right-0 bottom-0 left-0 w-full h-full motion-reduce:transition-none outline-none"
    :class="{
      'visible opacity-100 w-full h-full transition-[opacity,visibility] duration-300 motion-reduce:transition-none': opened,
      'bg-white': isFullscreen,
      'bg-black/[0.6] justify-center': !isFullscreen,
      'opacity-0 invisible': !opened,
    }"
    :open="opened"
    as="dialog"
    @close="emit('close')"
  >
    <HeadlessDialogPanel
      class="fr-container fr-container--fluid pointer-events-none"
      :class="{ 'fr-container-md': !isFullscreen }"
    >
      <div class="grid grid-cols-12 p-0 m-0 justify-center">
        <div
          class="col-span-12"
          :class="contentSize"
        >
          <div
            class="pointer-events-auto z-[2000] bg-white"
            :class="{ 'overflow-y-visible max-h-full': isFullscreen, 'overflow-y-auto drop-shadow max-h-[calc(100vh - 2rem)]': !isFullscreen }"
          >
            <div
              class="flex items-center pt-4 px-4 pb-2"
              :class="{ 'pl-0 pr-0': isFullscreen }"
            >
              <button
                class="fr-btn--close fr-btn"
                :title="$t('Close the modal window')"
                :aria-controls="modalId"
                type="button"
                @click="emit('close')"
              >
                {{ $t('Close') }}
              </button>
            </div>
            <div
              class="px-4 sm:px-8 mb-[3.5rem] sm:mb-[4rem] contrast-more:border-solid contrast-more:border-1"
              :class="{ 'pl-0 pr-0': isFullscreen }"
            >
              <HeadlessDialogTitle
                v-if="showTitle"
                :id="modalTitleId"
                class="mb-4 font-bold text-gray-950 text-xl md:text-2xl flex items-center space-x-2"
              >
                <slot name="iconTitle" />
                <span>{{ title }}</span>
              </HeadlessDialogTitle>
              <slot />
            </div>
            <div class="flex p-4 sm:px-8 -mt-10 sticky bottom-0 bg-white contrast-more:border-solid contrast-more:border-t-1 motion-reduce:transition-none">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </HeadlessDialogPanel>
  </HeadlessDialog>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** Modal id to set for an external button `arial-controls` */
  id?: string
  opened?: boolean
  /** Modale title, required for accessibility purpose */
  title: string
  /** Removes modal title and adds it as aria-label */
  showTitle?: boolean

  /** The modal size, can be fullscreen for special ones  */
  size?: 'sm' | 'md' | 'lg' | 'fullscreen'
}>(), {
  opened: false,
  showTitle: true,
  size: 'md',
})

const emit = defineEmits<{
  close: []
}>()

const randomId = useId()
const modalId = props.id ? props.id : `modal-${randomId}`
const modalTitleId = `modal-title-${randomId}`
const contentSize = getSize()
const isFullscreen = props.size === 'fullscreen'

function getSize() {
  switch (props.size) {
    case 'sm':
      return 'md:col-start-5 md:col-span-4'
    case 'md':
      return 'md:col-start-4 md:col-span-6 lg:col-start-5 lg:col-span-4'
    case 'lg':
      return 'md:col-start-3 md:col-span-8'
    case 'fullscreen':
      return ''
  }
}
</script>
