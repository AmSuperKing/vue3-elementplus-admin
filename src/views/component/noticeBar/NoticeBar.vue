<template>
  <div
    v-if="visible"
    ref="rootRef"
    class="cus-notice-bar"
    :style="rootStyle"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focusin="handleMouseEnter"
    @focusout="handleMouseLeave"
  >
    <!-- 左侧图标 -->
    <div v-if="props.showLeftIcon" class="cus-notice-bar__left-icon">
      <slot name="left-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
          />
          <path
            d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"
          />
        </svg>
      </slot>
    </div>

    <!-- 滚动内容区域 -->
    <div
      ref="wrapRef"
      class="cus-notice-bar__wrap"
      :class="{ 'cus-notice-bar__wrap--vertical': !isHorizontal }"
      role="marquee"
    >
      <!-- 横向滚动 -->
      <div
        v-if="isHorizontal"
        ref="contentRef"
        class="cus-notice-bar__content--horizontal"
        :class="{ 'cus-notice-bar__content--wrapable': wrapable && !scrolling }"
        :style="contentStyle"
        @animationiteration="onAnimationIteration"
      >
        <slot>{{ displayText }}</slot>
      </div>

      <!-- 纵向滚动 -->
      <div
        v-else
        ref="contentRef"
        class="cus-notice-bar__content--vertical"
        :style="contentStyle"
        @animationiteration="onAnimationIteration"
      >
        <template v-if="textList.length > 1">
          <span
            v-for="(item, index) in verticalDisplayList"
            :key="`v-${index}`"
            class="cus-notice-bar__vertical-item"
            :style="{ height: heightStr, lineHeight: heightStr }"
          >{{ item }}</span>
        </template>
        <template v-else>
          <slot>{{ displayText }}</slot>
        </template>
      </div>
    </div>

    <!-- 右侧图标 -->
    <div v-if="mode" class="cus-notice-bar__right-icon" @click.stop="handleRightIconClick">
      <slot name="right-icon">
        <!-- closeable 模式 - 叉号图标 -->
        <svg v-if="mode === 'closeable'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
          <path
            fill="currentColor"
            d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
          ></path>
        </svg>
        <!-- link 模式 - 右箭头图标 -->
        <svg v-if="mode === 'link'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
          <path
            fill="currentColor"
            d="M340.864 149.312a30.59 30.59 0 0 0 0 42.752L652.736 512 340.864 831.872a30.59 30.59 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"
          ></path>
        </svg>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
  type CSSProperties,
} from 'vue'

/* ========== 类型 ========== */
type NoticeBarMode = '' | 'closeable' | 'link'
type NoticeBarDirection = 'horizontal' | 'vertical'

interface NoticeBarProps {
  mode?: NoticeBarMode
  direction?: NoticeBarDirection
  text?: string | string[]
  color?: string
  background?: string
  delay?: number | string
  speed?: number | string
  scrollable?: boolean
  wrapable?: boolean
  height?: number | string
  padding?: number | string
  fontSize?: number | string
  pausedable?: boolean
  showLeftIcon?: boolean
}

/* ========== Props & Emits ========== */
const props = withDefaults(defineProps<NoticeBarProps>(), {
  mode: '',
  direction: 'horizontal',
  text: '',
  color: '#ed6a0c',
  background: '#fffbe8',
  delay: 1,
  speed: 60,
  scrollable: undefined,
  wrapable: false,
  height: 40,
  padding: 0,
  fontSize: 14,
  pausedable: false,
  showLeftIcon: true,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
  (e: 'close', event: MouseEvent): void
  (e: 'right-icon-click', event: MouseEvent): void
  (e: 'replay'): void
}>()

/* ========== Refs ========== */
const rootRef = ref<HTMLElement | null>(null)
const wrapRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const visible = ref(true)
const scrolling = ref(false)
const animationName = ref('')

/* ========== 计算属性 ========== */
const isHorizontal = computed(() => props.direction === 'horizontal')

const textList = computed<string[]>(() => {
  if (Array.isArray(props.text)) return props.text
  if (typeof props.text === 'string' && props.text) return [props.text]
  return []
})

const displayText = computed(() => textList.value.join(' '))

const verticalDisplayList = computed(() => {
  if (textList.value.length <= 1) return textList.value
  return [...textList.value, textList.value[0]]
})

const delayNum = computed(() => Number(props.delay) || 0)
const speedNum = computed(() => Number(props.speed) || 60)

const heightStr = computed(() => toPxStr(props.height, 40))
const paddingStr = computed(() => toPxStr(props.padding, 0))
const fontSizeStr = computed(() => toPxStr(props.fontSize, 14))

const heightPx = computed(() => {
  const v = props.height
  if (typeof v === 'number') return v
  return parseFloat(String(v)) || 40
})

/* ========== 样式 ========== */
const rootStyle = computed<CSSProperties>(() => ({
  '--cus-notice-bar-color': props.color,
  '--cus-notice-bar-background': props.background,
  '--cus-notice-bar-height': heightStr.value,
  '--cus-notice-bar-padding': paddingStr.value,
  '--cus-notice-bar-font-size': fontSizeStr.value,
} as CSSProperties))

const contentStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  if (scrolling.value && animationName.value) {
    style.animationName = animationName.value
    style.animationDelay = `${delayNum.value}s`
    style.animationTimingFunction = 'linear'
    style.animationIterationCount = 'infinite'
    style.animationDuration = 'var(--cus-notice-bar-duration)'
    style.animationFillMode = 'both'
  }
  return style
})

