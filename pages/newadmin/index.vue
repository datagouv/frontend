<template>
    <h1>Hello World!</h1>

    <ul>
        <li v-for="dataset in datasets">{{ dataset.title }}</li>
    </ul>

    <NuxtLink href="/fr/newadmin/test">Go to test</NuxtLink>
</template>
<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()

const { data } = await useFetch(`${runtimeConfig.public.apiBase}/api/1/datasets`)

const datasets = computed(() => (data.value as any).data)
</script>