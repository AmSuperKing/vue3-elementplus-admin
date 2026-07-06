<!-- MultiTable.vue -->
<template>
  <div
    class="multi-table-layout"
    :class="{
      'multi-table-wrapper__small': props.size === 'small',
      'multi-table-wrapper__large': props.size === 'large'
    }"
    :style="tableConfigStyle"
  >
    <!-- 表题头 -->
    <div v-if="$slots.header" class="multi-table-header">
      <slot name="header"></slot>
    </div>
    <div ref="wrapperRef" class="multi-table-wrapper">
      <div class="multi-table-container" ref="containerRef" @scroll="onScroll">
        <table class="multi-table" :style="{ minWidth: totalWidth + 'px' }" cellpadding="0" cellspacing="0">
          <!-- 表头 -->
          <thead v-if="props.showHeader" class="multi-table__header">
            <tr
              v-for="(row, rowIndex) in headerRows"
              :key="'hr-' + rowIndex"
              :class="[
                'multi-table__header-row',
                typeof props.headerRowClassName === 'function' ? props.headerRowClassName(row, rowIndex, headerRows) : props.headerRowClassName
              ]"
              :style="typeof props.headerRowStyle === 'function' ? props.headerRowStyle(row, rowIndex, headerRows) : props.headerRowStyle"
            >
              <th
                v-for="(cell, cellIdx) in row.cells"
                :key="cell.dataIndex"
                :colspan="cell._colSpan > 1 ? cell._colSpan : undefined"
                :rowspan="cell._rowSpan > 1 ? cell._rowSpan : undefined"
                :class="[
                  'multi-table__th',
                  { 'multi-table__th-small': props.size === 'small' },
                  { 'multi-table__th-large': props.size === 'large' },
                  cell.align ? `align-${cell.align}` : '',
                  cell._isLeaf ? 'is-leaf' : '',
                  cell._isSelection ? (props.size === 'small' || props.size === 'large') ? `is-selection-th-${props.size}` : 'is-selection-th' : '',
                  { 'is-fixed-left': cell.fixed === 'left' },
                  { 'is-fixed-right': cell.fixed === 'right' },
                  { 'is-last-column': cell.dataIndex === lastColumnKey },
                  resizing && resizeColIndex === cell.dataIndex ? 'is-resizing' : '',
                  typeof props.headerCellClassName === 'function' ? props.headerCellClassName(cell, cellIdx, row, rowIndex, headerRows) : props.headerCellClassName
                ]"
                :style="getHeaderCellStyle(cell, cellIdx, row, rowIndex, headerRows)"
              >
                <div class="th-content">
                  <!-- 选择列表头 -->
                  <template v-if="cell._isSelection">
                    <label v-if="selectMode === 'checkbox'" class="custom-checkbox" @click.stop>
                      <input
                        type="checkbox"
                        :checked="isAllSelected"
                        :indeterminate.prop="isIndeterminate"
                        @change="toggleSelectAll"
                      />
                      <span class="checkmark"></span>
                    </label>
                  </template>

                  <!-- 索引列表头 -->
                  <template v-if="cell._isDataIndex">
                    <slot name="header-data-index">
                      <span class="th-title">{{ cell.title }}</span>
                    </slot>
                  </template>

                  <!-- 正常表头插槽 -->
                  <template v-else>
                    <slot
                      :name="`header_${cell._parentDataIndex ? cell._parentDataIndex + '_' + cell.dataIndex : cell.dataIndex}`"
                      :column="cell"
                      :row="row"
                      :depth="cell._depth"
                      :index="cellIdx"
                    >
                      <span class="th-title">{{ cell.title }}</span>
                    </slot>
                  </template>
                </div>

                <!-- 列拖拽手柄 -->
                <div
                  v-if="cell._isLeaf && cell.resizable && !cell._isSelection"
                  class="resize-handle"
                  :class="[
                    props.size === 'small' || props.size === 'large' ? `resize-handle-${props.size}` : '',
                    { active: resizing && resizeColIndex === cell.dataIndex }
                  ]"
                  @mousedown="
                    onResizeMouseDown(
                      $event,
                      cell.dataIndex,
                      getEffectiveWidth(cell.dataIndex, cell.width ?? 120)
                    )
                  "
                />
              </th>
            </tr>
          </thead>

          <!-- 数据行 -->
          <tbody class="multi-table__body">
            <tr
              v-for="expandedRow in expandedRows"
              :key="'row-' + expandedRow.originalIndex + '-' + expandedRow.subRowIndex"
              class="multi-table__row"
              :class="[
               {
                'is-stripe': props.stripe && expandedRow.originalIndex % 2 === 1,
                'is-selected': isSelected(expandedRow.originalRow),
                'is-row-hover': hoverRowGroup === expandedRow.groupKey,
               },
               typeof props.rowClassName === 'function' ? props.rowClassName(expandedRow.originalRow, expandedRow.originalIndex, expandedRow, expandedRows) : props.rowClassName
              ]"
              :style="typeof props.rowStyle === 'function' ? props.rowStyle(expandedRow.originalRow, expandedRow.originalIndex, expandedRow, expandedRows) : props.rowStyle"
              @click="onRowClick(expandedRow.originalRow, expandedRow.originalIndex)"
              @mouseenter="handleRowMouseEnter(expandedRow.groupKey, expandedRow.originalIndex, expandedRow.originalRow)"
              @mouseleave="handleRowMouseLeave(expandedRow.originalIndex, expandedRow.originalRow)"
            >
              <template v-for="col in leafColumns" :key="col.dataIndex + '-' + expandedRow.originalIndex">
                <td
                  v-if="shouldRenderCell(col, expandedRow)"
                  :rowspan="getRowSpan(col, expandedRow) > 1 ? getRowSpan(col, expandedRow) : undefined"
                  :class="[
                    'multi-table__td',
                    { 'multi-table__td-small': props.size === 'small' },
                    { 'multi-table__td-large': props.size === 'large' },
                    col.align ? `align-${col.align}` : '',
                    { 'is-fixed-left': col.fixed === 'left' },
                    { 'is-fixed-right': col.fixed === 'right' },
                    { 'is-selection-td': col.dataIndex === '__selection__' },
                    { 'is-selection-td__small': col.dataIndex === '__selection__' && props.size === 'small' },
                    { 'is-selection-td__large': col.dataIndex === '__selection__' && props.size === 'large' },
                    { 'is-object-cell': isObjectValue(resolveCellValue(expandedRow, col)) },
                    { 'is-hover-cell': hoverRowGroup === expandedRow.groupKey },
                    { 'is-last-column': col.dataIndex === lastColumnKey },
                    typeof props.rowCellClassName === 'function' ? props.rowCellClassName(col, leafColumns, expandedRow, expandedRows) : props.rowCellClassName
                  ]"
                  :style="getCellStyle(col, leafColumns, expandedRow, expandedRows)"
                  @click="onCellClick($event, col, expandedRow)"
                  @mouseenter="onCellMouseEnter(col, expandedRow)"
                  @mouseleave="onCellMouseLeave(col, expandedRow)"
                >
                  <div class="td-content">
                    <!-- 选择列单元格 -->
                    <template v-if="col.dataIndex === '__selection__'">
                      <label v-if="selectMode === 'checkbox'" class="custom-checkbox" @click.stop>
                        <input
                          type="checkbox"
                          :checked="isSelected(expandedRow.originalRow)"
                          :disabled="(props.selectableProps && props.selectableProps(expandedRow.originalRow)) || false"
                          @change="toggleSelection(expandedRow.originalRow)"
                        />
                        <span class="checkmark"></span>
                      </label>
                      <label v-else class="custom-radio" @click.stop>
                        <input
                          type="radio"
                          :name="`radio_${tableId}`"
                          :disabled="(props.selectableProps && props.selectableProps(expandedRow.originalRow)) || false"
                          :checked="isSelected(expandedRow.originalRow)"
                          @change="toggleSelection(expandedRow.originalRow)"
                        />
                        <span class="radiomark"></span>
                      </label>
                    </template>

                    <template v-else-if="col.dataIndex === '__index__'">
                      <slot name="index" :row="expandedRow.originalRow" :index="expandedRow.originalIndex">
                        <span>{{ props.rowIndexFormat ? props.rowIndexFormat(expandedRow.originalIndex, expandedRow.originalRow) : expandedRow.originalIndex + 1 }}</span>
                      </slot>
                    </template>

                    <!-- 正常单元格插槽 -->
                    <template v-else>
                      <slot
                        :name="`cell_${col._parentDataIndex ? col._parentDataIndex + '_' + col.dataIndex : col.dataIndex}`"
                        :row="expandedRow.originalRow"
                        :column="col"
                        :value="resolveCellValue(expandedRow, col)"
                        :index="expandedRow.originalIndex"
                      >
                        <!-- 对象值：渲染字段并匹配子插槽 -->
                        <template v-if="isObjectValue(resolveCellValue(expandedRow, col))">
                          <div class="object-cell">
                            <div
                              v-for="(val, key) in getObjectFields(resolveCellValue(expandedRow, col) as Record<string, unknown>)"
                              :key="key"
                              class="object-field"
                            >
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
                    </template>
                  </div>
                </td>
              </template>
            </tr>

            <!-- 空数据 -->
            <tr v-if="!tableData || tableData.length === 0">
              <td
                :colspan="leafColumns.length"
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

      <!-- 总结行 -->
      <div v-if="props.showSummary && props.summaryFitTableContentWith" class="multi-table__summary">
        <slot name="summary">
          <div class="multi-table__summary-text">{{ props.summary }}</div>
        </slot>
      </div>

      <!-- 固定列阴影 -->
      <div
        v-if="leftFixedLeaves.length > 0"
        class="fixed-shadow fixed-shadow--left"
        :class="{ 'has-shadow': scrollLeft > 1 }"
        :style="{ width: leftFixedWidth + 'px' }"
      />
      <div
        v-if="rightFixedLeaves.length > 0"
        class="fixed-shadow fixed-shadow--right"
        :class="{ 'has-shadow': hasRightScroll }"
        :style="{ width: rightFixedWidth + scrollbarWidth + 'px' }"
      />
    </div>

    <!-- 总结行 -->
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
import { computed, onBeforeUnmount, ref, toRef, useId, watch, type CSSProperties } from 'vue'
import type { ColumnConfig, LeafColumn, FlatColumn, HeaderRow } from './types'
import { useColumns } from './useColumns'
import { useResizable } from './useResizable'
import { hexToRgba, rgbaToHex6 } from './colorUtils'

