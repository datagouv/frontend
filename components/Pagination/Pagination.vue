<template>
  <nav
    v-if="totalResults > pageSize"
    role="navigation"
    class="fr-pagination fr-pagination--centered"
    :aria-label="t('Pagination')"
  >
    <ul class="fr-pagination__list">
      <li>
        <a
          :href="getHref(1)"
          class="fr-pagination__link fr-pagination__link--first"
          data-testid="first-page"
          @click.prevent="onClick(1)"
        >
          {{ t('First page') }}
        </a>
      </li>
      <li>
        <a
          :href="getHref(page - 1)"
          class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
          data-testid="previous-page"
          @click.prevent="previousPage"
        >
          {{ t('Previous page') }}
        </a>
      </li>
      <li>
        <a
          :aria-current="page === 1 ? 'page' : undefined"
          :href="getHref(1)"
          class="fr-pagination__link"
          :class="{ 'fr-hidden fr-unhidden-sm': page > 1 }"
          :title="t('Page {nb}', { nb: 1 })"
          :data-testid="1"
          @click.prevent="onClick(1)"
        >
          1
        </a>
      </li>
      <li
        v-for="(index, arrayIndex) in visiblePages"
        :key="arrayIndex"
      >
        <a
          v-if="index"
          class="fr-pagination__link"
          :class="{ 'fr-hidden fr-unhidden-lg': index < page - 1 || index > page + 1 }"
          :aria-current="page === index ? 'page' : undefined"
          :href="getHref(index)"
          :title="t('Page {nb}', { nb: index })"
          :data-testid="index"
          @click.prevent="onClick(index)"
        >
          {{ index }}
        </a>
        <a
          v-else
          class="fr-pagination__link fr-hidden fr-unhidden-lg"
        >
          …
        </a>
      </li>
      <li>
        <a
          class="fr-pagination__link"
          :aria-current="page === pageCount ? 'page' : undefined"
          :href="getHref(pageCount)"
          :title="t('Page {nb}', { nb: pageCount })"
          :data-testid="pageCount"
          @click.prevent="onClick(pageCount)"
        >
          {{ pageCount }}
        </a>
      </li>
      <li>
        <a
          class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
          :href="getHref(page + 1)"
          data-testid="next-page"
          @click.prevent="nextPage"
        >
          {{ t('Next page') }}
        </a>
      </li>
      <li>
        <a
          class="fr-pagination__link fr-pagination__link--last"
          :href="getHref(pageCount)"
          data-testid="last-page"
          @click.prevent="onClick(pageCount)"
        >
          {{ t('Last page') }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

type Props = {
  /**
   * The current page.
   */
  page?: number
  /**
   * The page size.
   */
  pageSize?: number
  /**
   * Customize the links used
   */
  link?: (page: number) => string
  /**
   * The number of items in the collection. It's used to calculated the number of pages.
   */
  totalResults: number
}

const emit = defineEmits<{
  (event: 'change', page: number): void
}>()

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  pageSize: 20,
})

const { t } = useI18n()
const pageCount = computed(() => Math.ceil(props.totalResults / props.pageSize))
const visiblePages = computed(() => getVisiblePages(props.page, pageCount.value))

function onClick(index: number) {
  if (index !== props.page) {
    return emit('change', index)
  }
}

function nextPage() {
  const index = props.page + 1
  if (index <= pageCount.value) {
    return emit('change', index)
  }
}

function previousPage() {
  const index = props.page - 1
  if (index > 0) {
    return emit('change', index)
  }
}

function getHref(forPage: number) {
  if (forPage < 1 || forPage > pageCount.value) {
    return undefined
  }
  return props.page === forPage ? undefined : (props.link ? props.link(forPage) : '#')
}
</script>
