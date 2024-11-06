<template>
  <div>
    <Breadcrumb>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/beta/admin"
        >
          {{ $t('Administration') }}
        </NuxtLinkLocale>
      </li>
      <li>
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ $t('Me') }}
        </a>
      </li>
    </Breadcrumb>
    <h1
      v-if="me"
      class="fr-h3 mb-0"
    >
      {{ me.first_name }}  {{ me.last_name }}
    </h1>
    <div class="fr-alert fr-alert--info">
      <h3 class="fr-alert__title">
        {{ $t('This is a WIP page') }}
      </h3>
      <p><a href="/admin/me/">{{ $t('You can edit your profil on the current admin.') }}</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
const me = useMaybeMe()
</script>
