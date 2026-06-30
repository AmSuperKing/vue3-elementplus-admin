<!-- MultiTable.vue -->
<template>
  <div class="multi-table-wrapper" ref="wrapperRef">
    <div class="multi-table-container" ref="containerRef" @scroll="onScroll">
      <table class="multi-table" :style="{ minWidth: totalWidth + 'px' }" cellpadding="0" cellspacing="0">
        <!-- 表头 -->
        <thead class="multi-table__header">
          <tr v-for="(row, rowIndex) in headerRows" :key="'hr-' + rowIndex" class="multi-table__header-row">
            <th
              v-for="(cell, cellIdx) in row.cells"
              :key="cell.dataIndex"
              :colspan="cell._colSpan > 1 ? cell._colSpan : undefined"
              :rowspan="cell._rowSpan > 1 ? cell._rowSpan : undefined"
              :class="[
                'multi-table__th',
                cell.align ? `align-${cell.align}` : '',
                cell._isLeaf ? 'is-leaf' : '',
                cell._isSelection ? 'is-selection-th' : '',
                { 'is-fixed-left': cell.fixed === 'left' },
                { 'is-fixed-right': cell.fixed === 'right' },
                { 'is-last-column': cell.dataIndex === lastColumnKey },
                resizing && resizeColIndex === cell.dataIndex ? 'is-resizing' : '',
              ]"
              :style="getHeaderCellStyle(cell)"
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
                :class="{ active: resizing && resizeColIndex === cell.dataIndex }"
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
            :class="{
              'is-stripe': expandedRow.originalIndex % 2 === 1,
              'is-selected': isSelected(expandedRow.originalRow),
              'is-row-hover': hoverRowGroup === expandedRow.groupKey,
            }"
            @click="onRowClick(expandedRow.originalRow, expandedRow.originalIndex)"
            @mouseenter="hoverRowGroup = expandedRow.groupKey"
            @mouseleave="hoverRowGroup = null"
          >
            <template v-for="col in leafColumns" :key="col.dataIndex + '-' + expandedRow.originalIndex">
              <td
                v-if="shouldRenderCell(col, expandedRow)"
                :rowspan="getRowSpan(col, expandedRow) > 1 ? getRowSpan(col, expandedRow) : undefined"
                :class="[
                  'multi-table__td',
                  col.align ? `align-${col.align}` : '',
                  { 'is-fixed-left': col.fixed === 'left' },
                  { 'is-fixed-right': col.fixed === 'right' },
                  { 'is-selection-td': col.dataIndex === '__selection__' },
                  { 'is-object-cell': isObjectValue(resolveCellValue(expandedRow, col)) },
                  { 'is-hover-cell': hoverRowGroup === expandedRow.groupKey },
                  { 'is-last-column': col.dataIndex === lastColumnKey },
                ]"
                :style="getCellStyle(col)"
                @click="col.dataIndex === '__selection__' ? $event.stopPropagation() : null"
              >
                <div class="td-content">
                  <!-- 选择列单元格 -->
                  <template v-if="col.dataIndex === '__selection__'">
                    <label v-if="selectMode === 'checkbox'" class="custom-checkbox" @click.stop>
                      <input
                        type="checkbox"
                        :checked="isSelected(expandedRow.originalRow)"
                        @change="toggleSelection(expandedRow.originalRow)"
                      />
                      <span class="checkmark"></span>
                    </label>
                    <label v-else class="custom-radio" @click.stop>
                      <input
                        type="radio"
                        :name="`radio_${tableId}`"
                        :checked="isSelected(expandedRow.originalRow)"
                        @change="toggleSelection(expandedRow.originalRow)"
                      />
                      <span class="radiomark"></span>
                    </label>
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
            <td :colspan="leafColumns.length" class="multi-table__empty">
              <slot name="empty">
                <div class="empty-text">暂无数据</div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 固定列阴影 -->
    <div
      v-if="leftFixedLeaves.length > 0"
      class="fixed-shadow fixed-shadow--left"
      :class="{ 'has-shadow': scrollLeft > 1 }"
      :style="{ left: leftFixedWidth + 'px' }"
    />
    <div
      v-if="rightFixedLeaves.length > 0"
      class="fixed-shadow fixed-shadow--right"
      :class="{ 'has-shadow': hasRightScroll }"
      :style="{ right: rightFixedWidth + scrollbarWidth + 'px' }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef, useId } from 'vue'
