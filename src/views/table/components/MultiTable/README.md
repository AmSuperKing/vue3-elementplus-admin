# MultiTable 组件文档

`MultiTable` 是一个功能丰富的高性能 Vue3 表格组件，支持多级表头、列拖拽、固定列、行选择（单选/多选）、子行展开、自定义样式及主题色等特性。

[MultiTable源码](https://github.com/AmSuperKing/vue3-elementplus-admin/tree/main/src/views/table/components/MultiTable)

## 📦 TypeScript 类型定义

在使用组件前，建议导入以下类型以获得完整的智能提示：

### ColumnConfig (列配置)
```ts
interface ColumnConfig {
  dataIndex: string;      // 字段名，唯一标识
  title: string;          // 表头标题
  width?: number;         // 列宽（默认 120）
  fixed?: 'left' | 'right'; // 固定位置
  resizable?: boolean;    // 是否允许拖拽调整宽度
  sortable?: boolean;     // 是否开启排序（仅对叶子列生效）
  align?: 'left' | 'center' | 'right'; // 对齐方式
  children?: ColumnConfig[]; // 子列配置（用于多级表头）
}
```

### SortOrder (排序方向)
```ts
type SortOrder = 'asc' | 'desc' | null
```

### FlatColumn (内部扁平化列)
组件内部将嵌套列扁平化处理后的结构，包含布局计算属性：
```ts
interface FlatColumn extends ColumnConfig {
  _depth: number;         // 层级深度
  _colSpan: number;       // 跨列数
  _rowSpan: number;       // 跨行数
  _isLeaf: boolean;       // 是否为叶子节点
  _path: string[];        // 路径索引
  _realWidth: number;     // 实际渲染宽度（含拖拽覆盖值）
  _isSelection?: boolean; // 是否为选择列
  _isDataIndex?: boolean; // 是否为序号列
  _parentDataIndex?: string; // 父列 dataIndex
}
```

### LeafColumn & HeaderRow
- `LeafColumn`: 继承自 `ColumnConfig`，额外包含 `_parentDataIndex` 用于子列值解析。
- `HeaderRow: { cells: FlatColumn[] }` 表头行数据结构。



------



## ⚙️ Props 属性配置

| 属性名                       | 类型                              | 默认值      | 说明                                    |
| ---------------------------- | --------------------------------- | ----------- | --------------------------------------- |
| `columns`                    | `ColumnConfig[]`                  | -           | 必填，表格列配置                        |
| `data`                       | `Record<string, unknown>[]`       | -           | 必填，表格数据源                        |
| `rowKey`                     | `string`                          | `'id'`      | 行数据的唯一键字段名                    |
| `height`                     | `number | string`                 | -           | 表格固定高度                            |
| `maxHeight`                  | `number | string`                 | -           | 表格最大高度（默认 CSS 600px）          |
| `size`                       | `'small' | 'default' | 'large'`   | `'default'` | 表格尺寸                                |
| `stripe`                     | `boolean`                         | `true`      | 是否显示斑马纹                          |
| `stripeColor`                | `string`                          | -           | 斑马纹颜色                              |
| `border`                     | `boolean`                         | `true`      | 是否显示边框                            |
| `showHeader`                 | `boolean`                         | `true`      | 是否显示表头                            |
| `theme`                      | `string`                          | -           | 主题色（HEX），自动派生选中色、边框色等 |
| `headerRowBg`                | `string`                          | -           | 表头行背景色                            |
| `headerCellBg`               | `string`                          | -           | 表头单元格背景色                        |
| `borderColor`                | `string`                          | -           | 边框颜色                                |
| `fixedColumnBg`              | `string`                          | -           | 固定列背景色                            |
| `rowHoverBg`                 | `string`                          | -           | 行悬停背景色                            |
| `highlightSlectedRow`        | `boolean`                         | -           | 是否高亮选中行                          |
| `highlightSlectedColor`      | `string`                          | -           | 选中行高亮颜色                          |
| `selectorColor`              | `string`                          | -           | 选择器未选中时颜色                      |
| `selectorBorderColor`        | `string`                          | -           | 选择器边框颜色                          |
| `selectorCheckedColor`       | `string`                          | -           | 选择器选中颜色                          |
| `selectable`                 | `boolean`                         | `false`     | 是否开启选择功能                        |
| `selectMode`                 | `'radio' | 'checkbox'`            | `'radio'`   | 选择模式                                |
| `selectedRowKeys`            | `(string | number)[]`             | `[]`        | 已选行的 Key 列表（v-model）            |
| `clickRowToSelect`           | `boolean`                         | `false`     | 点击行是否触发选择                      |
| `selectableProps`            | `(row) => boolean`                | -           | 返回 true 表示该行禁止选择              |
| `showIndex`                  | `boolean`                         | `false`     | 是否显示序号列                          |
| `indexColumnWidth`           | `number`                          | `80`        | 序号列宽度                              |
| `rowIndexFormat`             | `(index, row) => string | number` | -           | 自定义序号格式化                        |
| `showSummary`                | `boolean`                         | -           | 是否显示总结行                            |
| `summary`                    | `string`                          | -           | 总结行首列的标签文本（默认合计）    |
| `summaryFitTableContentWidth` | `boolean`                         | `false`     | 总结行自定义 slot 是否跟随表格内容宽度 |
| `summaryMethod`              | `(leaf, rows) => Record`          | -           | 自定义总结计算：返回 dataIndex → 值 |
| `headerRowClassName`         | `string | Function`               | -           | 表头行自定义类名                        |
| `headerRowStyle`             | `CSSProperties | Function`        | -           | 表头行自定义样式                        |
| `headerCellClassName`        | `string | Function`               | -           | 表头单元格自定义类名                    |
| `headerCellStyle`            | `CSSProperties | Function`        | -           | 表头单元格自定义样式                    |
| `rowClassName`               | `string | Function`               | -           | 数据行自定义类名                        |
| `rowStyle`                   | `CSSProperties | Function`        | -           | 数据行自定义样式                        |
| `rowCellClassName`           | `string | Function`               | -           | 数据单元格自定义类名                    |
| `rowCellStyle`               | `CSSProperties | Function`        | -           | 数据单元格自定义样式                    |
| `cellTextEllipsis`           | `boolean`                         | `true`      | 单元格文字是否溢出自动省略              |

> 💡 **样式函数签名示例：**
> `headerCellStyle: (cell: FlatColumn, cellIndex: number, row: HeaderRow, rowIndex: number, rows: HeaderRow[]) => CSSProperties`
> `rowClassName: (row: Record, rowIndex: number, expandedRow: ExpandedRow, expandedRows: ExpandedRow[]) => string`



------



## 📡 Emit 事件

| 事件名                   | 参数                              | 说明                         |
| ------------------------ | --------------------------------- | ---------------------------- |
| `update:selectedRowKeys` | `(keys: (string | number)[])`     | 选中键更新（支持 v-model）   |
| `selection-change`       | `(selectedRows, selectedRowKeys)` | 选中状态变化                 |
| `select`                 | `(selectedRow)`                   | 单行选中/取消时触发          |
| `select-all`             | `(selectedRows)`                  | 全选/取消全选时触发          |
| `row-click`              | `(row, rowIndex)`                 | 行单击（300ms 防抖区分双击） |
| `row-dblclick`           | `(row, rowIndex)`                 | 行双击                       |
| `row-mouseenter`         | `(row, rowIndex)`                 | 鼠标进入行（100ms 防抖）     |
| `row-mouseleave`         | `(row, rowIndex)`                 | 鼠标离开行（100ms 防抖）     |
| `cell-click`             | `(cellInfo, row)`                 | 单元格单击                   |
| `cell-dblclick`          | `(cellInfo, row)`                 | 单元格双击                   |
| `cell-mouseenter`        | `(cellInfo, row)`                 | 鼠标进入单元格               |
| `cell-mouseleave`        | `(cellInfo, row)`                 | 鼠标离开单元格               |
| `scroll`                 | `(event: Event)`                  | 表格滚动（100ms 节流）       |
| `sort-change`            | `(dataIndex, order)`              | 排序变更（order: 'asc' \| 'desc' \| null） |

> **cellInfo 结构**: `{ column: LeafColumn, value: unknown, dataIndex: string, rowIndex: number }`



------



## 🔧 Expose 方法

通过 `ref` 获取组件实例后可调用以下方法：

| 方法名                 | 参数                        | 返回值        | 说明                                                         |
| ---------------------- | --------------------------- | ------------- | ------------------------------------------------------------ |
| `getSelectionRows`     | -                           | `Record[]`    | 获取当前所有选中行数据                                       |
| `getHalfSelectionRows` | -                           | `Record[]`    | 获取半选状态相关行（仅 checkbox 模式）                       |
| `toggleRowSelection`   | `(row, selected?)`          | `void`        | 切换指定行选中状态，不传 selected 则 toggle                  |
| `setCurrentRow`        | `(row?)`                    | `void`        | 设置当前行（仅 radio 模式），不传则清空                      |
| `clearSelection`       | -                           | `void`        | 清空所有选中                                                 |
| `toggleSelectAll`      | -                           | `void`        | 手动触发全选/取消全选                                        |
| `scrollTo`             | `({ top?, left? })`         | `void`        | 平滑滚动到指定位置                                           |
| `setScrollTop`         | `(top: number)`             | `void`        | 设置垂直滚动位置                                             |
| `setScrollLeft`        | `(left: number)`            | `void`        | 设置水平滚动位置并同步阴影状态                               |
| `getEffectiveWidth`    | `(dataIndex, defaultWidth)` | `number`      | 获取列的实际宽度（含拖拽覆盖）                               |
| `widthOverrides`       | -                           | `Ref<Record>` | 列宽拖拽覆盖值的响应式对象                                   |
| `tableContext`         | -                           | `Object`      | 暴露内部表格上下文（headerRows, leafColumns, totalWidth 等） |
| `getSortOrder`         | `(dataIndex)`               | `SortOrder`   | 获取指定列当前排序状态                              |
| `toggleSort`           | `(dataIndex)`               | `void`        | 手动切换指定列的排序状态 (null->asc->desc->null)      |
| `clearSort`            | `(dataIndex?)`              | `void`        | 清除指定列或所有列的排序状态                        |
| `sortStates`           | -                           | `Ref<Record>` | 当前所有列的排序状态                                |
| `summaryCells`         | -                           | `Ref<Record>` | 当前总结行各列的实际文本                          |

### 使用示例

```vue
<template>
  <MultiTable ref="tableRef" :columns="columns" :data="data" />
  <button @click="handleClear">清空选择</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const tableRef = ref()

function handleClear() {
  tableRef.value?.clearSelection()
}

function getSelected() {
  const rows = tableRef.value?.getSelectionRows()
  console.log(rows)
}
</script>
```



------



## 🎨 Slots 插槽

| 插槽名                       | 作用域参数                      | 说明                                            |
| ---------------------------- | ------------------------------- | ----------------------------------------------- |
| `header`                     | -                               | 表格顶部区域                                    |
| `footer`                     | -                               | 表格底部区域                                    |
| `empty`                      | -                               | 空数据占位                                      |
| `summary`                    | -                               | 自定义总结行内容                                |
| `index`                      | `{ row, index }`                | 自定义序号列内容                                |
| `header-data-index`          | -                               | 自定义序号列表头                                |
| `header_${dataIndex}`        | `{ column, row, depth, index }` | 自定义表头内容（多级表头格式为 `parent_child`） |
| `cell_${dataIndex}`          | `{ row, column, value, index }` | 自定义单元格内容                                |
| `cell_${dataIndex}_${field}` | `{ value, row }`                | 对象值字段的自定义渲染                          |
| `summary_${dataIndex}`       | `{ column, value }`             | 总结行指定列的自定义内容                        |



------



## 📝 注意事项

1. 子行展开：当 `columns` 中配置了 `children` 且对应数据为数组时，组件自动将该行展开为多行子行展示（折叠行数据渲染）。
2. 属性数据渲染：当 `columns` 中配置了 `children` 且对应数据为普通对象时，各子列从父对象上读取同名属性。以上两种方式可以共存。
3. 列拖拽：需在列配置中设置 `resizable: true`，最小拖拽宽度为 `50px`。
4. 排序：在叶子列配置中设置 `sortable: true`，表头会出现双三角图标。点击顺序：`null → asc → desc → null`。各列排序状态相互独立互不影响，仅将当前变化列通过 `sort-change` 事件抛出（一般交给服务端处理排序）。
5. 总结行：`showSummary` 开启后默认以 `<tfoot>` 形式列对齐渲染，sticky 底部。首列展示 `summary` label，其余各列自动求和（支持千分位/小数/负号），非数字列自动留空；可通过 `summary_${dataIndex}` 插槽覆盖单列，或使用 `summaryMethod` 接管全部计算；传入 `#summary` slot 则回退为旧版单行横向内容（兼容）。
6. 防抖机制：行/单元格的 `click`、`mouseenter`、`mouseleave` 及 `scroll` 事件均内置防抖/节流，避免高频触发。
7. 主题色：设置 `theme` 后会自动生成 **5.5%** 透明度的衍生色作为默认背景，各独立颜色属性优先级高于主题色。
8. Radio name 唯一性：组件内部使用 `useId()` 生成唯一 ID，确保多实例共存时 radio 互不干扰。
9. 当前表格组件原理是对数据进行展开拓屏达到渲染多维嵌套数据的效果，本质还是`table`的`rowspan`和`colspan`处理。未实现节点懒加载与大数据量的虚拟滚动。



------



## 组件使用示例

```vue
<!-- TableExample.vue -->
<template>
  <div id="app" style="padding: 20px;">
    <h2>📊 多维表格组件示例</h2>

    <!-- 控制面板 -->
    <div style="margin-bottom: 16px; display: flex; gap: 16px; align-items: center;">
      <label>
        <input type="checkbox" v-model="selectable" /> 开启选择列
      </label>
      <label v-if="selectable">
        <input type="radio" v-model="selectMode" value="radio" /> 单选
      </label>
      <label v-if="selectable">
        <input type="radio" v-model="selectMode" value="checkbox" /> 多选
      </label>
      <span v-if="selectable" style="color: #666;">
        已选中: {{ selectedRowKeys.length }} 条 (Keys: {{ selectedRowKeys.join(', ') }})
      </span>
      <button v-if="selectable" @click="selectedRowKeys = []" style="margin-left: auto;">
        清空选择
      </button>
    </div>

    <MultiTable
      :columns="columns"
      :data="tableData"
      :selectable="selectable"
      :selectMode="selectMode"
      headerCellBg="#ebfaf3"
      :stripe="false"
      click-row-to-select
      v-model:selectedRowKeys="selectedRowKeys"
      @selection-change="onSelectionChange"
      :selectable-props="(row: Record<string, unknown>) => { return row.id === 1 }"
      rowHoverBg="#fef2eb"
      theme="#26d97a"
      showSummary
      summary="合计"
      showIndex
      :rowIndexFormat="(index: number, row:Record<string, unknown>) => index"
      :headerRowStyle="(rowContextKey, idx) => { return {'--header-test': 'var(--test-class-info)'} }"
      :cell-text-ellipsis="false"
    >
      <template #header>表头插槽</template>
      <!-- 表头插槽 -->
      <template #header_purchaseNo="{ column }">
        <span style="color: #1890ff; font-weight: bold;">🔖 {{ column.title }}</span>
      </template>

      <template #header_operation="{ column }">
        <span style="color: #ff4d4f;">⚙️ {{ column.title }}</span>
      </template>

      <!-- 单元格插槽 -->
      <template #cell_purchaseNo="{ value, row }">
        <a href="javascript:;" style="color: #1890ff;" @click.stop="onPurchaseClick(row)">
          {{ value }}
        </a>
      </template>

      <template #cell_inDate="{ value }">
        <span style="color: #52c41a;">📅 {{ value }}</span>
      </template>

      <template #cell_goodPrice="{ value }">
        <span style="color: #f5222d; font-weight: bold;">¥ {{ Number(value).toFixed(2) }}</span>
      </template>

      <template #cell_goodGcoss="{ value }">
        <span :style="{ color: Number(value) >= 0 ? '#52c41a' : '#ff4d4f' }">
          {{ Number(value) >= 0 ? '+' : '' }}{{ value }}%
        </span>
      </template>

      <template #cell_name="{ value }">
        <div style="font-size: 12px; line-height: 1.6; color: red">
          <div>{{ value }}</div>
        </div>
      </template>

      <template #cell_commissionDetail_name="{ value }">
        <div style="font-size: 12px; line-height: 1.6; color: #52c41a">
          <div>{{ value }}</div>
        </div>
      </template>

      <template #cell_inputInvoiceStatusName="{ value }">
        <span :style="{
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          background: getStatusBg(value as string),
          color: getStatusColor(value as string),
        }">
          {{ value || '-' }}
        </span>
      </template>

      <template #cell_operation="{ row, index }">
        <div style="display: flex; gap: 8px; justify-content: center;">
          <button class="btn-link" @click.stop="onEdit(row as unknown as TableRow)">编辑</button>
          <button class="btn-link btn-danger" @click.stop="onDelete(row as unknown as TableRow, index)">删除</button>
        </div>
      </template>
    </MultiTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MultiTable from 'MultiTable'
import type { ColumnConfig } from 'MultiTable/types'

const selectable = ref(true)
const selectMode = ref<'radio' | 'checkbox'>('checkbox')
const selectedRowKeys = ref<(string | number)[]>([])

const columns: ColumnConfig[] = [
  { dataIndex: 'name', title: '名目', width: 100 },
  { dataIndex: 'purchaseNo', title: '采购单号', fixed: 'left', width: 150 },
  { dataIndex: 'inDate', title: '入库日期', width: 90, resizable: true },
  { dataIndex: 'supplierName', title: '供应商名称', width: 180, resizable: true },
  { dataIndex: 'orderSourceName', title: '采购订单来源', width: 90, resizable: true },
  { dataIndex: 'goodsSourceTypeName', title: '产品来源', width: 80, resizable: true },
  {
    dataIndex: 'goodsDetail',
    title: '产品信息',
    resizable: true,
    align: 'center',
    children: [
      { dataIndex: 'goodsSourceTypeName', title: '产品来源', resizable: true, align: 'center' },
      { dataIndex: 'goodNo', title: '产品编码', resizable: true },
      { dataIndex: 'goodArea', title: '销售城市', resizable: true },
      { dataIndex: 'goodPrice', title: '价格', resizable: true },
      { dataIndex: 'goodGcoss', title: '利润', resizable: true },
    ]
  },
  {
    dataIndex: 'commissionDetail',
    title: '业务费信息',
    width: 500,
    resizable: true,
    align: 'right',
    children: [
      { dataIndex: 'name', title: '费用名称', resizable: true, align: 'center' },
      { dataIndex: 'baseCommission', title: '基础费', resizable: true },
      { dataIndex: 'extraCommission', title: '提成费', resizable: true },
    ]
  },
  { dataIndex: 'totalGrossProfitAmount', title: '采购总毛利', width: 100, resizable: true },
  { dataIndex: 'salesmanName', title: '采购员', width: 80, resizable: true },
  { dataIndex: 'totalPurchaseAmount', title: '采购总金额', width: 80, resizable: true },
  { dataIndex: 'paidAmount', title: '已付金额', width: 80, resizable: true },
  { dataIndex: 'inputInvoiceStatusName', title: '进项票状态', width: 80, resizable: true },
  { dataIndex: 'inputInvoiceDate', title: '进项票日期', width: 120, resizable: true },
  { dataIndex: 'operation', title: '操作', fixed: 'right', width: 150, align: 'center' },
]

const tableData = ref<TableRow[]>([

])

const mockData = [
  {
    id: 1,
    name: '采购单',
    purchaseNo: 'PO20260001',
    inDate: '2026-06-01',
    supplierName: '深圳市恒达科技有限公司',
    orderSourceName: 'ERP系统',
    goodsDetail: {
      goodsSourceTypeName: '自产',
      goodNo: 'G-10001',
      goodArea: '深圳',
      goodPrice: 1280.5,
      goodGcoss: 15.5,
    },
    commissionDetail: [
      {
        extraCommission: '220.00',
        baseCommission: '540.00',
        name: '基础费'
      },
      {
        extraCommission: '20.00',
        baseCommission: '40.00',
        name: '运费'
      },
      {
        baseCommission: '560.00',
        extraCommission: '260.00',
        name: '提成费'
      }
    ],
    totalGrossProfitAmount: '19,840.00',
    salesmanName: '张三',
    totalPurchaseAmount: '128,000.00',
    paidAmount: '64,000.00',
    inputInvoiceStatusName: '已收票',
    inputInvoiceDate: '2026-06-05',
  },
  {
    id: 2,
    name: '贸易单',
    purchaseNo: 'PO20260002',
    inDate: '2026-06-03',
    supplierName: '广州华联贸易有限公司',
    orderSourceName: '手动录入',
    goodsDetail: {
      goodsSourceTypeName: '外采',
      goodNo: 'G-20035',
      goodArea: '广州',
      goodPrice: 3560.0,
      goodGcoss: -2.3,
    },
    commissionDetail: [
      {
        extraCommission: '180.00',
        baseCommission: '810.00',
        name: '基础费'
      },
      {
        extraCommission: '180.00',
        baseCommission: '410.00',
        name: '提成费'
      }
    ],
    totalGrossProfitAmount: '-8,280.00',
    salesmanName: '李四',
    totalPurchaseAmount: '356,000.00',
    paidAmount: '356,000.00',
    inputInvoiceStatusName: '未收票',
    inputInvoiceDate: '-',
  },
]

for (let i = 0; i < 100; i++) {
  tableData.value.push({
    ...mockData[i % mockData.length],
    id: i + 1,
  })
}

function onSelectionChange(selectedRows: TableRow[], keys: (string | number)[]) {
  console.log('选中行变化:', selectedRows, keys)
}

interface TableRow {
  id?: number
  purchaseNo?: string
  [key: string]: unknown
}

function onPurchaseClick(row: TableRow) {
  alert(`查看采购单: ${row.purchaseNo}`)
}

function onEdit(row: TableRow) {
  alert(`编辑: ${row.purchaseNo}`)
}

function onDelete(row: TableRow, index: number) {
  if (confirm(`确认删除 ${row.purchaseNo}？`)) {
    tableData.value.splice(index, 1)
    selectedRowKeys.value = selectedRowKeys.value.filter(k => k !== row.id)
  }
}

function getStatusBg(status: string): string {
  switch (status) {
    case '已收票': return '#f6ffed'
    case '未收票': return '#fff2f0'
    case '收票中': return '#fffbe6'
    default: return '#f5f5f5'
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case '已收票': return '#52c41a'
    case '未收票': return '#ff4d4f'
    case '收票中': return '#faad14'
    default: return '#999'
  }
}
</script>

<style scoped>
.btn-link {
  border: none;
  background: none;
  color: #1890ff;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 13px;
}

.btn-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

.btn-danger {
  color: #ff4d4f;
}

.btn-danger:hover {
  color: #ff7875;
}
</style>

```