const props = withDefaults(
  defineProps<{
    columns: ColumnConfig[]
    data: Record<string, unknown>[]
    rowKey?: string
    height?: number | string
    maxHeight?: number | string
    stripe?: boolean
    stripeColor?: string
    border?: boolean
    showHeader?: boolean
    headerRowBg?: string
    headerCellBg?: string
    headerRowClassName?: string | ((row: HeaderRow, rowIndex: number, rows: HeaderRow[]) => string)
    headerRowStyle?: CSSProperties | ((row: HeaderRow, rowIndex: number, rows: HeaderRow[]) => CSSProperties)
    headerCellClassName?: string | ((column: FlatColumn, colIndex: number, row: HeaderRow, rowIndex: number, rows: HeaderRow[]) => string)
    headerCellStyle?: CSSProperties | ((cell: FlatColumn, cellIndex: number, row: HeaderRow,  rowIndex: number, rows: HeaderRow[]) => CSSProperties)
    rowClassName?: string | ((row: Record<string, unknown>, rowIndex: number, expandedRow: ExpandedRow, expandedRows: ExpandedRow[]) => string)
    rowStyle?: CSSProperties | ((row: Record<string, unknown>, rowIndex: number, expandedRow: ExpandedRow, expandedRows: ExpandedRow[]) => CSSProperties)
    rowCellClassName?: string | ((column: LeafColumn, cols: LeafColumn[], row: ExpandedRow, rows: ExpandedRow[]) => string)
    rowCellStyle?: CSSProperties | ((column: LeafColumn, cols: LeafColumn[], row: ExpandedRow, rows: ExpandedRow[]) => CSSProperties)
    borderColor?: string
    selectorColor?: string
    selectorBorderColor?: string
    selectorCheckedColor?: string
    rowHoverBg?: string
    highlightSlectedRow?: boolean
    highlightSlectedColor?: string
    fixedColumnBg?: string
    size?: 'small' | 'default' | 'large'
    theme?: string
    clickRowToSelect?: boolean
    selectable?: boolean
    selectMode?: 'radio' | 'checkbox'
    selectedRowKeys?: (string | number)[]
    showIndex?: boolean
    rowIndexFormat?: (index: number, row: Record<string, unknown>) => string | number
    indexColumnWidth?: number
    showSummary?: boolean
    summary?: string
    summaryFitTableContentWith?: boolean
    selectableProps?: (row: Record<string, unknown>) => boolean
    cellTextEllipsis?: boolean
  }>(),
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

const emit = defineEmits<{
  (e: 'update:selectedRowKeys', keys: (string | number)[]): void
  (e: 'selection-change', selectedRows: Record<string, unknown>[], selectedRowKeys: (string | number)[]): void
  (e: 'select', selectedRow: Record<string, unknown>): void
  (e: 'select-all', selectedRows: Record<string, unknown>[]): void
  (e: 'row-click', row: Record<string, unknown>, rowIndex: number): void
  (e: 'row-dblclick', row: Record<string, unknown>, rowIndex: number): void
  (e: 'row-mouseenter', row: Record<string, unknown>, rowIndex: number): void
  (e: 'row-mouseleave', row: Record<string, unknown>, rowIndex: number): void
  (e: 'cell-click', cellInfo: Record<string, unknown>, row: Record<string, unknown>): void
  (e: 'cell-dblclick', cellInfo: Record<string, unknown>, row: Record<string, unknown>): void
  (e: 'cell-mouseenter', cellInfo: Record<string, unknown>, row: Record<string, unknown>): void
  (e: 'cell-mouseleave', cellInfo: Record<string, unknown>, row: Record<string, unknown>): void
  (e: 'scroll', scrollEvent: Event): void
}>()

const tableId = useId() // 用于 radio name 唯一性
const hoverRowGroup = ref<string | number | null>(null)
const wrapperRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const scrollLeft = ref(0)

// 列拖拽
const {
  widthOverrides,
  resizing,
  resizeColIndex,
  onResizeMouseDown,
  getEffectiveWidth,
} = useResizable()

// 列处理
const columnsRef = toRef(props, 'columns')
const selectableRef = toRef(props, 'selectable')
const showIndexRef = toRef(props, 'showIndex')
const indexColumnWidthRef =  toRef(props, 'indexColumnWidth')
const {
  headerRows,
  leafColumns,
  totalWidth,
  leftFixedLeaves,
  rightFixedLeaves,
  lastColumnKey,
  getLeftOffset,
  getRightOffset,
} = useColumns(columnsRef, widthOverrides, selectableRef, { showIndex: showIndexRef, indexColumnWidth: indexColumnWidthRef })

const tableData = computed(() => props.data || [])

const tableConfigStyle = computed(() => {
  const style: Record<string, string> = {}

  // 主题色相关
  if (props.theme) {
    style['--table-primary-color'] = props.theme
    style['--table-selector-checked-color'] = props.theme
    style['--table-selector-color'] = props.theme
    style['--table-selector-border-color'] = props.theme
    style['--table-th-resizing-color'] = props.theme
  }

  const themeAlphaColor = props.theme ? rgbaToHex6(hexToRgba(props.theme, 0.055)) : ''

  // 辅助函数：优先取 prop 值，否则回退到主题透明色
  const applyStyle = (cssVar: string, propValue: string | undefined, fallbackValue: string = themeAlphaColor) => {
    const value = propValue || fallbackValue
    if (value) style[cssVar] = value
  }
  applyStyle('--table-header-bg', props.headerRowBg)
  applyStyle('--table-header-cell-bg', props.headerCellBg)
  // applyStyle('--table-selector-border-color', props.selectorBorderColor)
  applyStyle('--table-selector-color', props.selectorColor)
  applyStyle('--table-row-stripe-color', props.stripeColor)
  applyStyle('--table-row-hover-bg', props.rowHoverBg)
  applyStyle('--table-row-selected-bg', props.highlightSlectedRow ? props.highlightSlectedColor : undefined)

  if (props.height) {
    style['--table-container-height'] =  typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  if (props.maxHeight) {
    style['--table-container-max-height'] = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  }
  if (props.borderColor) style['--table-border-color'] = props.borderColor
  if (props.fixedColumnBg) style['--table-fixed-column-bg'] = props.fixedColumnBg
  if (props.clickRowToSelect) style['--table-row-cursor'] = 'pointer'
  if (props.selectorBorderColor) style['--table-selector-border-color'] = props.selectorBorderColor
  if (!props.border) style.border = 'none'

  if (!props.cellTextEllipsis) {
    style['--cell-overflow'] = 'auto'
    style['--cell-text-overflow'] = 'visible'
    style['--cell-white-space'] = 'normal'
    style['--cell-work-break'] = 'break-all'
  } else {
    style['--cell-overflow'] = 'hidden'
    style['--cell-text-overflow'] = 'ellipsis'
    style['--cell-white-space'] = 'nowrap'
  }

  return style
})

// ================= 子行展开逻辑 =================
/** 有子列的父列 */
const parentColumns = computed(() =>
  props.columns.filter((c) => c.children && c.children.length > 0)
)

/** 包含数组数据的父列 dataIndex 集合 */
const arrayParentDataIndexes = computed(() => {
  const set = new Set<string>()
  for (const pCol of parentColumns.value) {
    for (const row of tableData.value) {
      if (Array.isArray(row[pCol.dataIndex])) {
        set.add(pCol.dataIndex)
        break
      }
    }
  }
  return set
})

/** 顶层列的 dataIndex 集合（用于过滤对象字段，避免重复渲染） */
const topLevelDataIndexes = computed(() =>
  new Set(props.columns.map((c) => c.dataIndex))
)

interface ExpandedRow {
  groupKey: string | number
  originalRow: Record<string, unknown>
  originalIndex: number
  subRowIndex: number
  totalSubRows: number
  /** 父列 dataIndex → 子行数据项 */
  subRowDataMap: Record<string, Record<string, unknown> | undefined>
}

/** 将原始数据行展开为子行（数组父列的每个元素一行） */
const expandedRows = computed<ExpandedRow[]>(() => {
  const result: ExpandedRow[] = []

  for (let rowIdx = 0; rowIdx < tableData.value.length; rowIdx++) {
    const row = tableData.value[rowIdx]!

    let maxSubRows = 1
    const arrayDataMap: Record<string, Record<string, unknown>[]> = {}

    for (const pCol of parentColumns.value) {
      const value = row[pCol.dataIndex]
      if (Array.isArray(value) && value.length > 0) {
        maxSubRows = Math.max(maxSubRows, value.length)
        arrayDataMap[pCol.dataIndex] = value as Record<string, unknown>[]
      }
    }

    // 生成一个组Key，用于关联主行和子行
    const groupKey = `group-${getRowKey(row)}`;

    for (let i = 0; i < maxSubRows; i++) {
      const subRowDataMap: Record<string, Record<string, unknown> | undefined> = {}
      for (const pCol of parentColumns.value) {
        const arr = arrayDataMap[pCol.dataIndex]
        subRowDataMap[pCol.dataIndex] = arr ? arr[i] : undefined
      }
      result.push({
        originalRow: row,
        originalIndex: rowIdx,
        subRowIndex: i,
        totalSubRows: maxSubRows,
        subRowDataMap,
        groupKey,
      })
    }
  }

  return result
})

/** 判断单元格是否应该渲染（rowSpan 逻辑：非展开列只在第一子行渲染） */
function shouldRenderCell(col: LeafColumn, expandedRow: ExpandedRow): boolean {
  if (col._parentDataIndex && arrayParentDataIndexes.value.has(col._parentDataIndex)) {
    return true
  }
  return expandedRow.subRowIndex === 0
}

/** 获取单元格的 rowSpan */
function getRowSpan(col: LeafColumn, expandedRow: ExpandedRow): number {
  if (col._parentDataIndex && arrayParentDataIndexes.value.has(col._parentDataIndex)) {
    return 1
  }
  return expandedRow.totalSubRows
}

/** 解析单元格值（支持嵌套对象、数组子行、父对象取值） */
function resolveCellValue(expandedRow: ExpandedRow, col: LeafColumn): unknown {
  const row = expandedRow.originalRow

  // 1. 数组父列的子列：从子行数据中取值 (例如 commissionDetail -> name)
  if (col._parentDataIndex && arrayParentDataIndexes.value.has(col._parentDataIndex)) {
    const subRowData = expandedRow.subRowDataMap[col._parentDataIndex]
    if (subRowData) {
      return subRowData[col.dataIndex]
    }
    return undefined
  }

  // 2. 对象父列的子列：从父对象中取值 (例如 goodsDetail -> goodNo)
  if (col._parentDataIndex) {
    const parentValue = row[col._parentDataIndex]
    if (parentValue && typeof parentValue === 'object' && !Array.isArray(parentValue)) {
      return (parentValue as Record<string, unknown>)[col.dataIndex]
    }
  }

  // 3. 直接取值 (根层级)
  let value = row[col.dataIndex]

  // 4. 兜底：在嵌套对象中查找（保持原有兼容逻辑）
  if (value === undefined || value === null) {
    for (const key in row) {
      if (row[key] && typeof row[key] === 'object' && !Array.isArray(row[key])) {
        const nested = (row[key] as Record<string, unknown>)[col.dataIndex]
        if (nested !== undefined) {
          value = nested
          break
        }
      }
    }
  }
  return value
}

/** 判断值是否为普通对象 */
function isObjectValue(value: unknown): boolean {
  return value !== null && value !== undefined && typeof value === 'object' && !Array.isArray(value)
}

/** 获取对象字段（过滤掉已作为顶层列的字段，避免重复渲染） */
function getObjectFields(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key in obj) {
    if (!topLevelDataIndexes.value.has(key)) {
      result[key] = obj[key]
    }
  }
  return result
}

// ================= 选择逻辑 =================
const selectedKeys = computed(() => props.selectedRowKeys || [])

const getRowKey = (row: Record<string, unknown>) => row[props.rowKey] as string | number

const isSelected = (row: Record<string, unknown>) => {
  return selectedKeys.value.includes(getRowKey(row))
}

// 是否全选
const isAllSelected = computed(() => {
  if (tableData.value.length === 0) return false;
  const selectableRows = tableData.value.filter((row) => {
    return !props.selectableProps || !props.selectableProps(row);
  });
  if (selectableRows.length === 0) return true;
  return selectableRows.every((row) => selectedKeys.value.includes(getRowKey(row)));
});

// 是否半选
const isIndeterminate = computed(() => {
  const selectableRows = tableData.value.filter((row) => {
    return !props.selectableProps || !props.selectableProps(row);
  });
  const selectedCount = selectableRows.filter((row) =>
    selectedKeys.value.includes(getRowKey(row))
  ).length;
  return selectedCount > 0 && selectedCount < selectableRows.length;
});

function toggleSelection(row: Record<string, unknown>) {
  // 在这里加入 selectableProps 判断
  if (props.selectableProps && props.selectableProps(row)) {
    return; // 如果 selectableProps 返回 true (表示禁用)，则不执行选择
  }

  const key = getRowKey(row);
  let newKeys: (string | number)[];

  if (props.selectMode === 'radio') {
    newKeys = [key];
  } else {
    if (selectedKeys.value.includes(key)) {
      newKeys = selectedKeys.value.filter((k) => k !== key);
    } else {
      newKeys = [...selectedKeys.value, key];
    }
  }
  emit('select', row);
  emitUpdate(newKeys);
}

function toggleSelectAll() {
  // 获取所有可被选择的行的 key
  const selectableKeys = tableData.value
    .filter((row) => {
      return !props.selectableProps || !props.selectableProps(row);
    })
    .map((row) => getRowKey(row));

  // 如果当前是全选状态（所有可选行都已选中），则清空选择
  // 否则，选中所有可选行
  const newKeys = isAllSelected.value
    ? selectedKeys.value.filter(key => !selectableKeys.includes(key))
    : [...new Set([...selectedKeys.value, ...selectableKeys])];

  const selectedRows = tableData.value.filter((row) => newKeys.includes(getRowKey(row)));
  emit('select-all', selectedRows);

  emitUpdate(newKeys);
}

function emitUpdate(newKeys: (string | number)[]) {
  emit('update:selectedRowKeys', newKeys)
  const selectedRows = tableData.value.filter((row) => newKeys.includes(getRowKey(row)))
  emit('selection-change', selectedRows, newKeys)
}

let clickTimer: ReturnType<typeof setTimeout> | null = null;
function onRowClick(row: Record<string, unknown>, index: number) {
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
    // 在延迟时间内再次点击，判定为双击
    emit('row-dblclick', row, index)
  } else {
    // 第一次点击，设置定时器等待第二次点击
    clickTimer = setTimeout(() => {
      emit('row-click', row, index)
      // 点击行也触发选中（可选）
      if (props.selectable && props.clickRowToSelect) {
        toggleSelection(row)
      }
      clickTimer = null;
    }, 300);
  }
}

