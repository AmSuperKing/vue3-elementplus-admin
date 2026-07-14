// useTableStyles.ts
import { computed, type Ref } from 'vue'
import type { CSSProperties } from 'vue'
import type {  MultiTableProps, FlatColumn, HeaderRow, LeafColumn, ExpandedRow } from '../types'
import { hexToRgba, rgbaToHex6 } from '../colorUtils'

export function useTableStyles(
  props: MultiTableProps,
  leafColumns: Ref<LeafColumn[]>,
  leftFixedLeaves: Ref<LeafColumn[]>,
  rightFixedLeaves: Ref<LeafColumn[]>,
  totalWidth: Ref<number>,
  containerRef: Ref<HTMLElement | undefined>,
  scrollLeft: Ref<number>,
  getEffectiveWidth: (dataIndex: string, defaultWidth: number) => number,
  getLeftOffset: (dataIndex: string) => number
) {
  const tableConfigStyle = computed(() => {
    const style: Record<string, string> = {}
    if (props.theme) {
      style['--table-primary-color'] = props.theme
      style['--table-selector-checked-color'] = props.theme
      style['--table-selector-color'] = props.theme
      style['--table-selector-border-color'] = props.theme
      style['--table-th-resizing-color'] = props.theme
    }
    const themeAlphaColor = props.theme ? rgbaToHex6(hexToRgba(props.theme, 0.055)) : ''
    const applyStyle = (cssVar: string, propValue: string | undefined, fallbackValue: string = themeAlphaColor) => {
      const value = propValue || fallbackValue
      if (value) style[cssVar] = value
    }
    applyStyle('--table-header-bg', props.headerRowBg)
    applyStyle('--table-header-cell-bg', props.headerCellBg)
    applyStyle('--table-selector-color', props.selectorColor)
    applyStyle('--table-row-stripe-color', props.stripeColor)
    applyStyle('--table-row-hover-bg', props.rowHoverBg)
    applyStyle('--table-row-selected-bg', props.highlightSlectedRow ? props.highlightSlectedColor : undefined)

    if (props.height) style['--table-container-height'] = typeof props.height === 'number' ? `${props.height}px` : props.height
    if (props.maxHeight) style['--table-container-max-height'] = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
    if (props.borderColor) style['--table-border-color'] = props.borderColor
    if (props.fixedColumnBg) style['--table-fixed-column-bg'] = props.fixedColumnBg
    if (props.clickRowToSelect) style['--table-row-cursor'] = 'pointer'
    if (props.selectorBorderColor) style['--table-selector-border-color'] = props.selectorBorderColor
    if (!props.border) style.border = 'none'

    if (!props.cellTextEllipsis) {
      style['--cell-overflow'] = 'inherit'
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

  const leftFixedWidth = computed(() =>
    leftFixedLeaves.value.reduce((sum, col) => sum + getEffectiveWidth(col.dataIndex, col.width ?? 120), 0)
  )

  const rightFixedWidth = computed(() =>
    rightFixedLeaves.value.reduce((sum, col) => sum + getEffectiveWidth(col.dataIndex, col.width ?? 120), 0)
  )

  const scrollbarWidth = computed(() => {
    if (!containerRef.value) return 0
    void totalWidth.value
    void props.data?.length
    return containerRef.value.offsetWidth - containerRef.value.clientWidth
  })

  const hasRightScroll = computed(() => {
    if (!containerRef.value) return false
    const el = containerRef.value
    void totalWidth.value
    return el.scrollWidth - scrollLeft.value - el.clientWidth > 1
  })

  function getHeaderCellStyle(cell: FlatColumn, cellIndex: number, row: HeaderRow, rowIndex: number, rows: HeaderRow[]) {
    const style: Record<string, string> = { textAlign: cell.align || 'left' }
    if (!props.border) { style.borderRight = 'none'; style.borderBottom = 'none' }
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
          if (c.fixed === 'right') offset += getEffectiveWidth(c.dataIndex, c.width ?? 120)
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
      if (Object.prototype.toString.call(props.headerCellStyle) === '[object Object]') {
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
    if (!props.border) { style.borderRight = 'none'; style.borderBottom = 'none' }
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
          if (c.fixed === 'right') offset += getEffectiveWidth(c.dataIndex, c.width ?? 120)
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
      if (Object.prototype.toString.call(props.rowCellStyle) === '[object Object]') {
        userConfigCellStyle = props.rowCellStyle as CSSProperties
      }
    }
    return { ...style, ...userConfigCellStyle }
  }

  return {
    tableConfigStyle,
    leftFixedWidth,
    rightFixedWidth,
    scrollbarWidth,
    hasRightScroll,
    getHeaderCellStyle,
    getCellStyle,
  }
}
