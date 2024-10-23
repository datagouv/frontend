<template>
  <nav
    rol="navigation"
    :aria-label="$t(`You're here:`)"
    class="fr-breadcrumb fr-mb-5v"
  >
    <ol class="fr-breadcrumb__list">
      <slot />
    </ol>
  </nav>
</template>
