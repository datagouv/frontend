<template>
  <div>
    <BannerSticky
      v-for="type in ['info', 'error', 'warning', 'success']"
      :key="type"
      :type
      class="mb-4"
    >
      Ces ressources sont publiées par la communauté et ne sont pas sous la responsabilité du producteur des données.
    </BannerSticky>
  </div>
</template>