// ================= Cell 事件逻辑 =================
let cellClickTimer: ReturnType<typeof setTimeout> | null = null;

function onCellClick(e: MouseEvent, col: LeafColumn, expandedRow: ExpandedRow) {
  // 选择列的点击已由内部 input 处理，阻止冒泡后不再重复触发
  if (col.dataIndex === '__selection__') return;

  const cellValue = resolveCellValue(expandedRow, col);
  const cellInfo = {
    column: col,
    value: cellValue,
    dataIndex: col.dataIndex,
    rowIndex: expandedRow.originalIndex
  };

  if (cellClickTimer) {
    clearTimeout(cellClickTimer);
    cellClickTimer = null;
    emit('cell-dblclick', cellInfo, expandedRow.originalRow);
  } else {
    cellClickTimer = setTimeout(() => {
      emit('cell-click', cellInfo, expandedRow.originalRow);
      cellClickTimer = null;
    }, 300);
  }
}

// Cell 鼠标进出防抖定时器
let cellEnterTimer: ReturnType<typeof setTimeout> | null = null;
let cellLeaveTimer: ReturnType<typeof setTimeout> | null = null;

function onCellMouseEnter(col: LeafColumn, expandedRow: ExpandedRow) {
  if (cellLeaveTimer) {
    clearTimeout(cellLeaveTimer);
    cellLeaveTimer = null;
  }
  if (cellEnterTimer) {
    clearTimeout(cellEnterTimer);
  }
  cellEnterTimer = setTimeout(() => {
    const cellInfo = {
      column: col,
      value: resolveCellValue(expandedRow, col),
      dataIndex: col.dataIndex,
      rowIndex: expandedRow.originalIndex
    };
    emit('cell-mouseenter', cellInfo, expandedRow.originalRow);
  }, DEBOUNCE_DELAY);
}

