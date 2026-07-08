<template>
  <transition name="cus-scrollbar-fade">
    <div
      v-show="always || visible"
      ref="barRef"
      :class="['cus-scrollbar__bar', `is-${barConfig.key}`]"
      @mousedown="clickTrackHandler"
    >
      <div
        ref="thumbRef"
        class="cus-scrollbar__thumb"
        :style="thumbStyle"
        @mousedown="startDrag"
      />
    </div>
  </transition>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  inject,
  watch,
  onBeforeUnmount,
  type Ref,
  type CSSProperties,
} from 'vue'
import type { BarProps, BarConfig } from './types'
import { scrollbarContextKey } from './useScrollbar'
import "./scrollbar.scss"

const props = withDefaults(
  defineProps<BarProps>(),
  {
    always: false,
    minSize: 20,
  }
)

// 从父组件注入的上下文
const scrollbarContext = inject<{
  scrollbarRef: Ref<HTMLElement | undefined>
  wrapRef: Ref<HTMLElement | undefined>
  moveX: Ref<number>
  moveY: Ref<number>
  sizeWidth: Ref<string>
  sizeHeight: Ref<string>
  scrollTop: Ref<number>
  scrollLeft: Ref<number>
}>(scrollbarContextKey)!

const barRef = ref<HTMLElement>()
const thumbRef = ref<HTMLElement>()
const visible = ref(false)
const cursorDown = ref(false)
/** 拖拽时记录的 thumb 内点击偏移 */
const thumbClickOffset = ref(0)

let hideTimer: ReturnType<typeof setTimeout> | null = null

  // 根据方向返回配置
const barConfig = computed<BarConfig>(() => {
  if (props.vertical) {
    return {
      key: 'vertical',
      direction: 'Y',
      size: 'height',
      offset: 'top',
      rectOffset: 'top',
      scroll: 'scrollTop',
      scrollSize: 'scrollHeight',
      clientSize: 'clientHeight',
      offsetSize: 'offsetHeight',
      mouseKey: 'clientY',
    } as const
  }
  return {
    key: 'horizontal',
    direction: 'X',
    size: 'width',
    offset: 'left',
    rectOffset: 'left',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    clientSize: 'clientWidth',
    offsetSize: 'offsetWidth',
    mouseKey: 'clientX',
  } as const
})

/**
 * 滑块样式：thumbStyle 依赖响应式的 scrollTop / scrollLeft
 * 当用户滚动时，handleScroll 更新这些 ref → 触发此 computed 重新计算
 */
const thumbStyle = computed<CSSProperties>(() => {
  const config = barConfig.value
  const wrap = scrollbarContext.wrapRef.value
  const bar = barRef.value

  if (!wrap || !bar) return { display: 'none' }

  const scrollSize = wrap[config.scrollSize]
  const clientSize = wrap[config.clientSize]

  // 没有溢出，不需要滚动条
  if (scrollSize <= clientSize) return { display: 'none' }

  // 读取响应式的滚动位置，建立依赖关系
  const currentScroll = props.vertical
    ? scrollbarContext.scrollTop.value
    : scrollbarContext.scrollLeft.value

  const barSize = bar[config.offsetSize]
  // thumb 占轨道的百分比（受 minSize 限制）
  const thumbPercent = Math.max((clientSize * 100) / scrollSize, props.minSize)
  const thumbSize = (thumbPercent / 100) * barSize
  // thumb 可移动的范围 = 轨道大小 - thumb 大小
  const thumbTrack = barSize - thumbSize
  // 最大可滚动距离
  const maxScroll = scrollSize - clientSize
  // 滚动进度 0~1
  const scrollProgress = maxScroll > 0 ? currentScroll / maxScroll : 0
  // thumb 的偏移量（像素）
  const thumbOffset = scrollProgress * thumbTrack

  return {
    [config.size]: `${thumbPercent}%`,
    [config.offset]: `${thumbOffset}px`,
  }
})

