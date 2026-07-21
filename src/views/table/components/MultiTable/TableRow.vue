<!-- TableRow.vue -->
<template>
  <tr
    class="multi-table__row"
    :class="[
      {
        'is-stripe': stripe && expandedRow.originalIndex % 2 === 1,
        'is-selected': typeof isSelected === 'function' ? isSelected(expandedRow.originalRow) : isSelected,
        'is-row-hover': hoverRowGroup === expandedRow.groupKey,
      },
      typeof rowClassName === 'function' ? rowClassName(expandedRow.originalRow, expandedRow.originalIndex, expandedRow, expandedRows) : rowClassName
    ]"
    :style="typeof rowStyle === 'function' ? rowStyle(expandedRow.originalRow, expandedRow.originalIndex, expandedRow, expandedRows) : rowStyle"
    @click="$emit('rowClick', expandedRow.originalRow, expandedRow.originalIndex)"
    @mouseenter="$emit('rowMouseEnter', expandedRow.groupKey, expandedRow.originalIndex, expandedRow.originalRow)"
    @mouseleave="$emit('rowMouseLeave', expandedRow.originalIndex, expandedRow.originalRow)"
  >
    <template v-for="col in leafColumns" :key="col.dataIndex + '-' + expandedRow.originalIndex">
      <td
        v-if="shouldRenderCell(col, expandedRow)"
        :rowspan="getRowSpan(col, expandedRow) > 1 ? getRowSpan(col, expandedRow) : undefined"
        :class="[
          'multi-table__td',
          { 'multi-table__td-small': size === 'small' },
          { 'multi-table__td-large': size === 'large' },
          col.align ? `align-${col.align}` : '',
          { 'is-fixed-left': col.fixed === 'left' },
          { 'is-fixed-right': col.fixed === 'right' },
          { 'is-selection-td': col.dataIndex === '__selection__' },
          { 'is-selection-td__small': col.dataIndex === '__selection__' && size === 'small' },
          { 'is-selection-td__large': col.dataIndex === '__selection__' && size === 'large' },
          { 'is-object-cell': isObjectValue(resolveCellValue(expandedRow, col)) },
          { 'is-hover-cell': hoverRowGroup === expandedRow.groupKey },
          { 'is-last-column': col.dataIndex === lastColumnKey },
          typeof rowCellClassName === 'function' ? rowCellClassName(col, leafColumns, expandedRow, expandedRows) : rowCellClassName
        ]"
        :style="getCellStyle(col, leafColumns, expandedRow, expandedRows)"
        @click="$emit('cellClick', $event, col, expandedRow)"
        @mouseenter="$emit('cellMouseEnter', col, expandedRow)"
        @mouseleave="$emit('cellMouseLeave', col, expandedRow)"
      >
        <div class="td-content">
          <!-- 折叠/展开列 -->
          <template v-if="col.dataIndex === '__expand__'">
            <button
              v-if="expandedRow.collapsible"
              type="button"
              class="multi-table__expand-btn"
              :class="{ 'is-expanded': expandedRow.expanded }"
              :title="expandedRow.expanded ? '收起' : `展开（共 ${expandedRow.realTotalSubRows} 项）`"
              @click.stop="$emit('toggleExpand', expandedRow.originalRow)"
            >
              <span class="multi-table__expand-caret"></span>
            </button>
          </template>

          <!-- 选择列 -->
          <SelectionCell
            v-else-if="col.dataIndex === '__selection__'"
            :size="size"
            :select-mode="selectMode"
            :is-selected="typeof isSelected === 'function' ? isSelected(expandedRow.originalRow) : isSelected"
            :disabled="selectableProps && selectableProps(expandedRow.originalRow)"
            :radio-name="`radio_${tableId}`"
            @toggle="$emit('toggleSelection', expandedRow.originalRow)"
          />

          <!-- 索引列 -->
          <slot v-else-if="col.dataIndex === '__index__'" name="index" :row="expandedRow.originalRow" :index="expandedRow.originalIndex">
            <span>{{ rowIndexFormat ? rowIndexFormat(expandedRow.originalIndex, expandedRow.originalRow) : expandedRow.originalIndex + 1 }}</span>
          </slot>

          <!-- 正常单元格 -->
          <slot
            v-else
            :name="`cell_${col._parentDataIndex ? col._parentDataIndex + '_' + col.dataIndex : col.dataIndex}`"
            :row="expandedRow.originalRow"
            :column="col"
            :value="resolveCellValue(expandedRow, col)"
            :index="expandedRow.originalIndex"
          >
            <template v-if="isObjectValue(resolveCellValue(expandedRow, col))">
              <div class="object-cell">
                <div v-for="(val, key) in getObjectFields(resolveCellValue(expandedRow, col) as Record<string, unknown>)" :key="key" class="object-field">
                  <slot :name="`cell_${col.dataIndex}_${key}`" :value="val" :row="expandedRow.originalRow">
                    <span class="object-key">{{ key }}:</span>
                    <span class="object-val">{{ val }}</span>
                  </slot>
                </div>
              </div>
            </template>
            <template v-else>
              {{ formatCellValue(resolveCellValue(expandedRow, col)) }}
            </template>
          </slot>
        </div>
      </td>
    </template>
  </tr>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { LeafColumn, ExpandedRow } from './types'
