// useSort.ts
import { ref } from 'vue'
import type { MultiTableEvent, SortOrder } from '../types'

/**
 * 每列排序状态独立管理：
 *  - 首次单击 -> asc
 *  - 二次单击 -> desc
 *  - 三次单击 -> null（回到默认状态）
 * 每次状态变化都会通过 sort-change 事件抛出 (dataIndex, order)。
 * 点击某一列不会重置其他列的排序状态。
 */
export function useSort(emit: MultiTableEvent) {
  const sortStates = ref<Record<string, SortOrder>>({})

  function getSortOrder(dataIndex: string): SortOrder {
    return sortStates.value[dataIndex] ?? null
  }

  function toggleSort(dataIndex: string) {
    const current = getSortOrder(dataIndex)
    let next: SortOrder
    if (current === null) next = 'asc'
    else if (current === 'asc') next = 'desc'
    else next = null

    const nextState = { ...sortStates.value }
    if (next === null) {
      delete nextState[dataIndex]
    } else {
      nextState[dataIndex] = next
    }
    sortStates.value = nextState
    emit('sort-change', dataIndex, next)
  }

  function clearSort(dataIndex?: string) {
    if (dataIndex) {
      if (!(dataIndex in sortStates.value)) return
      const next = { ...sortStates.value }
      delete next[dataIndex]
      sortStates.value = next
    } else {
      sortStates.value = {}
    }
  }

  return {
    sortStates,
    getSortOrder,
    toggleSort,
    clearSort,
  }
}
