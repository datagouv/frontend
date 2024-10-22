<template>
    <h1>Index</h1>

    <NuxtLink href="/fr/newadmin">Go to new admin home</NuxtLink>
</template>
<script setup lang="ts">
definePageMeta({ middleware: ['auth'] });
</script>