function onCellMouseLeave(col: LeafColumn, expandedRow: ExpandedRow) {
  if (cellEnterTimer) {
    clearTimeout(cellEnterTimer);
    cellEnterTimer = null;
  }
  cellLeaveTimer = setTimeout(() => {
    const cellInfo = {
      column: col,
      value: resolveCellValue(expandedRow, col),
      dataIndex: col.dataIndex,
      rowIndex: expandedRow.originalIndex
    };
    emit('cell-mouseleave', cellInfo, expandedRow.originalRow);
  }, DEBOUNCE_DELAY);
}

// ================= 样式逻辑 =================
/** 左侧固定列总宽度 */
const leftFixedWidth = computed(() =>
  leftFixedLeaves.value.reduce(
    (sum, col) => sum + getEffectiveWidth(col.dataIndex, col.width ?? 120),
    0
  )
)

/** 右侧固定列总宽度 */
const rightFixedWidth = computed(() => rightFixedLeaves.value.reduce(
  (sum, col) => sum + getEffectiveWidth(col.dataIndex, col.width ?? 120),
  0
))

/** 容器垂直滚动条宽度（右侧阴影定位需要扣除） */
const scrollbarWidth = computed(() => {
  if (!containerRef.value) return 0
  // 引用 totalWidth / data.length 响应列宽、数据变化，确保垂直滚动条出现/消失时重新计算
  void totalWidth.value
  void props.data.length
  return containerRef.value.offsetWidth - containerRef.value.clientWidth
})

