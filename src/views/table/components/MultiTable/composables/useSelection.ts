// useSelection.ts
import { computed, type Ref } from 'vue'
import type { MultiTableProps, MultiTableEvent } from '../types'

export function useSelection(
  tableData: Ref<Record<string, unknown>[]>,
  props: MultiTableProps,
  emit: MultiTableEvent
) {
  const selectedKeys = computed(() => props.selectedRowKeys || [])

  const getRowKey = (row: Record<string, unknown>) => row[props.rowKey as unknown as string | number] as string | number

  const isSelected = (row: Record<string, unknown>) => {
    return selectedKeys.value.includes(getRowKey(row))
  }

  const isAllSelected = computed(() => {
    if (tableData.value.length === 0) return false
    const selectableRows = tableData.value.filter((row) => {
      return !props.selectableProps || !props.selectableProps(row)
    })
    if (selectableRows.length === 0) return true
    return selectableRows.every((row) => selectedKeys.value.includes(getRowKey(row)))
  })

  const isIndeterminate = computed(() => {
    const selectableRows = tableData.value.filter((row) => {
      return !props.selectableProps || !props.selectableProps(row)
    })
    const selectedCount = selectableRows.filter((row) =>
      selectedKeys.value.includes(getRowKey(row))
    ).length
    return selectedCount > 0 && selectedCount < selectableRows.length
  })

  function toggleSelection(row: Record<string, unknown>) {
    if (props.selectableProps && props.selectableProps(row)) return

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
    emit('select', row)
    emitUpdate(newKeys)
  }

  function toggleSelectAll() {
    const selectableKeys = tableData.value
      .filter((row) => !props.selectableProps || !props.selectableProps(row))
      .map((row) => getRowKey(row))

    const newKeys = isAllSelected.value
      ? selectedKeys.value.filter(key => !selectableKeys.includes(key))
      : [...new Set([...selectedKeys.value, ...selectableKeys])]

    const selectedRows = tableData.value.filter((row) => newKeys.includes(getRowKey(row)))
    emit('select-all', selectedRows)
    emitUpdate(newKeys)
  }

  function emitUpdate(newKeys: (string | number)[]) {
    emit('update:selectedRowKeys', newKeys)
    const selectedRows = tableData.value.filter((row) => newKeys.includes(getRowKey(row)))
    emit('selection-change', selectedRows, newKeys)
  }

  function getSelectionRows(): Record<string, unknown>[] {
    return tableData.value.filter((row) => selectedKeys.value.includes(getRowKey(row)))
  }

  function getHalfSelectionRows(): Record<string, unknown>[] {
    if (props.selectMode !== 'checkbox') return []
    if (!isIndeterminate.value) return []
    return getSelectionRows()
  }

  function toggleRowSelection(row: Record<string, unknown>, selected?: boolean): void {
    if (!row || !props.selectable) return
    if (props.selectableProps && props.selectableProps(row)) return

    const key = getRowKey(row)
    const currentSelected = selectedKeys.value.includes(key)
    const targetState = selected !== undefined ? selected : !currentSelected
    if (targetState === currentSelected) return

    let newKeys: (string | number)[]
    if (props.selectMode === 'radio') {
      newKeys = targetState ? [key] : []
    } else {
      newKeys = targetState
        ? [...selectedKeys.value, key]
        : selectedKeys.value.filter((k) => k !== key)
    }
    emitUpdate(newKeys)
  }

  function setCurrentRow(row?: Record<string, unknown>): void {
    if (props.selectMode !== 'radio') {
      console.warn('[MultiTable] setCurrentRow is only available in radio select mode.')
      return
    }
    if (!row) {
      emitUpdate([])
      return
    }
    if (props.selectableProps && props.selectableProps(row)) return
    const key = getRowKey(row)
    if (!selectedKeys.value.includes(key)) {
      emitUpdate([key])
    }
  }

  return {
    selectedKeys,
    getRowKey,
    isSelected,
    isAllSelected,
    isIndeterminate,
    toggleSelection,
    toggleSelectAll,
    getSelectionRows,
    getHalfSelectionRows,
    toggleRowSelection,
    setCurrentRow,
    clearSelection: () => emitUpdate([]),
  }
}