/* ========== 工具函数 ========== */
function toPxStr(val: number | string | undefined, fallback: number): string {
  if (val === undefined || val === null || val === '') return `${fallback}px`
  if (typeof val === 'number') return `${val}px`
  return /^\d+$/.test(val) ? `${val}px` : val
}

/* ========== 动态 keyframes 管理 ========== */
let dynamicStyleEl: HTMLStyleElement | null = null

function removeDynamicKeyframes() {
  if (dynamicStyleEl) {
    dynamicStyleEl.remove()
    dynamicStyleEl = null
  }
  animationName.value = ''
  scrolling.value = false
  if (contentRef.value) {
    contentRef.value.style.removeProperty('transform')
    contentRef.value.style.removeProperty('animation-play-state')
    contentRef.value.style.removeProperty('--cus-notice-bar-duration')
  }
}

function injectKeyframes(name: string, css: string) {
  removeDynamicKeyframes()
  dynamicStyleEl = document.createElement('style')
  dynamicStyleEl.textContent = css
  document.head.appendChild(dynamicStyleEl)
  animationName.value = name
}

/* ========== 横向滚动 ========== */
function startHorizontalScroll() {
  const wrap = wrapRef.value
  const content = contentRef.value
  if (!wrap || !content) return

  const wrapWidth = wrap.offsetWidth
  const contentWidth = content.scrollWidth

  const shouldScroll =
    props.scrollable === true ||
    (props.scrollable !== false && contentWidth > wrapWidth)

  if (!shouldScroll) {
    removeDynamicKeyframes()
    return
  }

  const distance = contentWidth + wrapWidth
  const duration = distance / speedNum.value
  const animName = `cus-nb-h-${Date.now()}`

  const keyframes = `
    @keyframes ${animName} {
      0%   { transform: translateX(${wrapWidth}px); }
      100% { transform: translateX(-${contentWidth}px); }
    }
  `
  injectKeyframes(animName, keyframes)
  scrolling.value = true

  nextTick(() => {
    contentRef.value?.style.setProperty('--cus-notice-bar-duration', `${duration}s`)
  })
}

/* ========== 纵向滚动 ========== */
function startVerticalScroll() {
  const wrap = wrapRef.value
  const content = contentRef.value
  if (!wrap || !content) return

  const itemH = heightPx.value

  /* ---------- 单条文本：连续纵向滚动 ---------- */
  if (textList.value.length <= 1) {
    const contentHeight = content.scrollHeight
    const wrapHeight = wrap.offsetHeight
    const shouldScroll =
      props.scrollable === true ||
      (props.scrollable !== false && contentHeight > wrapHeight)

    if (!shouldScroll) {
      removeDynamicKeyframes()
      return
    }

    const distance = contentHeight + wrapHeight
    const duration = distance / speedNum.value
    const animName = `cus-nb-v-${Date.now()}`

    const keyframes = `
      @keyframes ${animName} {
        0%   { transform: translateY(${wrapHeight}px); }
        100% { transform: translateY(-${contentHeight}px); }
      }
    `
    injectKeyframes(animName, keyframes)
    scrolling.value = true
    nextTick(() => {
      contentRef.value?.style.setProperty('--cus-notice-bar-duration', `${duration}s`)
    })
    return
  }

  /* ---------- 多条文本：逐条向上切换（修正版） ---------- */
  const count = textList.value.length

  // 每条消息停留时间（秒）
  const pauseTime = 2
  // 滚动一条高度的时间（秒）
  const scrollTime = itemH / speedNum.value
  // 每步总时间
  const stepTime = pauseTime + scrollTime
  // 总时长 = 步数 × 每步时间
  const totalDuration = stepTime * count
  const animName = `cus-nb-vs-${Date.now()}`

  /*
   * - 让 100% 停在 translateY(-count * itemH)，即追加的首项副本位置
   * - 不加额外的 100% { translateY(0) }
   * - CSS animation infinite 循环时，100% → 0% 的切换是瞬间跳变的
   * - 由于末尾副本和首项内容完全相同，跳变在视觉上完全无缝
   *
   * 示例（count=3, itemH=40px, verticalDisplayList=[A,B,C,A']）：
   *   0%     → translateY(0)       显示 A
   *   停留...
   *   33.3%  → translateY(-40px)   显示 B
   *   停留...
   *   66.6%  → translateY(-80px)   显示 C
   *   停留...
   *   100%   → translateY(-120px)  显示 A'（= A，无缝）
   *   ↓ instant jump (infinite loop)
   *   0%     → translateY(0)       显示 A（和上面完全一样）
   */
  let kf = `@keyframes ${animName} {\n`

  for (let i = 0; i < count; i++) {
    const stepStartPct = (i / count) * 100
    const stepEndPct = ((i + 1) / count) * 100

    // 停留阶段结束百分比
    const pauseRatio = pauseTime / stepTime
    const pauseEndPct = stepStartPct + pauseRatio * (stepEndPct - stepStartPct)

    const currentY = -(i * itemH)
    const nextY = -((i + 1) * itemH)

    // 停留阶段：保持当前位置
    kf += `  ${stepStartPct.toFixed(4)}% { transform: translateY(${currentY}px); }\n`
    kf += `  ${pauseEndPct.toFixed(4)}% { transform: translateY(${currentY}px); }\n`

    if (i < count - 1) {
      // 中间步骤：滚动到下一条
      kf += `  ${stepEndPct.toFixed(4)}% { transform: translateY(${nextY}px); }\n`
    } else {
      // 最后一步：滚动到追加的首项副本（-count * itemH）
      // 不加 translateY(0)，让 infinite 循环自动瞬间跳回 0%
      kf += `  100% { transform: translateY(${nextY}px); }\n`
    }
  }

  kf += `}\n`

  injectKeyframes(animName, kf)
  scrolling.value = true

  nextTick(() => {
    contentRef.value?.style.setProperty('--cus-notice-bar-duration', `${totalDuration}s`)
  })
}

