# CusPagination 分页组件

`CusPagination` 是一个基于 Vue 3 + TypeScript 开发的高可定制分页组件，实现参考自Element Plus的Pagination。它支持多种布局配置、主题色动态切换、尺寸控制以及完整的插槽自定义功能，适用于各类数据列表场景。

## ✨ 特性
- 全面可控：支持 `v-model:current-page` 和 `v-model:page-size` 双向绑定
- 灵活布局：通过 `layout` 属性自由组合总数、每页条数、上一页、页码、下一页、跳转等模块
- 主题定制：支持一键设置主题色，自动生成激活态、悬停态颜色；同时支持细粒度 CSS 变量覆盖
- 多尺寸支持：内置 `small / default / large` 三种尺寸
- 完整插槽：所有功能区域均提供作用域插槽，满足高度定制化需求
- 无障碍与交互：内置键盘跳转、点击外部关闭下拉框、禁用状态处理
- 零依赖：纯 Vue 3 实现，不依赖第三方 UI 库



------



## 📦 安装与使用

```vue
<template>
  <CusPagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="100"
    show-total
    show-sizes
    show-jumper
    theme="#409eff"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentPage = ref(1)
const pageSize = ref(10)

const handleChange = (page: number, size: number) => {
  console.log(`页码: ${page}, 每页条数: ${size}`)
}
</script>
```



------



## 📖 API 文档

### Props

| 属性名                                 | 类型                            | 默认值                                 | 说明                                 |
| -------------------------------------- | ------------------------------- | -------------------------------------- | ------------------------------------ |
| `currentPage` / `v-model:current-page` | `number`                        | `1`                                    | 当前页码                             |
| `pageSize` / `v-model:page-size`       | `number`                        | `10`                                   | 每页条数                             |
| `total`                                | `number`                        | `0`                                    | 数据总条数                           |
| `pageSizes`                            | `number[]`                      | `[10, 20, 30, 50, 100]`                | 每页条数选项列表                     |
| `pagerCount`                           | `number`                        | `7`                                    | 页码按钮的最大数量（含省略号占位）   |
| `layout`                               | `string | LayoutItem[]`         | `'prev,pager,next,sizes,jumper,total'` | 布局配置，支持字符串或数组格式       |
| `showTotal`                            | `boolean`                       | `false`                                | 是否显示总条数                       |
| `showSizes`                            | `boolean`                       | `false`                                | 是否显示每页条数选择器               |
| `showJumper`                           | `boolean`                       | `false`                                | 是否显示跳转输入框                   |
| `showFirstLast`                        | `boolean`                       | `false`                                | 是否始终显示第一页和最后一页         |
| `showBackground`                       | `boolean`                       | `false`                                | 是否为分页项添加背景色               |
| `backgroundColor`                      | `string`                        | -                                      | 背景模式下的背景色                   |
| `disabled`                             | `boolean`                       | `false`                                | 是否禁用整个分页器                   |
| `hideOnSinglePage`                     | `boolean`                       | `false`                                | 只有一页时是否隐藏分页器             |
| `size`                                 | `'small' | 'default' | 'large'` | `'default'`                            | 分页器尺寸                           |
| `theme`                                | `string`                        | `'#409eff'`                            | 主题色（十六进制），自动派生相关颜色 |
| `textColor`                            | `string`                        | -                                      | 文字颜色                             |
| `borderColor`                          | `string`                        | -                                      | 边框颜色                             |
| `hoverBg`                              | `string`                        | -                                      | 鼠标悬停背景色                       |
| `activeColor`                          | `string`                        | -                                      | 激活态文字颜色                       |
| `activeBg`                             | `string`                        | -                                      | 激活态背景颜色                       |



### Events

