import type { CSSProperties, Ref } from 'vue'

export interface MultiTableProps {
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
  summaryMethod?: (leafColumns: LeafColumn[], expandedRows: ExpandedRow[]) => Record<string, string | number>
  selectableProps?: (row: Record<string, unknown>) => boolean
  cellTextEllipsis?: boolean
}

export type SortOrder = 'asc' | 'desc' | null

export interface MultiTableEvent {
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
  (e: 'sort-change', dataIndex: string, order: SortOrder): void
}

export interface ColumnConfig {
  dataIndex: string
  title: string
  width?: number
  fixed?: 'left' | 'right'
  resizable?: boolean
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  children?: ColumnConfig[]
}

export interface FlatColumn extends ColumnConfig {
  _depth: number
  _colSpan: number
  _rowSpan: number
  _isLeaf: boolean
  _path: string[]
  _realWidth: number
  _isSelection?: boolean // 标记是否为选择列
  _isDataIndex?: boolean
  _parentDataIndex?: string // 父列的 dataIndex（用于子列值解析）
}

/** 叶子列（含父列信息） */
export interface LeafColumn extends ColumnConfig {
  _parentDataIndex?: string
}

export interface IndexColumnConfig {
  showIndex: Ref<boolean>
  indexColumnWidth: Ref<number>
}

export interface HeaderRow {
  cells: FlatColumn[]
}

export interface ExpandedRow {
  groupKey: string | number
  originalRow: Record<string, unknown>
  originalIndex: number
  subRowIndex: number
  totalSubRows: number
  subRowDataMap: Record<string, Record<string, unknown> | undefined>
}