/* ========== 启动滚动 ========== */
async function startScroll() {
  await nextTick()
  removeDynamicKeyframes()
  if (isHorizontal.value) {
    startHorizontalScroll()
  } else {
    startVerticalScroll()
  }
}

/* ========== 动画事件 ========== */
function onAnimationIteration() {
  emit('replay')
}

/* ========== 暂停 / 恢复 ========== */
function pauseAnimation() {
  if (contentRef.value && scrolling.value) {
    contentRef.value.style.animationPlayState = 'paused'
  }
}
function resumeAnimation() {
  if (contentRef.value && scrolling.value) {
    contentRef.value.style.animationPlayState = 'running'
  }
}

function handleMouseEnter() {
  if (props.pausedable) pauseAnimation()
}
function handleMouseLeave() {
  if (props.pausedable) resumeAnimation()
}

/* ========== 事件 ========== */
function handleClick(event: MouseEvent) {
  emit('click', event)
}
function handleRightIconClick(event: MouseEvent) {
  if (props.mode === 'closeable') {
    visible.value = false
    emit('close', event)
  }
  if (props.mode === 'link') {
    emit('right-icon-click', event)
  }
}

/* ========== Expose ========== */
function reset() {
  visible.value = true
  nextTick(() => startScroll())
}
defineExpose({ reset })

/* ========== Watch ========== */
watch(
  () => [
    props.text,
    props.direction,
    props.speed,
    props.delay,
    props.scrollable,
    props.wrapable,
    props.height,
  ],
  () => {
    nextTick(() => startScroll())
  }
)

/* ========== 生命周期 ========== */
onMounted(() => {
  startScroll()
})
onBeforeUnmount(() => {
  removeDynamicKeyframes()
})
</script>

<style scoped>
.cus-notice-bar {
  display: flex;
  align-items: center;
  height: var(--cus-notice-bar-height, 40px);
  padding: var(--cus-notice-bar-padding, 0px);
  background: var(--cus-notice-bar-background, #fffbe8);
  color: var(--cus-notice-bar-color, #ed6a0c);
  font-size: var(--cus-notice-bar-font-size, 14px);
  overflow: hidden;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
  user-select: none;
}

.cus-notice-bar__left-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0 8px;
  height: 100%;
}
.cus-notice-bar__left-icon svg {
  font-size: 1.15em;
}

.cus-notice-bar__right-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0 8px;
  cursor: pointer;
  height: 100%;
}
.cus-notice-bar__right-icon svg {
  font-size: 0.85em;
}

/* ========== wrap 容器 ========== */
.cus-notice-bar__wrap {
  flex: 1;
  overflow: hidden;
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.cus-notice-bar__wrap--vertical {
  display: block;
}

/* ========== 横向内容 ========== */
.cus-notice-bar__content--horizontal {
  white-space: nowrap;
  display: inline-block;
  will-change: transform;
}
.cus-notice-bar__content--horizontal.cus-notice-bar__content--wrapable {
  white-space: normal;
  word-break: break-all;
  line-height: normal;
}

/* ========== 纵向内容 ========== */
.cus-notice-bar__content--vertical {
  display: flex;
  flex-direction: column;
  will-change: transform;
}

.cus-notice-bar__vertical-item {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
}
</style>
