# Scrollbar组件文档

## 简介

`Scrollbar` 是一个基于 Vue 3 的自定义滚动条组件，用于替代浏览器原生滚动条。它支持纵向和横向滚动、滑块拖拽、点击轨道跳转、程序化滚动控制以及滚动到底部/右侧的事件监听。组件默认隐藏原生滚动条，并提供平滑的自定义滚动条交互体验。



------



## 属性 (Props)

| 属性名      | 类型                | 默认值  | 说明                                                         |
| ----------- | ------------------- | ------- | ------------------------------------------------------------ |
| `height`    | `string | number`   | -       | 滚动容器的高度。传入数字时自动添加 `px` 单位。               |
| `maxHeight` | `string | number`   | -       | 滚动容器的最大高度。传入数字时自动添加 `px` 单位。           |
| `native`    | `boolean`           | `false` | 是否使用浏览器原生滚动条。设为 `true` 时将隐藏自定义滚动条。 |
| `always`    | `boolean`           | `false` | 滚动条是否始终可见。为 `false` 时滚动条仅在鼠标悬停或滚动时显示。 |
| `minSize`   | `number`            | `20`    | 滚动条滑块的最小尺寸（百分比），防止内容过多时滑块过小难以操作。 |
| `distance`  | `number`            | `0`     | 触发 `end-reached` 事件时距离底部/右部的像素阈值。           |
| `noresize`  | `boolean`           | `false` | 是否禁用内容尺寸自动检测。设为 `true` 时不会挂载 `ResizeObserver`，需手动调用 `update()` 更新滚动条。 |
| `tag`       | `string`            | `'div'` | 内容视图区域（view）渲染的 HTML 标签。                       |
| `wrapStyle` | `CSSProperties`     | -       | 滚动包裹层（wrap）的自定义内联样式。                         |
| `wrapClass` | `string | string[]` | -       | 滚动包裹层（wrap）的自定义 CSS 类名。                        |
| `viewStyle` | `CSSProperties`     | -       | 内容视图区域（view）的自定义内联样式。                       |
| `viewClass` | `string | string[]` | -       | 内容视图区域（view）的自定义 CSS 类名。                      |
| `id`        | `string`            | -       | 滚动条根元素的 `id` 属性。                                   |
| `class`     | `string`            | -       | 滚动条根元素的自定义 CSS 类名。                              |



------



## 事件 (Events)

**`scroll`**

滚动时触发，实时返回当前滚动位置。

**回调参数：**

```typescript
{
  scrollTop: number   // 纵向滚动偏移量
  scrollLeft: number  // 横向滚动偏移量
}
```

**`end-reached`**

当滚动到容器底部或右部（在 distance 阈值范围内）时触发。可用于实现无限滚动加载。

**回调参数：**

```typescript
{
  direction: {
    vertical: boolean    // 是否到达垂直方向底部
    horizontal: boolean  // 是否到达水平方向右部
  }
  scrollTop: number      // 当前纵向滚动偏移量
  scrollLeft: number     // 当前横向滚动偏移量
}
```



------



### 暴露的方法 (Expose)
通过 `ref` 获取组件实例后可调用以下方法：

| 方法            | 参数                       | 说明                                                         |
| --------------- | -------------------------- | ------------------------------------------------------------ |
| `scrollTo`      | `options: ScrollToOptions` | 调用原生 `scrollTo` 方法，支持传入 `{ top, left, behavior }` 等选项。 |
| `setScrollTop`  | `top: number`              | 设置纵向滚动位置到指定像素值。                               |
| `setScrollLeft` | `left: number`             | 设置横向滚动位置到指定像素值。                               |
| `update`        | -                          | 手动更新滚动条的尺寸和位置。当 `noresize=true` 或内容动态变化后需要调用。 |



### 暴露的属性

| 属性      | 类型                           | 说明                                                         |
| --------- | ------------------------------ | ------------------------------------------------------------ |
| `wrapRef` | `Ref<HTMLElement | undefined>` | 滚动包裹层的 DOM 引用，可用于读取 `scrollHeight`、`clientHeight` 等原生属性。 |



### 插槽 (Slots)

| 插槽名    | 说明                                 |
| --------- | ------------------------------------ |
| `default` | 滚动内容区域，放置需要滚动的子元素。 |



### 使用示例

```vue
<template>
  <div class="p-20">

    <!-- 1、基础纵向滚动 -->
    <div class="mb-20" style="border: 1px solid #f0f0f0; border-radius: 6px;">
      <Scrollbar height="300px" @scroll="onScroll" @end-reached="handleEndReached">
        <div v-for="i in 50" :key="i" style="padding: 10px; border-bottom: 1px solid #eee;">
          列表项 {{ i }}
        </div>
      </Scrollbar>
    </div>

    <!-- 2、横向滚动 -->
    <div class="mtb-20" style="border: 1px solid #f0f0f0; border-radius: 6px;">
      <Scrollbar @end-reached="handleEndReached">
        <div style="display: flex;">
            <div v-for="i in 3" :key="i" style="min-width: 2000px; white-space: nowrap; padding: 10px;flex: 1">
            这是一段很长的横向滚动内容，用来测试横向滚动条的功能是否正常工作。这是一段很长的横向滚动内容，用来测试横向滚动条的功能是否正常工作。这是一段很长的横向滚动内容，用来测试横向滚动条的功能是否正常工作。
          </div>
        </div>
      </Scrollbar>
    </div>

    <!-- 3、始终可见 -->
    <div class="mtb-20" style="border: 1px solid #f0f0f0; border-radius: 6px;">
      <Scrollbar height="200px" :always="true" @end-reached="handleEndReached">
        <div v-for="i in 20" :key="i" style="padding: 8px;">
          滚动条始终可见 - 项目 {{ i }}
        </div>
      </Scrollbar>
    </div>

    <!-- 4、程序化控制 -->
    <div class="mtb-20" style="border: 1px solid #f0f0f0; border-radius: 6px;">
      <div class="mtb-15" style="display: flex; gap: 8px;">
        <button @click="scrollToTop">回到顶部</button>
        <button @click="scrollToBottom">滚动到底部</button>
        <button @click="scrollTo100">滚动到 100px</button>
      </div>
      <Scrollbar
        ref="scrollbarRef"
        height="200px"
         @end-reached="handleEndReached"
      >
        <div v-for="i in 40" :key="i" style="padding: 8px;">
          程序化滚动 - 项目 {{ i }}
        </div>
      </Scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toValue } from 'vue'
import Scrollbar from './components/Scrollbar/Scrollbar.vue'
import type { ScrollbarInstance } from './components/Scrollbar/types'

const scrollbarRef = ref<ScrollbarInstance>()

function onScroll({ scrollTop, scrollLeft }: { scrollTop: number; scrollLeft: number }) {
  console.log('-scrollTop:-', scrollTop, '-scrollLeft:-', scrollLeft)
}

function handleEndReached({ direction, scrollTop, scrollLeft }: {
    direction: { vertical: boolean; horizontal: boolean };
    scrollTop: number;
    scrollLeft: number;
  }) {
  console.log('--------------handleEndReached----------')
  console.log('direction:', direction, 'scrollTop:', scrollTop, 'scrollLeft:', scrollLeft)
}

function scrollToTop() {
  scrollbarRef.value?.setScrollTop(0)
}

function scrollToBottom() {
  const wrap = toValue(scrollbarRef.value?.wrapRef)
  if (wrap) {
    scrollbarRef.value?.setScrollTop(wrap.scrollHeight)
  }
}

function scrollTo100() {
  scrollbarRef.value?.setScrollTop(100)
}
</script>

```