| 事件名               | 参数                                      | 说明                          |
| -------------------- | ----------------------------------------- | ----------------------------- |
| `update:currentPage` | `(val: number)`                           | 当前页改变时触发（v-model）   |
| `update:pageSize`    | `(val: number)`                           | 每页条数改变时触发（v-model） |
| `current-change`     | `(val: number)`                           | 当前页改变时触发              |
| `size-change`        | `(val: number)`                           | 每页条数改变时触发            |
| `change`             | `(currentPage: number, pageSize: number)` | 页码或每页条数任一改变后触发  |



### Slots

| 插槽名           | 作用域参数                | 说明                 |
| ---------------- | ------------------------- | -------------------- |
| `total`          | `{ total: number }`       | 自定义总数显示内容   |
| `sizes`          | `{ pageSize: number }`    | 自定义每页条数选择器 |
| `prev`           | -                         | 自定义上一页按钮内容 |
| `next`           | -                         | 自定义下一页按钮内容 |
| `left-ellipsis`  | -                         | 自定义左侧省略号内容 |
| `right-ellipsis` | -                         | 自定义右侧省略号内容 |
| `jumper`         | `{ currentPage: number }` | 自定义跳转区域内容   |



### 🎨 布局配置 (Layout)

`layout` 属性支持以下两种格式：

```js
// 字符串格式（逗号分隔）
layout="total, sizes, prev, pager, next, jumper"

// 数组格式
:layout="['total', 'sizes', 'prev', 'pager', 'next', 'jumper']"
```

**可用的布局项：**

| 值       | 说明                     |
| -------- | ------------------------ |
| `total`  | 总条数显示               |
| `sizes`  | 每页条数下拉选择器       |
| `prev`   | 上一页按钮               |
| `pager`  | 页码列表（含省略号逻辑） |
| `next`   | 下一页按钮               |
| `jumper` | 跳转输入框               |

> ⚠️ 如果传入非法的 layout item 或存在重复项，组件将自动回退到默认布局：['prev', 'pager', 'next', 'sizes', 'jumper', 'total']



### 🎯 主题定制

#### 方式一：通过 theme 属性
设置一个十六进制颜色值，组件会自动计算派生色：

```vue
<CusPagination :total="100" theme="#67c23a" />
```

#### 方式二：通过细粒度 Props

```vue
<CusPagination
  :total="100"
  text-color="#333"
  border-color="#e4e7ed"
  hover-bg="#f0f9eb"
  active-color="#fff"
  active-bg="#67c23a"
/>
```

#### 方式三：CSS 变量覆盖

组件内部使用以下 CSS 变量，可在外部直接覆盖：

| CSS 变量                   | 说明           |
| -------------------------- | -------------- |
| `--page-primary`           | 主色           |
| `--page-primary-light`     | 主色浅色调     |
| `--page-text`              | 文字颜色       |
| `--page-border`            | 边框颜色       |
| `--page-hover-bg`          | 悬停背景色     |
| `--page-active-text-color` | 激活态文字颜色 |
| `--page-active-bg`         | 激活态背景色   |
| `--page-bg`                | 基础背景色     |
| `--page-height`            | 组件高度       |
| `--page-radius`            | 圆角大小       |
| `--page-font-size`         | 字体大小       |



### 📐 尺寸对照表

| Size      | 高度 | 圆角 | 字号 |
| --------- | ---- | ---- | ---- |
| `small`   | 28px | 4px  | 12px |
| `default` | 32px | 4px  | 14px |
| `large`   | 36px | 6px  | 16px |



### ⚙️ 注意事项

1. 页码算法：当总页数超过 `pagerCount` 时，中间区域始终保持 `pagerCount - 2` 个页码按钮，首尾页固定显示，超出范围以省略号替代。
2. 每页条数变更：切换 `pageSize` 后，组件会自动校正 `currentPage`，确保不会超出新的最大页数。
3. 跳转输入：支持回车键和失焦两种触发方式，输入非法值时自动忽略。
4. Click Outside：每页条数下拉框使用自定义 `v-click-outside` 指令实现点击外部关闭，无需额外依赖。
5. 兼容性：事件命名同时提供了 `update:*` 和 `*-change` 两套，方便从 Element Plus 等组件库迁移。