export interface ColumnConfig {
  dataIndex: string
  title: string
  width?: number
  fixed?: 'left' | 'right'
  resizable?: boolean
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
  _parentDataIndex?: string // 父列的 dataIndex（用于子列值解析）
}

/** 叶子列（含父列信息） */
export interface LeafColumn extends ColumnConfig {
  _parentDataIndex?: string
}

export interface HeaderRow {
  cells: FlatColumn[]
}
