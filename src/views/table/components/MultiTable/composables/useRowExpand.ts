// useRowExpand.ts
import { computed, type Ref } from 'vue'
import type { ColumnConfig, LeafColumn, ExpandedRow } from '../types'

export function useRowExpand(
  tableData: Ref<Record<string, unknown>[]>,
  columns: Ref<ColumnConfig[]>,
  getRowKey: (row: Record<string, unknown>) => string | number
) {
  const parentColumns = computed(() =>
    columns.value.filter((c) => c.children && c.children.length > 0)
  )

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

  const topLevelDataIndexes = computed(() =>
    new Set(columns.value.map((c) => c.dataIndex))
  )

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

      const groupKey = `group-${getRowKey(row)}`
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

  function shouldRenderCell(col: LeafColumn, expandedRow: ExpandedRow): boolean {
    if (col._parentDataIndex && arrayParentDataIndexes.value.has(col._parentDataIndex)) {
      return true
    }
    return expandedRow.subRowIndex === 0
  }

  function getRowSpan(col: LeafColumn, expandedRow: ExpandedRow): number {
    if (col._parentDataIndex && arrayParentDataIndexes.value.has(col._parentDataIndex)) {
      return 1
    }
    return expandedRow.totalSubRows
  }

  function resolveCellValue(expandedRow: ExpandedRow, col: LeafColumn): unknown {
    const row = expandedRow.originalRow
    if (col._parentDataIndex && arrayParentDataIndexes.value.has(col._parentDataIndex)) {
      const subRowData = expandedRow.subRowDataMap[col._parentDataIndex]
      if (subRowData) return subRowData[col.dataIndex]
      return undefined
    }
    if (col._parentDataIndex) {
      const parentValue = row[col._parentDataIndex]
      if (parentValue && typeof parentValue === 'object' && !Array.isArray(parentValue)) {
        return (parentValue as Record<string, unknown>)[col.dataIndex]
      }
    }
    let value = row[col.dataIndex]
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

  function isObjectValue(value: unknown): boolean {
    return value !== null && value !== undefined && typeof value === 'object' && !Array.isArray(value)
  }

  function getObjectFields(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const key in obj) {
      if (!topLevelDataIndexes.value.has(key)) {
        result[key] = obj[key]
      }
    }
    return result
  }

  function formatCellValue(value: unknown): string {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'object') {
      if (Array.isArray(value)) return `[${value.length}项]`
      return ''
    }
    return String(value)
  }

  return {
    expandedRows,
    shouldRenderCell,
    getRowSpan,
    resolveCellValue,
    isObjectValue,
    getObjectFields,
    formatCellValue,
  }
}
