<template>
  <div
    :class="{ 'order-md-2': onRight }"
    class="fr-mb-2w fr-mb-md-0"
  >
    <nav
      class="fr-sidemenu"
      :class="{ 'fr-sidemenu--right': onRight, 'fr-sidemenu--no-border': !showBorder, 'fr-sidemenu--sticky': fixed }"
      :aria-labelledby="titleId"
    >
      <HeadlessDisclosure
        as="div"
        class="fr-sidemenu__inner"
        :default-open="true"
      >
        <HeadlessDisclosureButton
          class="fr-sidemenu__btn"
          hidden
        >
          {{ buttonText }}
        </HeadlessDisclosureButton>
        <HeadlessDisclosurePanel>
          <div
            :id="titleId"
            class="fr-sidemenu__title fr-text--sm"
          >
            <slot name="title" />
          </div>
          <slot />
        </HeadlessDisclosurePanel>
      </HeadlessDisclosure>
    </nav>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<
  {
    fixed?: boolean
    showBorder?: boolean
    onRight?: boolean
    buttonText: string
  }>(), {
  fixed: false,
  showBorder: true,
  onRight: false,
})

const titleId = useId()
</script>
