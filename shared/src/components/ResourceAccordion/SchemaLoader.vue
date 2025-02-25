<template>
  <ContentLoader
    :width="454"
    :height="40"
    :speed="2"
    primary-color="#f3f3f3"
    secondary-color="#ecebeb"
  >
    <rect
      x="0"
      y="0"
      rx="20"
      ry="20"
      width="196"
      height="40"
    />
    <rect
      x="212"
      y="0"
      rx="20"
      ry="20"
      width="242"
      height="40"
    />
  </ContentLoader>
</template>

<script setup lang="ts">
import { ContentLoader } from 'vue-content-loader'
</script>