import type { ColumnConfig, LeafColumn, FlatColumn } from './types'
import { useColumns } from './useColumns'
import { useResizable } from './useResizable'

const props = withDefaults(
  defineProps<{
    columns: ColumnConfig[]
    data: Record<string, unknown>[]
    rowKey?: string
    stripe?: boolean
    border?: boolean
    selectable?: boolean
    selectMode?: 'radio' | 'checkbox'
    selectedRowKeys?: (string | number)[]
  }>(),
  {
    rowKey: 'id',
    stripe: true,
    border: true,
    selectable: false,
    selectMode: 'radio',
    selectedRowKeys: () => [],
  }
)

const emit = defineEmits<{
  (e: 'update:selectedRowKeys', keys: (string | number)[]): void
  (e: 'selection-change', selectedRows: Record<string, unknown>[], selectedRowKeys: (string | number)[]): void
  (e: 'row-click', row: Record<string, unknown>, index: number): void
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
const {
  headerRows,
  leafColumns,
  totalWidth,
  leftFixedLeaves,
  rightFixedLeaves,
  lastColumnKey,
  getLeftOffset,
  // getRightOffset,
} = useColumns(columnsRef, widthOverrides, selectableRef)

const tableData = computed(() => props.data || [])

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
  if (tableData.value.length === 0) return false
  return tableData.value.every((row) => selectedKeys.value.includes(getRowKey(row)))
})

// 是否半选
const isIndeterminate = computed(() => {
  const selectedCount = tableData.value.filter((row) =>
    selectedKeys.value.includes(getRowKey(row))
  ).length
  return selectedCount > 0 && selectedCount < tableData.value.length
})

function toggleSelection(row: Record<string, unknown>) {
  const key = getRowKey(row)
  let newKeys: (string | number)[]

  if (props.selectMode === 'radio') {
    newKeys = [key]
  } else {
    if (selectedKeys.value.includes(key)) {
      newKeys = selectedKeys.value.filter((k) => k !== key)
    } else {
      newKeys = [...selectedKeys.value, key]
    }
  }

  emitUpdate(newKeys)
}

function toggleSelectAll() {
  let newKeys: (string | number)[]
  if (isAllSelected.value) {
    newKeys = []
  } else {
    newKeys = tableData.value.map((row) => getRowKey(row))
  }
  emitUpdate(newKeys)
}

function emitUpdate(newKeys: (string | number)[]) {
  emit('update:selectedRowKeys', newKeys)
  const selectedRows = tableData.value.filter((row) => newKeys.includes(getRowKey(row)))
  emit('selection-change', selectedRows, newKeys)
}

