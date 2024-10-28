<template>
  <AdminTable :loading>
    <thead>
      <tr>
        <AdminTableTh
          @sort="(direction: SortDirection) => $emit('sort', 'title', direction)"
          :sorted="sorted('title')"
          scope="col"
        >
          {{ t("Discussion") }}
        </AdminTableTh>
        <AdminTableTh scope="col">
          {{ t("Number of comments") }}
        </AdminTableTh>
        <AdminTableTh scope="col">
          {{ t("Last comment") }}
        </AdminTableTh>
        <AdminTableTh
          @sort="(direction: SortDirection) => $emit('sort', 'closed', direction)"
          :sorted="sorted('closed')"
          scope="col"
        >
          {{ t("Closed at") }}
        </AdminTableTh>
        <AdminTableTh scope="col" class="w-1/4">
          {{ t("Link to the discussion") }}
        </AdminTableTh>
      </tr>
    </thead>
    <tbody>
      <tr v-for="discussion in discussions">
        <td>
          <p class="fr-text--bold">
            <TextClamp
              :text="discussion.title"
              :auto-resize="true"
              :max-lines="1"
            />
          </p>
          <p v-if="subjects[discussion.subject.id]">
            <a
              class="fr-link inline-flex"
              :href="getSubjectPage(subjects[discussion.subject.id])"
            >
              <Icon
                :name="getSubjectTypeIcon(discussion.subject.class)"
                class="self-center size-3"
                aria-hidden="true"
              />
              <TextClamp
                class="overflow-wrap-anywhere"
                :text="getSubjectTitle(subjects[discussion.subject.id])"
                :auto-resize="true"
                :max-lines="1"
              />
            </a>
          </p>
        </td>
        <td>
          {{  discussion.discussion.length  }}
        </td>
        <td>
          <div>
            <p>{{ formatDate(getLastComment(discussion).posted_on) }}</p>
            <p class="inline-flex items-center">
              {{ t('by ') }}
              <AvatarWithName class="fr-ml-1v" :user="getLastComment(discussion).posted_by" />
            </p>
          </div>
        </td>
        <td>
          <template v-if="discussion.closed">{{ formatDate(discussion.closed) }}</template></td>
        <td>
          <a
            v-if="subjects[discussion.subject.id]"
            class="fr-link inline-flex"
            :href="getDiscussionUrl(discussion.id, subjects[discussion.subject.id])"
            target="_blank"
          >
            <TextClamp
              :text="getDiscussionUrl(discussion.id, subjects[discussion.subject.id])"
              :auto-resize="true"
              :max-lines="1"
            />
          </a>
        </td>
      </tr>
    </tbody>
  </AdminTable>
</template>
<script setup lang="ts">
import { AvatarWithName, formatDate } from "@datagouv/components";
import { useI18n } from "vue-i18n";
import AdminTable from "../Table/AdminTable.vue";
import AdminTableTh from "../Table/AdminTableTh.vue";
import type { Comment, DiscussionSortedBy, DiscussionSubjectTypes, SortDirection, Thread } from '~/types/types';
import { getDiscussionUrl, getSubject, getSubjectTypeIcon, getSubjectTitle } from "~/utils/discussions"

const props = defineProps<{
  discussions: Array<Thread>;
  loading: boolean;
  sortDirection: SortDirection;
  sortedBy: DiscussionSortedBy;
}>();

defineEmits<{
  (event: 'sort', column: DiscussionSortedBy, direction: SortDirection): void;
}>();

const { t } = useI18n();
const { $api } = useNuxtApp();

const subjects = ref<Record<string, DiscussionSubjectTypes | null>>({});
const subjectsPromises = ref<Record<string, Promise<void>>>({});

watchEffect(async () => {
  for (const discussion of props.discussions) {
    if (discussion.subject.id in subjectsPromises.value) continue;

    subjectsPromises.value[discussion.subject.id] = getSubject($api, discussion.subject)
      .then((subject) => {
        subjects.value[discussion.subject.id] = subject // Working because there is no conflicts between IDs from different types
      })
  }

  await Promise.all(Object.values(subjectsPromises.value));
})

function sorted(column: DiscussionSortedBy) {
  if(props.sortedBy === column) {
    return props.sortDirection;
  }
  return null;
}

function getLastComment(discussion: Thread): Comment {
  return discussion.discussion.slice(-1)[0];
}
</script>
