<template>
  <div class="bg-neutral-50 py-16">
    <div class="container">
      <p class="m-0 font-bold text-sm uppercase">
        {{ $t("Latest news:") }}
      </p>
      <p class="my-2 px-3 py-1 border border-solid rounded-lg border-neutral-200 inline-flex">
        ✨ Suivi des sorties Juillet 2024 : découvrez les jeux de données et réutilisations du mois
      </p>
    </div>
    <ContentDoc
      path="/"
      class="grid grid-cols-1 gap-16"
    />
  </div>
</template>