import SelectionCell from './SelectionCell.vue'
import "./style.css"

defineProps<{
  tableId: string
  size: 'small' | 'default' | 'large'
  stripe: boolean
  selectMode: 'radio' | 'checkbox'
  isSelected: boolean | ((row: Record<string, unknown>) => boolean)
  selectableProps?: (row: Record<string, unknown>) => boolean
  rowIndexFormat?: (index: number, row: Record<string, unknown>) => string | number
  expandedRow: ExpandedRow
  expandedRows: ExpandedRow[]
  leafColumns: LeafColumn[]
  lastColumnKey: string
  hoverRowGroup: string | number | null
  rowClassName?: string | ((row: Record<string, unknown>, rowIndex: number, expandedRow: ExpandedRow, expandedRows: ExpandedRow[]) => string)
  rowStyle?: CSSProperties | ((row: Record<string, unknown>, rowIndex: number, expandedRow: ExpandedRow, expandedRows: ExpandedRow[]) => CSSProperties)
  rowCellClassName?: string | ((column: LeafColumn, cols: LeafColumn[], row: ExpandedRow, rows: ExpandedRow[]) => string)
  shouldRenderCell: (col: LeafColumn, expandedRow: ExpandedRow) => boolean
  getRowSpan: (col: LeafColumn, expandedRow: ExpandedRow) => number
  resolveCellValue: (expandedRow: ExpandedRow, col: LeafColumn) => unknown
  isObjectValue: (value: unknown) => boolean
  getObjectFields: (obj: Record<string, unknown>) => Record<string, unknown>
  formatCellValue: (value: unknown) => string
  getCellStyle: (col: LeafColumn, cols: LeafColumn[], row: ExpandedRow, rows: ExpandedRow[]) => CSSProperties
}>()

defineEmits<{
  (e: 'rowClick', row: Record<string, unknown>, index: number): void
  (e: 'rowMouseEnter', groupKey: string | number, index: number, row: Record<string, unknown>): void
  (e: 'rowMouseLeave', index: number, row: Record<string, unknown>): void
  (e: 'cellClick', event: MouseEvent, col: LeafColumn, expandedRow: ExpandedRow): void
  (e: 'cellMouseEnter', col: LeafColumn, expandedRow: ExpandedRow): void
  (e: 'cellMouseLeave', col: LeafColumn, expandedRow: ExpandedRow): void
  (e: 'toggleSelection', row: Record<string, unknown>): void
  (e: 'toggleExpand', row: Record<string, unknown>): void
}>()
</script>
