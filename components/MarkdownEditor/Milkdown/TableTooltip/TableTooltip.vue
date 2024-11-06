<template>
  <div class="hidden">
    <div
      ref="toolTipRef"
      class="flex flex-wrap absolute -mt-1"
    >
      <TooltipButton
        v-if="!isWholeTable && !isHeading && isRow"
        :icon="RiArrowUpLine"
        class="fr-mr-1v"
        :title="t('Add row before')"
        @click="() => {
          if (loading) return;

          getEditor()?.action((ctx) => {
            ctx.get(commandsCtx).call(addRowBeforeCommand.key);
          });
          tooltipProvider?.hide();
        }"
      />
      <TooltipButton
        v-if="!isWholeTable && isCol"
        :icon="RiArrowLeftLine"
        class="fr-mr-1v"
        :title="t('Add column before')"
        @click="() => {
          if (loading) return;

          getEditor()?.action((ctx) => {
            ctx.get(commandsCtx).call(addColBeforeCommand.key);
          });
          tooltipProvider?.hide();
        }"
      />
      <TooltipButton
        v-if="isWholeTable || (!isHeading && isAny)"
        :icon="RiDeleteBinLine"
        class="fr-mr-1v"
        :title="t('Delete selected cells')"
        @click="() => {
          if (loading) return;

          getEditor()?.action((ctx) => {
            ctx.get(commandsCtx).call(deleteSelectedCellsCommand.key);
          });
          tooltipProvider?.hide();
        }"
      />
      <TooltipButton
        v-if="!isWholeTable && isRow"
        :icon="RiArrowDownLine"
        class="fr-mr-1v"
        :title="t('Add row after')"
        @click="() => {
          if (loading) return;

          getEditor()?.action((ctx) => {
            ctx.get(commandsCtx).call(addRowAfterCommand.key);
          });
          tooltipProvider?.hide();
        }"
      />
      <template v-if="!isWholeTable && isCol">
        <TooltipButton
          :icon="RiArrowRightLine"
          class="fr-mr-1v"
          :title="t('Add column after')"
          @click="() => {
            if (loading) return;
            getEditor()?.action((ctx) => {
              ctx.get(commandsCtx).call(addColAfterCommand.key);
            });

            tooltipProvider?.hide();
          }"
        />
        <TooltipButton
          :icon="RiAlignLeft"
          class="fr-mr-1v"
          :title="t('Align left')"
          @click="() => {
            if (loading) return;
            getEditor()?.action((ctx) => {
              ctx.get(commandsCtx).call(setAlignCommand.key, 'left');
            });
          }"
        />
        <TooltipButton
          class="fr-mr-1v"
          :icon="RiAlignCenter"
          :title="t('Align center')"
          @click="() => {
            if (loading) return;
            getEditor()?.action((ctx) => {
              ctx.get(commandsCtx).call(setAlignCommand.key, 'center');
            });
          }"
        />
        <TooltipButton
          class="fr-mr-1v"
          :icon="RiAlignRight"
          :title="t('Align right')"
          @click="() => {
            if (loading) return;
            getEditor()?.action((ctx) => {
              ctx.get(commandsCtx).call(setAlignCommand.key, 'right');
            });
          }"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { commandsCtx } from '@milkdown/core'
import {
  addColAfterCommand,
  addColBeforeCommand,
  addRowAfterCommand,
  addRowBeforeCommand,
  deleteSelectedCellsCommand,
  setAlignCommand,
} from '@milkdown/preset-gfm'
import { CellSelection } from '@milkdown/prose/tables'
import { useInstance } from '@milkdown/vue'
import {
  usePluginViewContext,
} from '@prosemirror-adapter/vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiAlignCenter, RiAlignLeft, RiAlignRight, RiArrowDownLine, RiArrowLeftLine, RiArrowRightLine, RiArrowUpLine, RiDeleteBinLine } from '@remixicon/vue'
import { makeTooltipProvider } from '~/components/MarkdownEditor/Milkdown/Tooltip/useTooltipProvider'
import { tableTooltipCtx } from '~/components/MarkdownEditor/Milkdown/TableTooltip/tableTooltipCtx'
import TooltipButton from '~/components/MarkdownEditor/Milkdown/TableTooltip/TooltipButton.vue'

const { t } = useI18n()
const toolTipRef = ref<HTMLDivElement | null>(null)
const { view } = usePluginViewContext()

const [loading, getEditor] = useInstance()
const { tooltipProvider } = makeTooltipProvider(tableTooltipCtx.key, toolTipRef)
const isRow = computed(() =>
  view.value.state.selection instanceof CellSelection
  && view.value.state.selection.isRowSelection())
const isCol = computed(() =>
  view.value.state.selection instanceof CellSelection
  && view.value.state.selection.isColSelection())
const isWholeTable = computed(() => isRow.value && isCol.value)
const isAny = computed(() => isRow.value || isCol.value)
const isHeading = computed(() =>
  isRow.value
  && view.value.state.doc.nodeAt((view.value.state.selection as CellSelection).$headCell.pos)
    ?.type.name === 'table_header')
</script>
