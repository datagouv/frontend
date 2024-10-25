<template>
  <div class="editor__container">
    <div
      class="fr-mx-auto fr-grid-row fr-pb-1v"
      role="menubar"
    >
      <div
        role="group"
        class="fr-pr-1w"
      >
        <EditorButton
          icon="fr-icon-arrow-go-back-line"
          :title="t('Undo')"
          @click="() => call(undoCommand.key)"
        />
        <EditorButton
          icon="fr-icon-arrow-go-forward-line"
          :title="t('Redo')"
          @click="() => call(redoCommand.key)"
        />
      </div>
      <div
        role="separator"
        class="w-1px bg-grey-125 fr-my-1v"
      />
      <div
        role="group"
        class="fr-pr-1w"
      >
        <EditorButton
          icon="fr-icon-bold"
          :title="t('Bold')"
          @click="() => call(toggleStrongCommand.key)"
        />
        <EditorButton
          icon="fr-icon-italic"
          :title="t('Italic')"
          @click="() => call(toggleEmphasisCommand.key)"
        />
        <EditorButton
          icon="fr-icon-h-1"
          :title="t('Title')"
          @click="() => call(wrapInHeadingCommand.key, 3)"
        />
        <EditorButton
          icon="fr-icon-h-2"
          :title="t('Subtitle')"
          @click="() => call(wrapInHeadingCommand.key, 4)"
        />
      </div>
      <div
        role="separator"
        class="w-1px bg-grey-125 fr-my-1v"
      />
      <div
        role="group"
        class="fr-px-1w"
      >
        <EditorButton
          icon="fr-icon-table-2"
          :title="t('Table')"
          @click="() => call(insertTableCommand.key)"
        />
        <EditorButton
          icon="fr-icon-link"
          :title="t('Link')"
          @click="() => call(insertLinkCommand.key)"
        />
        <ImageModalButton
          @send="(data: ImageModalForm) => call(insertImageCommand.key, data)"
        />
      </div>
      <div
        role="separator"
        class="w-1px bg-grey-125 fr-my-1v"
      />
      <div
        role="group"
        class="fr-pl-1w"
      >
        <EditorButton
          icon="fr-icon-list-unordered"
          :title="t('List unordered')"
          @click="() => call(wrapInBulletListCommand.key)"
        />
        <EditorButton
          icon="fr-icon-list-ordered"
          :title="t('List ordered')"
          @click="() => call(wrapInOrderedListCommand.key)"
        />
        <EditorButton
          icon="fr-icon-code-s-slash-line"
          :title="t('Code block')"
          @click="() => call(createCodeBlockCommand.key)"
        />
        <EditorButton
          icon="fr-icon-quote-line"
          :title="t('Quote')"
          @click="() => call(wrapInBlockquoteCommand.key)"
        />
      </div>
    </div>
    <div class="fr-p-1v">
      <Milkdown />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CmdKey } from '@milkdown/core'
