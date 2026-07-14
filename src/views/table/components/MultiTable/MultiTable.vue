<!-- MultiTable.vue -->
<template>
  <div
    class="multi-table-layout"
    :class="{
      'multi-table-layout__small': props.size === 'small',
      'multi-table-layout__large': props.size === 'large'
    }"
    :style="styleMethods.tableConfigStyle.value"
  >
    <!-- 表题头 -->
    <div v-if="$slots.header" class="multi-table-header">
      <slot name="header"></slot>
    </div>

    <div ref="wrapperRef" class="multi-table-wrapper">
      <div class="multi-table-container" ref="containerRef" @scroll="eventMethods.onScroll">
        <table class="multi-table" :style="{ minWidth: columnMethods.totalWidth + 'px' }" cellpadding="0" cellspacing="0">

          <!-- 表头 -->
          <TableHeader
            v-bind="headerProps"
            v-on="headerEvents"
          >
            <template #[key]="slotProps" v-for="(_, key) in $slots" :key="key">
              <slot :name="key" v-bind="slotProps"></slot>
            </template>
          </TableHeader>

          <!-- 数据行 -->
          <tbody class="multi-table__body">
            <TableRow
              v-for="expandedRow in expandMethods.expandedRows.value"
              :key="'row-' + expandedRow.originalIndex + '-' + expandedRow.subRowIndex"
              :table-id="tableId"
              :expanded-row="expandedRow"
              :expanded-rows="expandMethods.expandedRows.value"
              v-bind="rowProps"
              v-on="rowEvents"
            >
              <template #[key]="slotProps" v-for="(_, key) in $slots" :key="key">
                <slot :name="key" v-bind="slotProps"></slot>
              </template>
            </TableRow>

            <!-- 空数据 -->
            <tr v-if="!tableData || tableData.length === 0">
              <td
                :colspan="columnMethods.leafColumns.value.length"
                class="multi-table__empty"
                :class="{
                  'multi-table__empty-small': props.size === 'small',
                  'multi-table__empty-large': props.size === 'large'
                }"
              >
                <slot name="empty">
                  <div class="empty-text" :class="{ 'empty-text__small': props.size === 'small', 'empty-text__large': props.size === 'large' }">暂无数据</div>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 总结行 (内部) -->
      <div v-if="props.showSummary && props.summaryFitTableContentWith" class="multi-table__summary">
        <slot name="summary">
          <div class="multi-table__summary-text">{{ props.summary }}</div>
        </slot>
      </div>

      <!-- 固定列阴影 -->
      <div
        v-if="columnMethods.leftFixedLeaves.value.length > 0"
        class="fixed-shadow fixed-shadow--left"
        :class="{ 'has-shadow': eventMethods.scrollLeft.value >= styleMethods.leftFixedWidth.value / 2 }"
        :style="{ width: styleMethods.leftFixedWidth.value + 'px' }"
      />
      <div
        v-if="columnMethods.rightFixedLeaves.value.length > 0"
        class="fixed-shadow fixed-shadow--right"
        :class="{ 'has-shadow': styleMethods.hasRightScroll.value }"
        :style="{ width: styleMethods.rightFixedWidth.value + styleMethods.scrollbarWidth.value + 'px' }"
      />
    </div>

    <!-- 总结行 (外部) -->
    <div v-if="props.showSummary && !props.summaryFitTableContentWith" class="multi-table__summary">
      <slot name="summary">
        <div class="multi-table__summary-text">{{ props.summary }}</div>
      </slot>
    </div>

    <!-- 表尾 -->
    <div v-if="$slots.footer" class="multi-table-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, toRef, useId, watch } from 'vue'
import type { MultiTableProps, MultiTableEvent } from './types'
import { useColumns } from './composables/useColumns'
import { useResizable } from './composables/useResizable'
import { useSelection } from './composables/useSelection'
import { useRowExpand } from './composables/useRowExpand'
import { useTableEvents } from './composables/useTableEvents'
import { useTableStyles } from './composables/useTableStyles'
import TableHeader from './TableHeader.vue'
import TableRow from './TableRow.vue'
import "./style.css"

const props = withDefaults(
  defineProps<MultiTableProps>(),
  {
    rowKey: 'id',
    stripe: true,
    showHeader: true,
    border: true,
    size: 'default',
    clickRowToSelect: false,
    selectable: false,
    selectMode: 'radio',
    selectedRowKeys: () => [],
    showIndex: false,
    indexColumnWidth: 80,
    summaryFitTableContentWith: false,
    cellTextEllipsis: true,
  }
)

const emit = defineEmits<MultiTableEvent>()

const tableId = useId()
const wrapperRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const tableData = computed(() => props.data || [])

// 1. 列拖拽
const resizableMethods = useResizable()

// 2. 列处理
const columnsRef = toRef(props, 'columns')
const selectableRef = toRef(props, 'selectable')
const showIndexRef = toRef(props, 'showIndex')
const indexColumnWidthRef = toRef(props, 'indexColumnWidth')
const columnMethods = useColumns(columnsRef, resizableMethods.widthOverrides, selectableRef, { showIndex: showIndexRef, indexColumnWidth: indexColumnWidthRef })

// 3. 选择逻辑
const selectionMethods = useSelection(tableData, props, emit)

