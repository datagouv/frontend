<template>
    <h1>Hello World!</h1>

    <ul>
        <li v-for="dataset in datasets.data">{{ dataset.title }}</li>
    </ul>

    <NuxtLink href="/fr/newadmin/test">Go to test</NuxtLink>
</template>
<script setup lang="ts">
import type { Dataset } from '@datagouv/components/ts';
import { type PaginatedArray } from '~/utils/api';

definePageMeta({ middleware: ['auth'] });

const { data: datasets } = await useAPI<PaginatedArray<Dataset>>('/api/1/datasets')
</script>