function onRowClick(row: Record<string, unknown>, index: number) {
  emit('row-click', row, index)
  // 点击行也触发选中（可选）
  if (props.selectable) {
    toggleSelection(row)
  }
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

function onScroll(e: Event) {
  const target = e.target as HTMLElement
  scrollLeft.value = target.scrollLeft
}

function getHeaderCellStyle(cell: FlatColumn) {
  const style: Record<string, string> = {
    textAlign: cell.align || 'left',
  }

  if (cell._isLeaf) {
    const w = getEffectiveWidth(cell.dataIndex, cell.width ?? 120)
    style.width = w + 'px'
    style.minWidth = w + 'px'
  }

  if (cell.fixed === 'left') {
    style.position = 'sticky'
    style.left = getLeftOffset(cell.dataIndex) + 'px'
    style.zIndex = '12'
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
    style.zIndex = '12'
  }

  return style
}

function getCellStyle(col: LeafColumn) {
  const width = getEffectiveWidth(col.dataIndex, col.width ?? 120)
  const style: Record<string, string> = {
    width: width + 'px',
    minWidth: width + 'px',
    maxWidth: width + 'px',
    textAlign: col.align || 'left',
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

  return style
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'object') {
    if (Array.isArray(value)) return `[${value.length}项]`
    return ''
  }
  return String(value)
}

defineExpose({
  getEffectiveWidth,
  widthOverrides,
  toggleSelectAll,
  clearSelection: () => emitUpdate([]),
})
</script>

<style scoped>
.multi-table-wrapper {
  position: relative;
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  font-size: 14px;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.multi-table-container {
  width: 100%;
  overflow: auto;
  position: relative;
  max-height: 600px;
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
  z-index: 10;
}

.multi-table__header-row {
  background-color: #fafafa;
}

.multi-table__th {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  font-weight: 600;
  background-color: #f5f5f5;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
}

/* .multi-table__th:last-child {
  border-right: none;
} */
.multi-table__th.is-last-column {
  border-right: none;
}

.multi-table__th.is-leaf {
  background-color: #f5f5f5;
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

.th-content {
  display: flex;
  align-items: center;
  justify-content: inherit;
  min-height: 22px;
}

.th-title {
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

/* 拖拽手柄 */
.resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  cursor: col-resize;
  z-index: 5;
  transition: background-color 0.2s;
}

.resize-handle:hover,
.resize-handle.active {
  background-color: #1890ff;
  opacity: 0.6;
}

.multi-table__th.is-resizing {
  background-color: #e6f7ff !important;
}

/* 数据行 */
.multi-table__row {
  /* transition: background-color 0.2s; */
  cursor: pointer;
}

.multi-table__row.is-row-hover,
.multi-table__row:hover {
  background-color: #f5f7fa !important;
  transition: background-color 0.2s;
}

.multi-table__row.is-stripe {
  background-color: #fafafa;
}

.multi-table__row.is-selected {
  /* background-color: #f5f7fa !important; */
}

.multi-table__row.is-selected .multi-table__td,
.multi-table__row.is-selected.is-row-hover .multi-table__td {
  /* background-color: #f5f7fa !important; */
}

.multi-table__row.is-stripe:hover {
  background-color: #f5f7fa !important;
}

.multi-table__td {
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  background-color: inherit;
}

/* .multi-table__td:last-child {
  border-right: none;
} */
.multi-table__td.is-last-column {
  border-right: none;
}

.multi-table__td.align-center {
  text-align: center;
}

.multi-table__td.is-selection-td {
  padding: 10px 8px;
}

.multi-table__td.is-hover-cell,
.multi-table__row:hover .multi-table__td {
  background-color: #f5f7fa !important;
  transition: background-color 0.2s;
}

/* 固定列 */
.multi-table__td.is-fixed-left,
.multi-table__td.is-fixed-right,
.multi-table__th.is-fixed-left,
.multi-table__th.is-fixed-right {
  background-color: #fff;
  z-index: 2;
}

.multi-table__th.is-fixed-left,
.multi-table__th.is-fixed-right {
  z-index: 12 !important;
  background-color: #f5f5f5;
}

.multi-table__row.is-stripe .multi-table__td.is-fixed-left,
.multi-table__row.is-stripe .multi-table__td.is-fixed-right {
  background-color: #fafafa;
}

.multi-table__row:hover .multi-table__td.is-fixed-left,
.multi-table__row:hover .multi-table__td.is-fixed-right {
  background-color: #f5f7fa !important;
}
.multi-table__row.is-selected .multi-table__td.is-fixed-left,
.multi-table__row.is-selected .multi-table__td.is-fixed-right {
  /* background-color: #f5f7fa !important; */
}

.td-content {
  overflow: hidden;
  text-overflow: ellipsis;
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
  z-index: 19;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fixed-shadow--left {
  width: 12px;
  box-shadow: 5px 0 5px -2px rgba(0, 0, 0, 0.1);
}

.fixed-shadow--right {
  background: linear-gradient(to left, rgba(0, 0, 0, 0.1), transparent);
}

.fixed-shadow.has-shadow {
  opacity: 1;
}

/* 空数据 */
.multi-table__empty {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.empty-text {
  font-size: 14px;
}

/* 滚动条 */
.multi-table-container {
  scrollbar-width: thin;
  scrollbar-color: #d9d9d9 #f5f5f5;
}

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

/* ====== 自定义 Checkbox ====== */
.custom-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  width: 18px;
  height: 18px;
  margin: 0 auto;
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
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.custom-checkbox input:checked~.checkmark {
  background-color: #1890ff;
  border-color: #1890ff;
}

.custom-checkbox input:checked~.checkmark::after {
  content: '';
  display: block;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}

/* 半选状态 */
.custom-checkbox input:indeterminate~.checkmark {
  background-color: #1890ff;
  border-color: #1890ff;
}

.custom-checkbox input:indeterminate~.checkmark::after {
  content: '';
  display: block;
  width: 8px;
  height: 2px;
  background-color: #fff;
}

.custom-checkbox:hover .checkmark {
  border-color: #1890ff;
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
  border: 1px solid #d9d9d9;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.custom-radio input:checked~.radiomark {
  border-color: #1890ff;
}

.custom-radio input:checked~.radiomark::after {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #1890ff;
}

.custom-radio:hover .radiomark {
  border-color: #1890ff;
}
</style>
