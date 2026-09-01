### 注册指令
```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { vMove } from './directives/vMove'

const app = createApp(App)

// 全局注册
app.directive('move', vMove)

app.mount('#app')
```


### 使用示例
#### 1. 基础拖拽
```vue
<template>
  <div v-move class="draggable-box">
    拖我！
  </div>
</template>

<style scoped>
.draggable-box {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
</style>
```

#### 2. 轴约束（使用 modifiers）
```vue
<template>
  <!-- 只能水平拖动 -->
  <div v-move.x class="box">← 水平拖动 →</div>

  <!-- 只能垂直拖动 -->
  <div v-move.y class="box">↕ 垂直拖动</div>
</template>
```

#### 3. 使用手柄拖拽
```vue
<template>
  <div v-move="{ handle: '.drag-handle' }" class="card">
    <div class="drag-handle">
      ⠿ 拖拽手柄
    </div>
    <div class="card-content">
      这里是卡片内容，只有拖拽手柄区域可以拖动。
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 300px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.drag-handle {
  padding: 10px;
  background: #f5f5f5;
  cursor: grab;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}
.drag-handle:active {
  cursor: grabbing;
}
.card-content {
  padding: 16px;
}
</style>
```

#### 4. 边界约束
```vue
<template>
  <div class="container" ref="containerRef">
    <div
      v-move="{ boundary: 'parent' }"
      class="ball"
    >
      我被限制在父容器内
    </div>
  </div>

  <!-- 限制在视口内 -->
  <div v-move="{ boundary: 'viewport' }" class="floating-btn">
    🚀
  </div>
</template>

<style scoped>
.container {
  width: 500px;
  height: 400px;
  border: 2px dashed #ccc;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}
.ball {
  width: 100px;
  height: 100px;
  background: #ff6b6b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}
.floating-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background: #4ecdc4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
</style>
```

#### 5. 完整配置 + 事件回调
```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { MoveEventData } from './directives/vMove'

const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)

const handleStart = (el: HTMLElement, data: MoveEventData) => {
  isDragging.value = true
  console.log('拖拽开始', data)
}

const handleMove = (el: HTMLElement, data: MoveEventData) => {
  position.value = { x: data.x, y: data.y }
}

const handleEnd = (el: HTMLElement, data: MoveEventData) => {
  isDragging.value = false
  console.log('拖拽结束，最终位置:', data.x, data.y)
}
</script>

<template>
  <div class="playground">
    <div class="info">
      位置: ({{ position.x.toFixed(0) }}, {{ position.y.toFixed(0) }})
      <span v-if="isDragging" class="badge">拖拽中...</span>
    </div>

    <div
      v-move="{
        axis: 'both',
        boundary: 'parent',
        grid: [20, 20],
        onStart: handleStart,
        onMove: handleMove,
        onEnd: handleEnd,
      }"
      class="grid-box"
    >
      网格吸附 20px
    </div>
  </div>
</template>

<style scoped>
.playground {
  width: 600px;
  height: 400px;
  border: 2px dashed #aaa;
  border-radius: 12px;
  position: relative;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 19px, #eee 19px, #eee 20px
  ),
  repeating-linear-gradient(
    90deg, transparent, transparent 19px, #eee 19px, #eee 20px
  );
}
.info {
  padding: 10px;
  font-family: monospace;
  font-size: 14px;
}
.badge {
  background: #ff6b6b;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
}
.grid-box {
  width: 100px;
  height: 100px;
  background: #a29bfe;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
</style>
```

#### 6. 动态禁用
```vue
<script setup lang="ts">
import { ref } from 'vue'

const locked = ref(false)
</script>

<template>
  <button @click="locked = !locked">
    {{ locked ? '🔒 解锁' : '🔓 锁定' }}
  </button>

  <div
    v-move="{ disabled: locked }"
    class="box"
    :class="{ locked }"
  >
    {{ locked ? '已锁定' : '可拖拽' }}
  </div>
</template>

<style scoped>
.box {
  width: 150px;
  height: 150px;
  background: #00b894;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  transition: opacity 0.2s;
}
.box.locked {
  opacity: 0.6;
}
</style>
```

