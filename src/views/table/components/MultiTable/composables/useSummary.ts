// useSummary.ts
import { computed, type Ref } from 'vue'
import type { LeafColumn, ExpandedRow, MultiTableProps } from '../types'

/**
 * 尝试将原始单元格值解析为数字。
 * 支持：Number；纯数字字符串；带千分位（如 "128,000.00"）；带负号；小数。
 * 无法解析时返回 null。
 */
function parseNumeric(raw: unknown): { num: number; precision: number; hasThousandsSep: boolean } | null {
  if (raw === null || raw === undefined || raw === '') return null
  if (typeof raw === 'number') {
    if (!isFinite(raw)) return null
    const str = String(raw)
    const dot = str.indexOf('.')
    return { num: raw, precision: dot === -1 ? 0 : str.length - dot - 1, hasThousandsSep: false }
  }
  if (typeof raw !== 'string') return null
  const str = raw.trim()
  if (!str || str === '-') return null
  const hasThousandsSep = /,/.test(str)
  const normalized = str.replace(/,/g, '')
  if (!/^[+-]?\d+(\.\d+)?$/.test(normalized)) return null
  const num = Number(normalized)
  if (!isFinite(num)) return null
  const dot = normalized.indexOf('.')
  const precision = dot === -1 ? 0 : normalized.length - dot - 1
  return { num, precision, hasThousandsSep }
}

function formatSum(sum: number, precision: number, hasThousandsSep: boolean): string {
  const fixed = sum.toFixed(precision)
  if (!hasThousandsSep) return fixed
  const [intPart, decPart] = fixed.split('.')
  // 处理负号
  const sign = intPart!.startsWith('-') ? '-' : ''
  const digits = sign ? intPart!.slice(1) : intPart!
  const withSep = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart ? `${sign}${withSep}.${decPart}` : `${sign}${withSep}`
}

/**
 * 生成 summary 行内容。规则：
 *  - selection / index 列：留空。
 *  - 首个可用列：显示 label（props.summary，默认 "合计"）。
 *  - 其余列：所有值均能解析为数字则求和输出，否则留空。
 *  - 数值格式（小数位、千分位）继承源数据中的最大精度与格式。
 *  - 使用 shouldRenderCell 判断哪些行参与计算（避免非数组父列的子行重复计入）。
 *  - 若外部提供了 summaryMethod，则完全按用户返回结果渲染。
 */
export function useSummary(
  props: MultiTableProps,
  leafColumns: Ref<LeafColumn[]>,
  expandedRows: Ref<ExpandedRow[]>,
  resolveCellValue: (row: ExpandedRow, col: LeafColumn) => unknown,
  shouldRenderCell: (col: LeafColumn, row: ExpandedRow) => boolean
) {
  const summaryCells = computed<Record<string, string>>(() => {
    const result: Record<string, string> = {}

    // 1) 用户自定义 summaryMethod 优先
    if (typeof props.summaryMethod === 'function') {
      const custom = props.summaryMethod(leafColumns.value, expandedRows.value) || {}
      for (const col of leafColumns.value) {
        const v = custom[col.dataIndex]
        result[col.dataIndex] = v === undefined || v === null ? '' : String(v)
      }
      return result
    }

    // 2) 默认：首列展示 label，其它列自动求和
    // let labelPlaced = false
    for (const col of leafColumns.value) {
      if (col.dataIndex === '__selection__' || col.dataIndex === '__index__') {
        result[col.dataIndex] = ''
        continue
      }
      // if (!labelPlaced) {
      //   result[col.dataIndex] = props.summary ?? '合计'
      //   labelPlaced = true
      //   continue
      // }

      let sum = 0
      let hasValue = false
      let allNumeric = true
      let maxPrecision = 0
      let anyThousandsSep = false

      for (const row of expandedRows.value) {
        if (!shouldRenderCell(col, row)) continue
        const raw = resolveCellValue(row, col)
        if (raw === null || raw === undefined || raw === '' || raw === '-') continue
        const parsed = parseNumeric(raw)
        if (parsed === null) {
          allNumeric = false
          break
        }
        hasValue = true
        sum += parsed.num
        if (parsed.precision > maxPrecision) maxPrecision = parsed.precision
        if (parsed.hasThousandsSep) anyThousandsSep = true
      }

      result[col.dataIndex] = hasValue && allNumeric ? formatSum(sum, maxPrecision, anyThousandsSep) : ''
    }

    let firstColKey = null;
    const resultKeys = Object.keys(result)
    for (const key of resultKeys) {
      if (key !== '__selection__' && key !== '__index__') {
        firstColKey = key
        break
      }
    }
    if (firstColKey) {
      // 判断第一个 key 的值是否为"空值"
      const isEmpty = result[firstColKey] === null || result[firstColKey] === undefined || result[firstColKey] === ''
      if (isEmpty) {
        result[firstColKey] = props.summary ?? '合计';
      }
    }
    return result
  })

  return { summaryCells }
}