// ========================
//  点击轨道滚动
// ========================
function clickTrackHandler(e: MouseEvent) {
  // 如果点击的是 thumb 自身，不处理
  if (e.target === thumbRef.value) return
  if (!thumbRef.value || !barRef.value) return

  const config = barConfig.value
  const barEl = barRef.value

  // 点击位置相对于轨道的坐标
  const barRect = barEl.getBoundingClientRect()
  const clickPos = e[config.mouseKey] - barRect[config.rectOffset]

  const wrap = scrollbarContext.wrapRef.value
  if (!wrap) return

  const clickPercent = clickPos / barEl[config.offsetSize]
  const scrollTarget = clickPercent * (wrap[config.scrollSize] - wrap[config.clientSize])
  wrap[config.scroll] = scrollTarget
}

// ========================
//  拖拽滑块
// ========================
function startDrag(e: MouseEvent) {
  e.stopImmediatePropagation()
  e.preventDefault()
  cursorDown.value = true

  const config = barConfig.value

  document.addEventListener('mousemove', mouseMoveDocumentHandler)
  document.addEventListener('mouseup', mouseUpDocumentHandler)
  document.onselectstart = () => false

  if (!thumbRef.value) return

  // 记录鼠标在 thumb 内的点击偏移（相对于 thumb 左上角）
  const thumbRect = thumbRef.value.getBoundingClientRect()
  thumbClickOffset.value = e[config.mouseKey] - thumbRect[config.rectOffset]
}

function mouseMoveDocumentHandler(e: MouseEvent) {
  if (!cursorDown.value || !thumbRef.value || !barRef.value) return

  const config = barConfig.value
  const barEl = barRef.value
  const thumbEl = thumbRef.value

  // 鼠标相对于轨道的位置
  const barRect = barEl.getBoundingClientRect()
  const mousePos = e[config.mouseKey] - barRect[config.rectOffset]
  // 减去拖拽开始时记录的 thumb 内偏移，得到 thumb 左上角应在的位置
  const thumbPos = mousePos - thumbClickOffset.value

  const wrap = scrollbarContext.wrapRef.value
  if (!wrap) return

  const thumbTrack = barEl[config.offsetSize] - thumbEl[config.offsetSize]
  const clampedPos = Math.min(Math.max(thumbPos, 0), thumbTrack)
  const scrollTarget = (clampedPos / thumbTrack) * (wrap[config.scrollSize] - wrap[config.clientSize])
  wrap[config.scroll] = scrollTarget
}

function mouseUpDocumentHandler() {
  cursorDown.value = false
  document.removeEventListener('mousemove', mouseMoveDocumentHandler)
  document.removeEventListener('mouseup', mouseUpDocumentHandler)
  document.onselectstart = null
}

// ========================
//  可见性控制
// ========================
function showBar() {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  visible.value = true
}

function scheduleHideBar(delay = 800) {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (!cursorDown.value) {
      visible.value = false
    }
  }, delay)
}

function onMouseEnter() {
  showBar()
}

function onMouseLeave() {
  if (!cursorDown.value) {
    scheduleHideBar(300)
  }
}

function onWrapScroll() {
  showBar()
  scheduleHideBar(800)
}

let rootEl: HTMLElement | null = null
let wrapEl: HTMLElement | null = null

function bindRootEvents(el: HTMLElement) {
  el.addEventListener('mouseenter', onMouseEnter)
  el.addEventListener('mouseleave', onMouseLeave)
}

function unbindRootEvents(el: HTMLElement) {
  el.removeEventListener('mouseenter', onMouseEnter)
  el.removeEventListener('mouseleave', onMouseLeave)
}

function bindWrapEvents(el: HTMLElement) {
  el.addEventListener('scroll', onWrapScroll, { passive: true })
}

function unbindWrapEvents(el: HTMLElement) {
  el.removeEventListener('scroll', onWrapScroll)
}

watch(
  () => scrollbarContext.scrollbarRef.value,
  (el) => {
    if (rootEl) unbindRootEvents(rootEl)
    rootEl = el ?? null
    if (rootEl && !props.always) {
      bindRootEvents(rootEl)
    }
  },
  { immediate: true }
)

watch(
  () => scrollbarContext.wrapRef.value,
  (el) => {
    if (wrapEl) unbindWrapEvents(wrapEl) // 先解绑旧的
    wrapEl = el ?? null
    if (wrapEl && !props.always) {
      bindWrapEvents(wrapEl)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer)
  document.removeEventListener('mouseup', mouseUpDocumentHandler)
  if (rootEl) unbindRootEvents(rootEl)
  if (wrapEl) unbindWrapEvents(wrapEl)
})
</script>