// 4. 子行展开逻辑
const expandMethods = useRowExpand(tableData, columnsRef, selectionMethods.getRowKey)

// 5. 事件处理逻辑
const eventMethods = useTableEvents(
  emit,
  expandMethods.resolveCellValue,
  {
    selectable: props.selectable,
    clickRowToSelect: props.clickRowToSelect,
    toggleSelection: selectionMethods.toggleSelection
  }
)

// 6. 样式计算逻辑
const styleMethods = useTableStyles(
  props,
  columnMethods.leafColumns,
  columnMethods.leftFixedLeaves,
  columnMethods.rightFixedLeaves,
  columnMethods.totalWidth,
  containerRef,
  eventMethods.scrollLeft,
  resizableMethods.getEffectiveWidth,
  columnMethods.getLeftOffset
)

// 组装传递给 TableHeader 的 Props 和 Events
const headerProps = computed(() => ({
  showHeader: props.showHeader,
  size: props.size,
  selectMode: props.selectMode,
  isAllSelected: selectionMethods.isAllSelected.value,
  isIndeterminate: selectionMethods.isIndeterminate.value,
  headerRows: columnMethods.headerRows.value,
  lastColumnKey: columnMethods.lastColumnKey.value ?? '',
  resizing: resizableMethods.resizing.value,
  resizeColIndex: resizableMethods.resizeColIndex.value,
  headerRowClassName: props.headerRowClassName,
  headerRowStyle: props.headerRowStyle,
  headerCellClassName: props.headerCellClassName,
  getHeaderCellStyle: styleMethods.getHeaderCellStyle,
  onResizeMouseDown: resizableMethods.onResizeMouseDown,
  getEffectiveWidth: resizableMethods.getEffectiveWidth,
}))

const headerEvents = {
  toggleSelectAll: selectionMethods.toggleSelectAll,
}

// 组装传递给 TableRow 的 Props 和 Events
const rowProps = computed(() => ({
  size: props.size,
  stripe: props.stripe,
  selectMode: props.selectMode,
  isSelected: (row: Record<string, unknown>) => selectionMethods.isSelected(row),
  selectableProps: props.selectableProps,
  rowIndexFormat: props.rowIndexFormat,
  leafColumns: columnMethods.leafColumns.value,
  lastColumnKey: columnMethods.lastColumnKey.value ?? '',
  hoverRowGroup: eventMethods.hoverRowGroup.value,
  rowClassName: props.rowClassName,
  rowStyle: props.rowStyle,
  rowCellClassName: props.rowCellClassName,
  shouldRenderCell: expandMethods.shouldRenderCell,
  getRowSpan: expandMethods.getRowSpan,
  resolveCellValue: expandMethods.resolveCellValue,
  isObjectValue: expandMethods.isObjectValue,
  getObjectFields: expandMethods.getObjectFields,
  formatCellValue: expandMethods.formatCellValue,
  getCellStyle: styleMethods.getCellStyle,
}))

const rowEvents = {
  rowClick: eventMethods.onRowClick,
  rowMouseEnter: eventMethods.handleRowMouseEnter,
  rowMouseLeave: eventMethods.handleRowMouseLeave,
  cellClick: eventMethods.onCellClick,
  cellMouseEnter: eventMethods.onCellMouseEnter,
  cellMouseLeave: eventMethods.onCellMouseLeave,
  toggleSelection: selectionMethods.toggleSelection,
}

// ================= Expose =================
function scrollTo(options: { top?: number; left?: number }): void {
  containerRef.value?.scrollTo({
    top: options.top ?? 0,
    left: options.left ?? 0,
    behavior: 'smooth'
  })
}

function setScrollTop(top: number): void {
  if (containerRef.value) containerRef.value.scrollTop = top
}

function setScrollLeft(left: number): void {
  if (containerRef.value) {
    containerRef.value.scrollLeft = left
    eventMethods.scrollLeft.value = left
  }
}

watch(
  () => props.data,
  () => scrollTo({ top: 0, left: 0 }),
  { deep: true }
)

onBeforeUnmount(() => {
  eventMethods.clearAllTimers()
})

defineExpose({
  getEffectiveWidth: resizableMethods.getEffectiveWidth,
  widthOverrides: resizableMethods.widthOverrides,
  toggleSelectAll: selectionMethods.toggleSelectAll,
  clearSelection: selectionMethods.clearSelection,
  getSelectionRows: selectionMethods.getSelectionRows,
  toggleRowSelection: selectionMethods.toggleRowSelection,
  getHalfSelectionRows: selectionMethods.getHalfSelectionRows,
  setCurrentRow: selectionMethods.setCurrentRow,
  scrollTo,
  setScrollTop,
  setScrollLeft,
  tableContext: {
    headerRows: columnMethods.headerRows,
    leafColumns: columnMethods.leafColumns,
    totalWidth: columnMethods.totalWidth,
    leftFixedLeaves: columnMethods.leftFixedLeaves,
    rightFixedLeaves: columnMethods.rightFixedLeaves,
    lastColumnKey: columnMethods.lastColumnKey,
    getLeftOffset: columnMethods.getLeftOffset,
    getRightOffset: columnMethods.getRightOffset,
  }
})
</script>


