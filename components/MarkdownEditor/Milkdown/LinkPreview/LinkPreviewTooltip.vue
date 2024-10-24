<template>
  <EditorTooltip
    ref="toolTipRef"
    :class="{ 'fr-hidden': link.length === 0 }"
  >
    <span
      aria-hidden="true"
      class="fr-icon-link fr-mr-1w"
    />
    <div class="text-overflow-ellipsis">
      <a
        class="fr-link"
        :href="link"
      >
        {{ link }}
      </a>
    </div>
    <button
      class="fr-btn fr-btn--secondary fr-btn--sm fr-icon-pencil-line fr-mx-1w"
      @click="editLink"
    >
      {{ t("Edit link") }}
    </button>
    <button
      class="fr-btn fr-btn--tertiary fr-btn--sm fr-icon-link-unlink"
      :title="t('Remove link')"
      @click="deleteLink"
    >
      {{ t("Remove link") }}
    </button>
  </EditorTooltip>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePluginViewContext } from '@prosemirror-adapter/vue'
import { useInstance } from '@milkdown/vue'
import { TextSelection } from '@milkdown/prose/state'
import { linkTooltipState } from '~/components/MarkdownEditor/Milkdown/LinkEdit/linkEditTooltipCtx'
import { removeLink } from '~/components/MarkdownEditor/ProseMirror/handleLink'
import { makeTooltipProvider } from '~/components/MarkdownEditor/Milkdown/Tooltip/useTooltipProvider'
import EditorTooltip from '~/components/MarkdownEditor/Milkdown/Tooltip/EditorTooltip.vue'
import { insertLink } from '~/components/MarkdownEditor/Milkdown/LinkEdit/insertLink'
import { useLinkPreview } from '~/components/MarkdownEditor/Milkdown/LinkPreview/useLinkPreview'
import { linkPreviewTooltipCtx } from '~/components/MarkdownEditor/Milkdown/LinkPreview/linkPreviewTooltipCtx'

const { t } = useI18n()
const toolTipRef = ref<InstanceType<typeof EditorTooltip> | null>(null)
const { tooltipProvider } = makeTooltipProvider(linkPreviewTooltipCtx.key, toolTipRef)
const { view } = usePluginViewContext()
const [_loading, getEditor] = useInstance()

const { link } = useLinkPreview()

function editLink() {
  const editor = toRaw(getEditor())
  if (!editor) return
  const { from, to } = editor.ctx.get(linkTooltipState.key)
  tooltipProvider.value?.hide()
  view.value.dispatch(view.value.state.tr.setSelection(TextSelection.create(view.value.state.doc, from, to)))
  insertLink(editor.ctx)
}

function deleteLink() {
  const editor = toRaw(getEditor())
  if (!editor) return
  const { from, to, mark } = editor.ctx.get(linkTooltipState.key)
  if (mark) {
    removeLink(view.value, from, to, mark)
  }
  tooltipProvider.value?.hide()
}
</script>