const hasRightScroll = computed(() => {
  if (!containerRef.value) return false
  const el = containerRef.value
  // 依赖 scrollLeft 响应滚动；引用 totalWidth 响应列宽/数据变化
  void totalWidth.value
  return el.scrollWidth - scrollLeft.value - el.clientWidth > 1
})

let tableScrollTimer: ReturnType<typeof setTimeout> | null = null
const SCROLL_EMIT_DELAY = 100
function onScroll(e: Event) {
  const target = e.target as HTMLElement
  scrollLeft.value = target.scrollLeft
  if (tableScrollTimer) {
    clearTimeout(tableScrollTimer)
  }
  tableScrollTimer = setTimeout(() => {
    emit('scroll', e)
  }, SCROLL_EMIT_DELAY)
}

function getHeaderCellStyle(cell: FlatColumn, cellIndex: number, row: HeaderRow, rowIndex: number, rows: HeaderRow[]) {
  const style: Record<string, string> = {
    textAlign: cell.align || 'left',
  }

  if (!props.border) {
    style.borderRight = 'none'
    style.borderBottom = 'none'
  }

  if (cell._isLeaf) {
    const w = getEffectiveWidth(cell.dataIndex, cell.width ?? 120)
    style.width = w + 'px'
    style.minWidth = w + 'px'
  }

  if (cell.fixed === 'left') {
    style.position = 'sticky'
    style.left = getLeftOffset(cell.dataIndex) + 'px'
    style.zIndex = '5'
  } else if (cell.fixed === 'right') {
    style.position = 'sticky'
    style.right = (() => {
      const idx = leafColumns.value.findIndex((c) => c.dataIndex === cell.dataIndex)
      let offset = 0
      for (let i = leafColumns.value.length - 1; i > idx; i--) {
        const c = leafColumns.value[i]!
        if (c.fixed === 'right') {
          offset += getEffectiveWidth(c.dataIndex, c.width ?? 120)
        }
      }
      return offset + 'px'
    })()
    style.zIndex = '5'
  }

  let userConfigHeaderCellStyle: CSSProperties = {}
  if (props.headerCellStyle) {
    if (typeof props.headerCellStyle === 'function') {
      userConfigHeaderCellStyle = props.headerCellStyle(cell, cellIndex, row, rowIndex, rows)
    }
    if (Object.prototype.toString.call(props.headerCellStyle)=== '[object Object]') {
      userConfigHeaderCellStyle = props.headerCellStyle as CSSProperties
    }
  }

  return { ...style, ...userConfigHeaderCellStyle }
}

