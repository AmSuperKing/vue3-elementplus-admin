import { computed, type Ref } from 'vue'
import type { ColumnConfig, FlatColumn, HeaderRow, LeafColumn, IndexColumnConfig } from './types'

// 获取嵌套最大深度
function getMaxDepth(columns: ColumnConfig[]): number {
  let max = 1
  for (const col of columns) {
    if (col.children && col.children.length > 0) {
      const childDepth = 1 + getMaxDepth(col.children)
      if (childDepth > max) max = childDepth
    }
  }
  return max
}

// 获取列的叶子数量
function getLeafCount(col: ColumnConfig): number {
  if (!col.children || col.children.length === 0) return 1
  return col.children.reduce((sum, child) => sum + getLeafCount(child), 0)
}

// 构建表头行
function buildHeaderRows(
  columns: ColumnConfig[],
  maxDepth: number,
  widthOverrides: Ref<Record<string, number>>
): HeaderRow[] {
  const rows: HeaderRow[] = Array.from({ length: maxDepth }, () => ({ cells: [] }))

  function traverse(cols: ColumnConfig[], depth: number, path: string[]) {
    for (const col of cols) {
      const currentPath = [...path, col.dataIndex]
      const isLeaf = !col.children || col.children.length === 0
      const colSpan = isLeaf ? 1 : getLeafCount(col)
      const rowSpan = isLeaf ? maxDepth - depth : 1

      const flatCol: FlatColumn = {
        ...col,
        _depth: depth,
        _colSpan: colSpan,
        _rowSpan: rowSpan,
        _isLeaf: isLeaf,
        _path: currentPath,
        _realWidth: widthOverrides.value[col.dataIndex] ?? col.width ?? 120,
        _isSelection: col.dataIndex === '__selection__',
        _isDataIndex: col.dataIndex === '__index__',
        _parentDataIndex: path.length > 0 ? path[path.length - 1] : undefined,
      }

      rows[depth]!.cells.push(flatCol)

      if (!isLeaf && col.children) {
        traverse(col.children, depth + 1, currentPath)
      }
    }
  }

  traverse(columns, 0, [])
  return rows
}

// 获取叶子列
function getLeafColumns(columns: ColumnConfig[]): LeafColumn[] {
  const leaves: LeafColumn[] = []
  function traverse(cols: ColumnConfig[], parentDataIndex?: string) {
    for (const col of cols) {
      if (!col.children || col.children.length === 0) {
        leaves.push({ ...col, _parentDataIndex: parentDataIndex })
      } else {
        traverse(col.children, col.dataIndex)
      }
    }
  }
  traverse(columns)
  return leaves
}
export function useColumns(
  columns: Ref<ColumnConfig[]>,
  widthOverrides: Ref<Record<string, number>>,
  selectable: Ref<boolean>,
  indexColumnConfig: IndexColumnConfig
) {
  // 动态注入选择列
  const actualColumns = computed(() => {
    const cols = [...columns.value]
    if (indexColumnConfig.showIndex.value) {
      cols.unshift({
        dataIndex: '__index__',
        title: '序号',
        width: indexColumnConfig.indexColumnWidth.value || 80,
        fixed: 'left',
        align: 'center',
      })
    }
    if (selectable.value) {
      cols.unshift({
        dataIndex: '__selection__',
        title: '',
        width: 50,
        fixed: 'left',
        align: 'center',
      })
    }
    return cols
  })
  const maxDepth = computed(() => getMaxDepth(actualColumns.value))

  const headerRows = computed(() =>
    buildHeaderRows(actualColumns.value, maxDepth.value, widthOverrides)
  )

  const leafColumns = computed(() => getLeafColumns(actualColumns.value))

  const getColWidth = (col: ColumnConfig) => {
    return widthOverrides.value[col.dataIndex] ?? col.width ?? 120
  }

  const totalWidth = computed(() => {
    return leafColumns.value.reduce((sum, col) => sum + getColWidth(col), 0)
  })

  const leftFixedLeaves = computed(() =>
    leafColumns.value.filter((c) => c.fixed === 'left')
  )
  const rightFixedLeaves = computed(() =>
    leafColumns.value.filter((c) => c.fixed === 'right')
  )
  const normalLeaves = computed(() =>
    leafColumns.value.filter((c) => !c.fixed)
  )

  const lastColumnKey = computed(() => {
    const allLeaves = leafColumns.value

    // 1. 优先检查右侧固定列（视觉上最右边）
    const rightFixed = rightFixedLeaves.value
    if (rightFixed.length > 0) {
      // 右侧固定列按渲染顺序从右到左排列，最后一个才是视觉最右侧
      return rightFixed[rightFixed.length - 1]!.dataIndex
    }

    // 2. 没有右侧固定列时，检查非固定列区域
    const normal = normalLeaves.value
    if (normal.length > 0) {
      // 非固定列区域的最后一个就是整个表格的最后一列
      return normal[normal.length - 1]!.dataIndex
    }

    // 3. 极端情况：只有左侧固定列（理论上不会发生，但安全处理）
    const leftFixed = leftFixedLeaves.value
    if (leftFixed.length > 0) {
      return leftFixed[leftFixed.length - 1]!.dataIndex
    }

    // 4. 安全兜底（至少有一列）
    return allLeaves[allLeaves.length - 1]?.dataIndex ?? null
  })

  const getLeftOffset = (dataIndex: string): number => {
    const idx = leafColumns.value.findIndex((c) => c.dataIndex === dataIndex)
    let offset = 0
    for (let i = 0; i < idx; i++) {
      const c = leafColumns.value[i]!
      if (c.fixed === 'left') {
        offset += getColWidth(c)
      }
    }
    return offset
  }

  const getRightOffset = (dataIndex: string): number => {
    const idx = leafColumns.value.findIndex((c) => c.dataIndex === dataIndex)
    let offset = 0
    for (let i = leafColumns.value.length - 1; i > idx; i--) {
      const c = leafColumns.value[i]!
      if (c.fixed === 'right') {
        offset += getColWidth(c)
      }
    }
    return offset
  }

  return {
    maxDepth, // 列最大深度
    headerRows, // 表头行
    leafColumns, // 叶子列
    totalWidth, // 总宽度
    leftFixedLeaves, // 左侧固定列
    rightFixedLeaves, // 右侧固定列
    normalLeaves, // 非固定列
    lastColumnKey, // 最后一列的 dataIndex
    getColWidth, // 获取列宽度
    getLeftOffset, // 获取列左侧偏移
    getRightOffset, // 获取列右侧偏移
  }
}
