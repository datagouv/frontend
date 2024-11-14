<template>
  <i18n-t
    keypath="Fields preceded by a star ({markup}) are required."
    tag="p"
    class="mt-0 mb-2 text-xs"
    scope="global"
  >
    <template #markup>
      <span class="text-primary">*</span>
    </template>
  </i18n-t>
</template>
