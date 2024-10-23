<template>
  <Icon
    name="ri:loader-5-line"
    aria-hidden="true"
    animation="spin"
    :scale
    fill="var(--blue-cumulus-sun-368-moon-732)"
    />
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  scale?: number;
}>(), {
  scale: 4
});
</script>
