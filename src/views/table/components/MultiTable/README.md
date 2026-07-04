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
  align?: 'left' | 'center' | 'right'; // 对齐方式
  children?: ColumnConfig[]; // 子列配置（用于多级表头）
}
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
| `showSummary`                | `boolean`                         | -           | 是否显示总结行                          |
| `summary`                    | `string`                          | -           | 总结文本内容                            |
| `summaryFitTableContentWith` | `boolean`                         | `false`     | 总结行是否跟随表格内容宽度              |
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



------



## 📝 注意事项

1. 子行展开：当 `columns` 中配置了 `children` 且对应数据为数组时，组件自动将该行展开为多行子行展示。
2. 列拖拽：需在列配置中设置 `resizable: true`，最小拖拽宽度为 `50px`。
3. 防抖机制：行/单元格的 `click`、`mouseenter`、`mouseleave` 及 `scroll` 事件均内置防抖/节流，避免高频触发。
4. 主题色：设置 `theme` 后会自动生成 **5.5%** 透明度的衍生色作为默认背景，各独立颜色属性优先级高于主题色。
5. Radio name 唯一性：组件内部使用 `useId()` 生成唯一 ID，确保多实例共存时 radio 互不干扰。
6. 当前表格组件原理是对数据进行展开拓屏进行达到渲染多维嵌套数据的效果，本质还是`table`的`rowspan`和`colspan`处理。不支持展开行功能，不支持树形渲染显示效果；未实现节点懒加载与大数据量的虚拟滚动。

