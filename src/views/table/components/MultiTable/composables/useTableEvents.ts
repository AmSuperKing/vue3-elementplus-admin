// useTableEvents.ts
import { ref, onBeforeUnmount } from 'vue'
import type { MultiTableEvent, ExpandedRow, LeafColumn } from '../types'

const DEBOUNCE_DELAY = 100
const SCROLL_EMIT_DELAY = 100

export function useTableEvents(
  emit: MultiTableEvent,
  resolveCellValue: (expandedRow: ExpandedRow, col: LeafColumn) => unknown,
  options: {
    selectable: boolean
    clickRowToSelect: boolean
    toggleSelection: (row: Record<string, unknown>) => void
  }
) {
  const hoverRowGroup = ref<string | number | null>(null)
  const scrollLeft = ref(0)

  let clickTimer: ReturnType<typeof setTimeout> | null = null
  let cellClickTimer: ReturnType<typeof setTimeout> | null = null
  let cellEnterTimer: ReturnType<typeof setTimeout> | null = null
  let cellLeaveTimer: ReturnType<typeof setTimeout> | null = null
  let enterTimer: ReturnType<typeof setTimeout> | null = null
  let leaveTimer: ReturnType<typeof setTimeout> | null = null
  let tableScrollTimer: ReturnType<typeof setTimeout> | null = null

  function onRowClick(row: Record<string, unknown>, index: number) {
    if (clickTimer) {
      clearTimeout(clickTimer)
      clickTimer = null
      emit('row-dblclick', row, index)
    } else {
      clickTimer = setTimeout(() => {
        emit('row-click', row, index)
        if (options.selectable && options.clickRowToSelect) {
          options.toggleSelection(row)
        }
        clickTimer = null
      }, 300)
    }
  }

  function onCellClick(e: MouseEvent, col: LeafColumn, expandedRow: ExpandedRow) {
    if (col.dataIndex === '__selection__') return
    const cellValue = resolveCellValue(expandedRow, col)
    const cellInfo = {
      column: col,
      value: cellValue,
      dataIndex: col.dataIndex,
      rowIndex: expandedRow.originalIndex
    }
    if (cellClickTimer) {
      clearTimeout(cellClickTimer)
      cellClickTimer = null
      emit('cell-dblclick', cellInfo, expandedRow.originalRow)
    } else {
      cellClickTimer = setTimeout(() => {
        emit('cell-click', cellInfo, expandedRow.originalRow)
        cellClickTimer = null
      }, 300)
    }
  }

  function onCellMouseEnter(col: LeafColumn, expandedRow: ExpandedRow) {
    if (cellLeaveTimer) { clearTimeout(cellLeaveTimer); cellLeaveTimer = null }
    if (cellEnterTimer) clearTimeout(cellEnterTimer)
    cellEnterTimer = setTimeout(() => {
      const cellInfo = {
        column: col,
        value: resolveCellValue(expandedRow, col),
        dataIndex: col.dataIndex,
        rowIndex: expandedRow.originalIndex
      }
      emit('cell-mouseenter', cellInfo, expandedRow.originalRow)
    }, DEBOUNCE_DELAY)
  }

  function onCellMouseLeave(col: LeafColumn, expandedRow: ExpandedRow) {
    if (cellEnterTimer) { clearTimeout(cellEnterTimer); cellEnterTimer = null }
    cellLeaveTimer = setTimeout(() => {
      const cellInfo = {
        column: col,
        value: resolveCellValue(expandedRow, col),
        dataIndex: col.dataIndex,
        rowIndex: expandedRow.originalIndex
      }
      emit('cell-mouseleave', cellInfo, expandedRow.originalRow)
    }, DEBOUNCE_DELAY)
  }

  function handleRowMouseEnter(groupKey: string | number, rowIndex: number, row: Record<string, unknown>) {
    if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null }
    if (enterTimer) clearTimeout(enterTimer)
    enterTimer = setTimeout(() => {
      hoverRowGroup.value = groupKey
      emit('row-mouseenter', row, rowIndex)
    }, DEBOUNCE_DELAY)
  }

  function handleRowMouseLeave(rowIndex: number, row: Record<string, unknown>) {
    if (enterTimer) { clearTimeout(enterTimer); enterTimer = null }
    leaveTimer = setTimeout(() => {
      hoverRowGroup.value = null
      emit('row-mouseleave', row, rowIndex)
    }, DEBOUNCE_DELAY)
  }

  function onScroll(e: Event) {
    const target = e.target as HTMLElement
    scrollLeft.value = target.scrollLeft
    if (tableScrollTimer) clearTimeout(tableScrollTimer)
    tableScrollTimer = setTimeout(() => {
      emit('scroll', e)
    }, SCROLL_EMIT_DELAY)
  }

  function clearAllTimers() {
    if (clickTimer) clearTimeout(clickTimer)
    if (cellClickTimer) clearTimeout(cellClickTimer)
    if (cellEnterTimer) clearTimeout(cellEnterTimer)
    if (cellLeaveTimer) clearTimeout(cellLeaveTimer)
    if (enterTimer) clearTimeout(enterTimer)
    if (leaveTimer) clearTimeout(leaveTimer)
    if (tableScrollTimer) clearTimeout(tableScrollTimer)
  }

  onBeforeUnmount(clearAllTimers)

  return {
    hoverRowGroup,
    scrollLeft,
    onRowClick,
    onCellClick,
    onCellMouseEnter,
    onCellMouseLeave,
    handleRowMouseEnter,
    handleRowMouseLeave,
    onScroll,
    clearAllTimers,
  }
}