#### 7. 监听自定义 DOM 事件
```vue
<script setup lang="ts">
import { ref } from 'vue'

const log = ref<string[]>([])

// 通过 DOM 自定义事件监听（无需传入回调）
const onMoveStart = (e: Event) => {
  const detail = (e as CustomEvent).detail
  log.value.push(`开始: (${detail.x}, ${detail.y})`)
}
</script>

<template>
  <div
    v-move
    class="box"
    @move-start="onMoveStart"
    @move="(e: Event) => log.push(`移动: ${JSON.stringify((e as CustomEvent).detail)}`)"
    @move-end="(e: Event) => log.push(`结束`)"
  >
    拖拽我（看控制台）
  </div>

  <div class="log-panel">
    <div v-for="(item, i) in log" :key="i">{{ item }}</div>
  </div>
</template>
```

### 架构设计要点
```
┌──────────────────────────────────────────────────┐
│                  v-move 指令                      │
├──────────────────────────────────────────────────┤
│                                                    │
│  ┌─────────┐    ┌────────────┐    ┌───────────┐  │
│  │ 配置解析 │───▶│  状态初始化  │───▶│ 事件绑定   │  │
│  └─────────┘    └────────────┘    └─────┬─────┘  │
│                                          │         │
│  ┌───────────────────────────────────────▼──────┐  │
│  │              拖拽生命周期                      │  │
│  │                                                │  │
│  │  mousedown/touchstart                          │  │
│  │       │                                        │  │
│  │       ▼                                        │  │
│  │  ┌─────────┐   rAF 节流    ┌───────────────┐  │  │
│  │  │ onStart │──────────────▶│  processDrag  │  │  │
│  │  └─────────┘               │               │  │  │
│  │       │                    │ • 轴约束       │  │  │
│  │       ▼                    │ • 网格吸附     │  │  │
│  │  mousemove/touchmove       │ • 边界钳制     │  │  │
│  │       │                    │ • transform    │  │  │
│  │       ▼                    │ • onMove 回调  │  │  │
│  │  mouseup/touchend          └───────────────┘  │  │
│  │       │                                        │  │
│  │       ▼                                        │  │
│  │  ┌─────────┐                                   │  │
│  │  │  onEnd  │  清理全局监听 / rAF               │  │
│  │  └─────────┘                                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │            updated 钩子                       │  │
│  │  • 响应式更新 disabled / handle / options     │  │
│  │  • 按需重新绑定事件                           │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │         beforeUnmount 钩子                    │  │
│  │  • 移除所有事件监听                           │  │
│  │  • 取消 rAF                                  │  │
│  │  • 清理 DOM 状态                             │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### 性能
| 优化项 | 实现方式 |
|---|---|
| GPU 加速 | 使用 `transform: translate()` 而非 `top/left`，避免重排 |
| 帧率节流 | `requestAnimationFrame` 限制每帧最多一次 DOM 更新 |
| will-change | 拖拽中设置 `will-change: transform` 提示浏览器优化合成层 |
| Passive Events | `mousemove` 设置 `passive: false`（因需要 `preventDefault`），其余合理使用 passive |
| 全局事件按需绑定 | `mousemove/mouseup` 仅在拖拽时绑定到 `document`，非拖拽时不占资源 |
| 内存清理 | `beforeUnmount` 彻底移除所有监听器、取消 rAF、删除状态引用 |


### 功能特性
| 特性 | 支持方式 |
|---|---|
| 鼠标拖拽 | ✅ `mousedown/mousemove/mouseup` |
| 触摸拖拽 | ✅ `touchstart/touchmove/touchend` |
| 轴约束 | ✅ `axis: 'x' \| 'y' \| 'both'` 或 `.x` `.y` 修饰符 |
| 手柄拖拽 | ✅ `handle: '.selector'` |
| 边界限制 | ✅ `'parent' \| 'viewport' \| selector \| HTMLElement` |
| 网格吸附 | ✅ `grid: [x, y]` |
| 动态禁用 | ✅ `disabled: true` 或 `.disabled` 修饰符 |
| 事件回调 | ✅ `onStart / onMove / onEnd` + DOM `CustomEvent` |
| 响应式更新 | ✅ `updated` 钩子自动响应配置变化 |
| TypeScript | ✅ 完整类型推导 |
