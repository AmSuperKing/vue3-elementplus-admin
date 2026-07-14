<!-- TableHeader.vue -->
<template>
  <thead v-if="showHeader" class="multi-table__header">
    <tr
      v-for="(row, rowIndex) in headerRows"
      :key="'hr-' + rowIndex"
      :class="[
        'multi-table__header-row',
        typeof headerRowClassName === 'function' ? headerRowClassName(row, rowIndex, headerRows) : headerRowClassName
      ]"
      :style="typeof headerRowStyle === 'function' ? headerRowStyle(row, rowIndex, headerRows) : headerRowStyle"
    >
      <th
        v-for="(cell, cellIdx) in row.cells"
        :key="cell.dataIndex"
        :colspan="cell._colSpan > 1 ? cell._colSpan : undefined"
        :rowspan="cell._rowSpan > 1 ? cell._rowSpan : undefined"
        :class="[
          'multi-table__th',
          { 'multi-table__th-small': size === 'small' },
          { 'multi-table__th-large': size === 'large' },
          cell.align ? `align-${cell.align}` : '',
          cell._isLeaf ? 'is-leaf' : '',
          cell._isSelection ? (size === 'small' || size === 'large') ? `is-selection-th-${size}` : 'is-selection-th' : '',
          { 'is-fixed-left': cell.fixed === 'left' },
          { 'is-fixed-right': cell.fixed === 'right' },
          { 'is-last-column': cell.dataIndex === lastColumnKey },
          resizing && resizeColIndex === cell.dataIndex ? 'is-resizing' : '',
          typeof headerCellClassName === 'function' ? headerCellClassName(cell, cellIdx, row, rowIndex, headerRows) : headerCellClassName
        ]"
        :style="getHeaderCellStyle(cell, cellIdx, row, rowIndex, headerRows)"
      >
        <div class="th-content">
          <!-- 选择列表头 -->
          <SelectionHeader
            v-if="cell._isSelection"
            :size="size"
            :select-mode="selectMode"
            :is-all-selected="isAllSelected"
            :is-indeterminate="isIndeterminate"
            @toggle-select-all="$emit('toggleSelectAll')"
          />

          <!-- 索引列表头 -->
          <slot v-else-if="cell._isDataIndex" name="header-data-index">
            <span class="th-title">{{ cell.title }}</span>
          </slot>

          <!-- 正常表头插槽 -->
          <slot
            v-else
            :name="`header_${cell._parentDataIndex ? cell._parentDataIndex + '_' + cell.dataIndex : cell.dataIndex}`"
            :column="cell"
            :row="row"
            :depth="cell._depth"
            :index="cellIdx"
          >
            <span class="th-title">{{ cell.title }}</span>
          </slot>
        </div>

        <!-- 列拖拽手柄 -->
        <div
          v-if="cell._isLeaf && cell.resizable && !cell._isSelection"
          class="resize-handle"
          :class="[
            size === 'small' || size === 'large' ? `resize-handle-${size}` : '',
            { active: resizing && resizeColIndex === cell.dataIndex }
          ]"
          @mousedown="onResizeMouseDown($event, cell.dataIndex, getEffectiveWidth(cell.dataIndex, cell.width ?? 120))"
        />
      </th>
    </tr>
  </thead>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { FlatColumn, HeaderRow } from './types'
import SelectionHeader from './SelectionHeader.vue'
import "./style.css"

defineProps<{
  showHeader: boolean
  size: 'small' | 'default' | 'large'
  selectMode: 'radio' | 'checkbox'
  isAllSelected: boolean
  isIndeterminate: boolean
  headerRows: HeaderRow[]
  lastColumnKey: string
  resizing: boolean
  resizeColIndex: string | null
  headerRowClassName?: string | ((row: HeaderRow, rowIndex: number, rows: HeaderRow[]) => string)
  headerRowStyle?: CSSProperties | ((row: HeaderRow, rowIndex: number, rows: HeaderRow[]) => CSSProperties)
  headerCellClassName?: string | ((column: FlatColumn, colIndex: number, row: HeaderRow, rowIndex: number, rows: HeaderRow[]) => string)
  getHeaderCellStyle: (cell: FlatColumn, cellIndex: number, row: HeaderRow, rowIndex: number, rows: HeaderRow[]) => CSSProperties
  onResizeMouseDown: (e: MouseEvent, dataIndex: string, width: number) => void
  getEffectiveWidth: (dataIndex: string, defaultWidth: number) => number
}>()

defineEmits<{
  (e: 'toggleSelectAll'): void
}>()
</script>