function getCellStyle(col: LeafColumn, cols: LeafColumn[], row: ExpandedRow, rows: ExpandedRow[]) {
  const width = getEffectiveWidth(col.dataIndex, col.width ?? 120)
  const style: Record<string, string> = {
    width: width + 'px',
    minWidth: width + 'px',
    maxWidth: width + 'px',
    textAlign: col.align || 'left',
  }

  if (!props.border) {
    style.borderRight = 'none'
    style.borderBottom = 'none'
  }

  if (col.fixed === 'left') {
    style.position = 'sticky'
    style.left = getLeftOffset(col.dataIndex) + 'px'
    style.zIndex = '2'
  } else if (col.fixed === 'right') {
    style.position = 'sticky'
    style.right = (function () {
      const idx = leafColumns.value.findIndex((c) => c.dataIndex === col.dataIndex)
      let offset = 0
      for (let i = leafColumns.value.length - 1; i > idx; i--) {
        const c = leafColumns.value[i]!
        if (c.fixed === 'right') {
          offset += getEffectiveWidth(c.dataIndex, c.width ?? 120)
        }
      }
      return offset + 'px'
    })()
    style.zIndex = '2'
  }

  let userConfigCellStyle: CSSProperties = {}
  if (props.rowCellStyle) {
    if (typeof props.rowCellStyle === 'function') {
      userConfigCellStyle = props.rowCellStyle(col, cols, row, rows)
    }
    if (Object.prototype.toString.call(props.rowCellStyle)=== '[object Object]') {
      userConfigCellStyle = props.rowCellStyle as CSSProperties
    }
  }

  return { ...style, ...userConfigCellStyle}
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'object') {
    if (Array.isArray(value)) return `[${value.length}项]`
    return ''
  }
  return String(value)
}

// 定义防抖延迟时间（毫秒）
const DEBOUNCE_DELAY = 100
// 义定时器变量
let enterTimer: ReturnType<typeof setTimeout> | null = null
let leaveTimer: ReturnType<typeof setTimeout> | null = null
// 修改后的悬停进入处理函数
function handleRowMouseEnter(groupKey: string | number, rowIndex: number, row: Record<string, unknown>) {
  // 如果有未执行的离开定时器，说明鼠标刚离开又回来了，取消离开操作
  if (leaveTimer) {
    clearTimeout(leaveTimer)
    leaveTimer = null
  }
  // 如果有未执行的进入定时器，说明触发频率过高，取消上一次的，重新计时
  if (enterTimer) {
    clearTimeout(enterTimer)
  }
  // 设置新的进入定时器
  enterTimer = setTimeout(() => {
    hoverRowGroup.value = groupKey
    emit('row-mouseenter', row, rowIndex)
  }, DEBOUNCE_DELAY)
}
// 修改后的悬停离开处理函数
function handleRowMouseLeave(rowIndex: number, row: Record<string, unknown>) {
  // 如果有未执行的进入定时器，说明鼠标刚进入就离开了，取消进入操作
  if (enterTimer) {
    clearTimeout(enterTimer)
    enterTimer = null
  }
  // 设置离开定时器
  leaveTimer = setTimeout(() => {
    hoverRowGroup.value = null
    emit('row-mouseleave', row, rowIndex)
  }, DEBOUNCE_DELAY)
}

// ================= Expose =================

/**
 * 获取当前选中的行数据
 */
function getSelectionRows(): Record<string, unknown>[] {
  return tableData.value.filter((row) => selectedKeys.value.includes(getRowKey(row)))
}

/**
 * 获取半选状态的行数据
 * 注意：在 checkbox 模式下，通常只有"全选框"有半选状态。
 * 此方法返回那些"被禁用(selectableProps=true)"且"未被选中"的行，
 * 或者根据你的业务需求，可调整为返回部分子级被选中的父级行（若支持树形）。
 * 当前基于扁平表格逻辑，返回所有不可选但可能影响全选状态的行作为参考。
 */
function getHalfSelectionRows(): Record<string, unknown>[] {
  if (props.selectMode !== 'checkbox') return []

  // 在多选模式下，半选通常指：存在已选行，但未全部选中
  // 如果业务上需要获取导致半选的特定行（例如禁用的行），可使用以下逻辑：
  const isHalf = isIndeterminate.value
  if (!isHalf) return []

  // 返回当前已选中的行作为半选上下文，或根据实际需求调整
  // 这里提供标准的 Element Plus 兼容行为：返回当前已选行
  return getSelectionRows()
}

/**
 * 切换某一行的选中状态
 * @param row 要操作的行数据
 * @param selected 可选，直接设置选中(true)或取消(false)。不传则 toggle
 */
function toggleRowSelection(row: Record<string, unknown>, selected?: boolean): void {
  if (!row || !props.selectable) return

  // 检查是否禁用选择
  if (props.selectableProps && props.selectableProps(row)) return

  const key = getRowKey(row)
  const currentSelected = selectedKeys.value.includes(key)

  // 确定目标状态
  const targetState = selected !== undefined ? selected : !currentSelected

  // 如果状态未改变，直接返回
  if (targetState === currentSelected) return

  let newKeys: (string | number)[]
  if (props.selectMode === 'radio') {
    // 单选模式：设置为选中则替换，取消则清空
    newKeys = targetState ? [key] : []
  } else {
    // 多选模式
    newKeys = targetState
      ? [...selectedKeys.value, key]
      : selectedKeys.value.filter((k) => k !== key)
  }

  emitUpdate(newKeys)
}

/**
 * 用于单选模式，设定某一行为选中行
 * @param row 要选中的行数据，不传参数则取消当前高亮/选中
 */
function setCurrentRow(row?: Record<string, unknown>): void {
  if (props.selectMode !== 'radio') {
    console.warn('[MultiTable] setCurrentRow is only available in radio select mode.')
    return
  }

  if (!row) {
    emitUpdate([])
    return
  }

  // 检查是否禁用
  if (props.selectableProps && props.selectableProps(row)) return

  const key = getRowKey(row)
  if (!selectedKeys.value.includes(key)) {
    emitUpdate([key])
  }
}

/**
 * 滚动到指定坐标
 * @param options 包含 top 和 left 的滚动位置对象
 */