import { Editor, rootCtx, defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
import type { Ctx } from '@milkdown/ctx'
import { history, redoCommand, undoCommand } from '@milkdown/plugin-history'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import {
  commonmark,
  createCodeBlockCommand,
  headingAttr,
  insertImageCommand,
  paragraphAttr,
  toggleEmphasisCommand,
  toggleStrongCommand,
  wrapInBlockquoteCommand,
  wrapInBulletListCommand,
  wrapInHeadingCommand,
  wrapInOrderedListCommand,
} from '@milkdown/preset-commonmark'
import {
  insertTableCommand,
  gfm,
  columnResizingPlugin,
} from '@milkdown/preset-gfm'
import { callCommand } from '@milkdown/utils'
import { Milkdown, useEditor } from '@milkdown/vue'
import { usePluginViewFactory, useWidgetViewFactory } from '@prosemirror-adapter/vue'
import { useDebounceFn } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import type { ImageModalForm } from '~/components/MarkdownEditor/ImageModal/ImageModal.vue'
import ImageModalButton from '~/components/MarkdownEditor/ImageModal/ImageModalButton.vue'
import { dsfrColumnResizingPlugin } from '~/components/MarkdownEditor/Milkdown/dsfrColumnResizingPlugin'
import { tableSelectorPlugin } from '~/components/MarkdownEditor/Milkdown/TableSelector/tableSelectorPlugin'
import { insertLinkCommand, linkEditPlugins } from '~/components/MarkdownEditor/Milkdown/LinkEdit'
import { configureEditTooltip } from '~/components/MarkdownEditor/Milkdown/LinkEdit/configureEditTooltip'
import { linkPreviewPlugins } from '~/components/MarkdownEditor/Milkdown/LinkPreview'
import { configurePreviewTooltip } from '~/components/MarkdownEditor/Milkdown/LinkPreview/configurePreviewTooltip'
import { useLinkPreview } from '~/components/MarkdownEditor/Milkdown/LinkPreview/useLinkPreview'
import { tableTooltip, tableTooltipCtx } from '~/components/MarkdownEditor/Milkdown/TableTooltip/tableTooltipCtx'
import TableTooltip from '~/components/MarkdownEditor/Milkdown/TableTooltip/TableTooltip.vue'
import EditorButton from '~/components/MarkdownEditor/EditorButton.vue'
import type { MarkdownEditorProps } from '~/components/MarkdownEditor/types'

import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-tables/style/tables.css'

const props = withDefaults(defineProps<MarkdownEditorProps>(), {
  disabled: false,
  value: '',
})
const emit = defineEmits<{
  (event: 'change', value: string): void
  (event: 'editorMounted'): void
}>()

const onChange = useDebounceFn((markdown: string) => emit('change', markdown), 300)

const { t } = useI18n()

const pluginViewFactory = usePluginViewFactory()
const widgetViewFactory = useWidgetViewFactory()

const { updateLink } = useLinkPreview()

const columnResizingPluginIndex = gfm.findIndex(plugin => plugin === columnResizingPlugin)
gfm[columnResizingPluginIndex] = dsfrColumnResizingPlugin

const gfmPlugins = [
  gfm,
  tableTooltip,
  tableTooltipCtx,
  (ctx: Ctx) => async () => {
    ctx.set(tableTooltip.key, {
      view: pluginViewFactory({
        component: TableTooltip,
      }),
    })
  },
  tableSelectorPlugin(widgetViewFactory),
].flat()

const editor = useEditor(root =>
  Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
      configureEditTooltip(ctx)
      configurePreviewTooltip(ctx, updateLink)
      ctx.set(defaultValueCtx, props.value)
      // Add attributes to nodes and marks
      ctx.set(headingAttr.key, (node) => {
        const level = node.attrs.level
        if (level === 1) return { class: 'fr-h1' }
        if (level === 2) return { class: 'fr-h2' }
        if (level === 3) return { class: 'fr-h3' }
        if (level === 4) return { class: 'fr-h4' }
        if (level === 5) return { class: 'fr-h5' }
        if (level === 6) return { class: 'fr-h6' }
        return {}
      })
      ctx.update(editorViewOptionsCtx, (prev) => {
        const prevAttr = prev.attributes

        return {
          ...prev,
          attributes: (state) => {
            const attrs = typeof prevAttr === 'function' ? prevAttr(state) : (prevAttr ?? {})
            attrs.id = props.id
            attrs['data-testid'] = 'markdown-editor'
            if (props.ariaLabelledBy) {
              attrs['aria-labelledby'] = props.ariaLabelledBy
            }
            else if (props.ariaLabel) {
              attrs.ariaLabel = props.ariaLabel
            }
            return {
              ...attrs,
            }
          },
          editable: () => !props.disabled,
        }
      })

      ctx.set(paragraphAttr.key, () => ({ class: 'text-lg' }))
      ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, _prevMarkdown) => onChange(markdown))
      ctx.get(listenerCtx).mounted((_ctx) => {
        emit('editorMounted')
      })
    })
    .use(commonmark)
    .use(gfmPlugins)
    .use(history)
    .use(linkEditPlugins)
    .use(linkPreviewPlugins)
    .use(listener),
)

function call<T>(command: CmdKey<T>, payload?: T) {
  return editor.get()?.action(callCommand(command, payload))
}
</script>