function scrollTo(options: { top?: number; left?: number }): void {
  containerRef.value?.scrollTo({
    top: options.top ?? 0,
    left: options.left ?? 0,
    behavior: 'smooth'
  })
}

/**
 * 设置垂直滚动位置
 * @param top 垂直滚动像素值
 */
function setScrollTop(top: number): void {
  if (containerRef.value) {
    containerRef.value.scrollTop = top
  }
}

/**
 * 设置水平滚动位置
 * @param left 水平滚动像素值
 */
function setScrollLeft(left: number): void {
  if (containerRef.value) {
    containerRef.value.scrollLeft = left
    // 同步更新内部 scrollLeft 响应式变量，确保固定列阴影正确显示
    scrollLeft.value = left
  }
}

const tableContext = {
  headerRows,
  leafColumns,
  totalWidth,
  leftFixedLeaves,
  rightFixedLeaves,
  lastColumnKey,
  getLeftOffset,
  getRightOffset,
}

const clearAllTimer = () => {
  if (enterTimer) clearTimeout(enterTimer)
  if (leaveTimer) clearTimeout(leaveTimer)
  if (cellClickTimer) clearTimeout(cellClickTimer);
  if (cellEnterTimer) clearTimeout(cellEnterTimer);
  if (cellLeaveTimer) clearTimeout(cellLeaveTimer);
}

watch(
  () => props.data,
  () => {
    scrollTo({ top: 0, left: 0 })
  },
  {
    deep: true
  }
)

defineExpose({
  getEffectiveWidth,
  widthOverrides,
  toggleSelectAll,
  clearSelection: () => emitUpdate([]),
  getSelectionRows,
  toggleRowSelection,
  getHalfSelectionRows,
  setCurrentRow,
  scrollTo,
  setScrollTop,
  setScrollLeft,
  tableContext
})

onBeforeUnmount(() => {
  clearAllTimer()
})
</script>

<style scoped>
.multi-table-layout {
  position: relative;
  width: 100%;
  border: 1px solid var(--table-border-color, #e8e8e8);
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
.multi-table-layout__small {
  font-size: 12px;
}
.multi-table-layout__large {
  font-size: 16px;
}
.multi-table-header {
  border-bottom: 1px solid var(--table-border-color, #e8e8e8);
}
.multi-table-footer {
  border-top: 1px solid var(--table-border-color, #e8e8e8);
}
.multi-table-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.multi-table-container {
  width: 100%;
  overflow: auto;
  position: relative;
  height: var(--table-container-height);
  max-height: var(--table-container-max-height, 600px);
}

.multi-table {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  width: max-content;
  min-width: 100%;
}

/* 表头 */
.multi-table__header {
  position: sticky;
  top: 0;
  z-index: 5;
}

.multi-table__header-row {
  background-color: var(--table-header-bg, #fafafa);
}

.multi-table__th {
  padding: 12px 16px;
  border-bottom: 1px solid var(--table-border-color, #e8e8e8);
  border-right: 1px solid  var(--table-border-color, #e8e8e8);
  font-weight: 600;
  background-color: var(--table-header-cell-bg, #f5f5f5);
  position: relative;
  white-space: var(--cell-white-space, nowrap);
  overflow: var(--cell-overflow, hidden);
  text-overflow: var(--cell-text-overflow, ellipsis);
  word-break: var(--cell-work-break);
  box-sizing: border-box;
}
.multi-table__th-small {
  padding: 6px 8px;
}
.multi-table__th-large {
  padding: 16px 20px;
}


.multi-table__th.is-last-column {
  border-right: none;
}

.multi-table__th.is-leaf {
  background-color: var(--table-header-cell-bg, #f5f5f5);
}

.multi-table__th.align-center {
  text-align: center;
  justify-content: center;
}

.multi-table__th.align-right {
  text-align: right;
  justify-content: flex-end;
}

.multi-table__th.is-selection-th {
  padding: 12px 8px;
}
.multi-table__th.is-selection-th-small {
  padding: 6px 4px;
}
.multi-table__th.is-selection-th-large {
  padding: 16px 12px;
}

.th-content {
  display: flex;
  align-items: center;
  justify-content: inherit;
  min-height: 22px;
}

.th-title {
  overflow: var(--cell-overflow, hidden);;
  text-overflow: var(--cell-text-overflow, ellipsis);
  word-break: var(--cell-work-break);
  font-weight: 500;
}

/* 拖拽手柄 */
.resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  z-index: 2;
  transition: background-color 0.2s;
}
.resize-handle-small {
  width: 3px;
}
.resize-handle-large {
  width: 6px;
}

.resize-handle:hover,
.resize-handle.active {
  background-color: var(--table-primary-color, #1890ff);
  opacity: 0.6;
}

.multi-table__th.is-resizing {
  background-color: var(--table-th-resizing-color, #e6f7ff);
}

/* 数据行 */
.multi-table__row {
  cursor: var(--table-row-cursor, default);
}

.multi-table__row.is-row-hover {
  background-color: var(--table-row-hover-bg, #f5f7fa);
  transition: background-color .3s;
}

.multi-table__row.is-stripe {
  background-color: var(--table-row-stripe-color, #fafafa);
}

.multi-table__row.is-selected {
  background-color: var(--table-row-selected-bg);
}

.multi-table__row.is-selected .multi-table__td {
  background-color: var(--table-row-selected-bg);
}
.multi-table__row.is-row-hover:not(.is-selected) .multi-table__td {
  background-color: var(--table-row-hover-bg);
  transition: background-color .3s;
}

.multi-table__row.is-stripe.is-row-hover {
  background-color: var(--table-row-hover-bg, #f5f7fa);
  transition: background-color .3s;
}

.multi-table__td {
  padding: 10px 16px;
  border-bottom: 1px solid var(--table-border-color, #f0f0f0);
  border-right: 1px solid var(--table-border-color, #f0f0f0);
  white-space: var(--cell-white-space, nowrap);
  overflow: var(--cell-overflow, hidden);;
  text-overflow: var(--cell-text-overflow, ellipsis);
  word-break: var(--cell-work-break);
  box-sizing: border-box;
  background-color: inherit;
}
.multi-table__td-small {
  padding: 5px 8px;
}
.multi-table__td-large {
  padding: 14px 20px;
}

.multi-table__td.is-last-column {
  border-right: none;
}

.multi-table__td.align-center {
  text-align: center;
}

.multi-table__td.is-selection-td {
  padding: 10px 8px;
}
.multi-table__td.is-selection-td__small {
  padding: 5px 4px;
}
.multi-table__td.is-selection-td__large {
  padding: 14px 12px;
}

.multi-table__td.is-hover-cell,
.multi-table__row.is-row-hover:not(.is-row-hover) .multi-table__td {
  background-color: var(--table-row-hover-bg, #f5f7fa);
}

/* 固定列 */
.multi-table__td.is-fixed-left,
.multi-table__td.is-fixed-right {
  background-color: var(--table-fixed-column-bg, #fff);
  z-index: 3;
}

.multi-table__th.is-fixed-left,
.multi-table__th.is-fixed-right {
  z-index: 3;
  background-color: var(--table-header-cell-bg, #f5f5f5);
}

.multi-table__row.is-stripe .multi-table__td.is-fixed-left,
.multi-table__row.is-stripe .multi-table__td.is-fixed-right {
  background-color: var(--table-row-stripe-color, #fafafa);
}

.multi-table__row.is-row-hover:not(.is-selected) .multi-table__td.is-fixed-left,
.multi-table__row.is-row-hover:not(.is-selected) .multi-table__td.is-fixed-right {
  background-color: var(--table-row-hover-bg, #f5f7fa);
}

.multi-table__row.is-selected .multi-table__td.is-fixed-left,
.multi-table__row.is-selected .multi-table__td.is-fixed-right,
.multi-table__row.is-selected.is-row-hover .multi-table__td.is-fixed-left,
.multi-table__row.is-selected.is-row-hover .multi-table__td.is-fixed-right {
  background-color: var(--table-row-selected-bg);
  opacity: 1;
}

.td-content {
  overflow: var(--cell-overflow, hidden);;
  text-overflow: var(--cell-text-overflow, ellipsis);
  word-break: var(--cell-work-break);
}

/* 对象单元格 */
.multi-table__td.is-object-cell .td-content {
  white-space: normal;
  overflow: visible;
}

.object-cell {
  font-size: 12px;
  line-height: 1.6;
}

.object-field {
  display: flex;
  gap: 4px;
}

.object-key {
  color: #999;
  flex-shrink: 0;
}

.object-val {
  color: #333;
}

/* 固定列阴影 */
.fixed-shadow {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 5px;
  pointer-events: none;
  z-index: 5;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fixed-shadow--left {
  left: 0;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.08);
}

.fixed-shadow--right {
  right: 0;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.08);
}

.fixed-shadow.has-shadow {
  opacity: 1;
}

/* 总结行 */
.multi-table__summary {
  font-size: 14px;
}
multi-table__summary-small {
  font-size: 12px;
}
multi-table__summary-large {
  font-size: 16px;
}

/* 空数据 */
.multi-table__empty {
  text-align: center;
  padding: 40px 0;
  color: #999;
}
.multi-table__empty-small {
  padding: 20px 0;
}
.multi-table__empty-large {
  padding: 60px 0;
}

.empty-text {
  font-size: 14px;
}
.empty-text__small {
  font-size: 12px;
}
.empty-text__large {
  font-size: 16px;
}

/* 滚动条 */
@supports (-webkit-appearance: none) {
  .multi-table-container::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: transparent;
  }

  .multi-table-container::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 4px;
  }

  .multi-table-container::-webkit-scrollbar-thumb {
    background: #d9d9d9;
    border-radius: 4px;
    border: none;
    min-height: 20px;
  }

  .multi-table-container::-webkit-scrollbar-thumb:hover {
    background: #bfbfbf !important;
  }

  .multi-table-container::-webkit-scrollbar-corner {
    background: transparent;
  }
  .multi-table-container::-webkit-resizer {
    background: transparent;
  }
  .multi-table-container::-webkit-scrollbar-button {
    display: none;
  }
}
@-moz-document url-prefix() {
  .multi-table-container {
    scrollbar-width: thin;
    scrollbar-color: #d9d9d9 #f5f5f5;
  }
}


/* ====== 自定义 Checkbox ====== */
.custom-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  width: 18px;
  height: 18px;
  margin: 4px auto;
  overflow: hidden;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  z-index: 1;
  margin: 0;
}

.custom-checkbox .checkmark {
  width: 16px;
  height: 16px;
  border: 1px solid var(--table-selector-border-color, #d9d9d9);
  border-radius: 3px;
  background-color: var(--table-selector-color,#fff);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.custom-checkbox input:checked~.checkmark {
  background-color: var(--table-selector-checked-color, #1890ff);
  border-color: var(--table-selector-checked-color, #1890ff);
}

.custom-checkbox input:checked~.checkmark::after {
  content: '';
  display: inline-block;
  width: 5px;
  height: 9px;
  border-style: solid;
  border-color: #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}

/* 半选状态 */
.custom-checkbox input:indeterminate~.checkmark {
  background-color: var(--table-selector-checked-color, #1890ff);
  border-color: var(--table-selector-checked-color, #1890ff);
}

.custom-checkbox input:indeterminate~.checkmark::after {
  content: '';
  display: inline-block;
  width: 8px;
  height: 2px;
  background-color: #fff;
}
.custom-checkbox input:disabled,
.custom-checkbox input:disabled~.checkmark {
  background-color: #f5f7fa;
  cursor: not-allowed;
}

.custom-checkbox input:not(:disabled):hover~.checkmark {
  border-color: var(--table-selector-checked-color, #1890ff);
}

/* ====== 自定义 Radio ====== */
.custom-radio {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  width: 18px;
  height: 18px;
}

.custom-radio input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  z-index: 1;
  margin: 0;
}

.custom-radio .radiomark {
  width: 16px;
  height: 16px;
  border: 1px solid var(--table-selector-border-color, #d9d9d9);
  border-radius: 50%;
  background-color: var(--table-selector-color, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.custom-radio input:checked~.radiomark {
  border-color: var(--table-selector-checked-color, #1890ff);
}

.custom-radio input:checked~.radiomark::after {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--table-selector-checked-color, #1890ff);
}
.custom-radio input:disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
}

.custom-radio input:not(:disabled):hover~ .radiomark {
  border-color: var(--table-selector-checked-color, #1890ff);
}
</style>
