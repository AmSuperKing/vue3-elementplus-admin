import type { CSSProperties, Ref } from 'vue'

/** Scrollbar 组件 Props */
export interface ScrollbarProps {
  /** 滚动条高度 */
  height?: string | number
  /** 滚动条最大高度 */
  maxHeight?: string | number
  /** 是否使用原生滚动条 */
  native?: boolean
  /** wrap 的外层样式 */
  wrapStyle?: CSSProperties
  /** wrap 的外层 class */
  wrapClass?: string | string[]
  /** view（内容区）样式 */
  viewStyle?: CSSProperties
  /** view（内容区）class */
  viewClass?: string | string[]
  /** 不自动检测内容变化（不挂载 ResizeObserver） */
  noresize?: boolean
  /** 滚动条是否总是可见 */
  always?: boolean
  /** 滚动条滑块最小尺寸 (px) */
  minSize?: number
  /** 滚动条 id */
  id?: string
  /** 滚动条 class */
  class?: string
  /** 视图的元素标签 */
  tag?: string
}

/** Scrollbar 暴露的方法 */
export interface ScrollbarInstance {
  /** 包裹层 DOM ref */
  wrapRef: Ref<HTMLElement | undefined>
  /** 滚动到指定位置 */
  scrollTo: (options: ScrollToOptions) => void
  /** 设置纵向滚动位置 */
  setScrollTop: (top: number) => void
  /** 设置横向滚动位置 */
  setScrollLeft: (left: number) => void
  /** 手动更新滚动条 */
  update: () => void
}

/** 滚动条方向 */
export type BarDirection = 'vertical' | 'horizontal'

/** Bar 组件 Props */
export interface BarProps {
  always: boolean
  minSize: number
}

/** Bar 的配置（用于计算方向相关的值） */
export interface BarConfig {
  /** 方向标识 'vertical' | 'horizontal' */
  key: 'vertical' | 'horizontal'
  /** 滚动方向 key (scrollTop | scrollLeft) */
  scroll: keyof Pick<HTMLElement, 'scrollTop' | 'scrollLeft'>
  /** 滚动尺寸 key (scrollHeight | scrollWidth) */
  scrollSize: keyof Pick<HTMLElement, 'scrollHeight' | 'scrollWidth'>
  /** DOM 偏移尺寸 key (offsetHeight | offsetWidth) */
  offsetSize: keyof Pick<HTMLElement, 'offsetHeight' | 'offsetWidth'>
  /** 客户端尺寸 key (clientHeight | clientWidth) */
  clientSize: keyof Pick<HTMLElement, 'clientHeight' | 'clientWidth'>
  /** 方向 'X' | 'Y' */
  direction: 'X' | 'Y'
  /** 鼠标事件坐标 key (clientY | clientX) */
  mouseKey: keyof Pick<MouseEvent, 'clientY' | 'clientX'>
  /** CSS 尺寸属性 'height' | 'width' */
  size: 'height' | 'width'
  /** CSS 偏移属性 'top' | 'left' */
  offset: 'top' | 'left'
  /** DOMRect 取值属性 (top | left) */
  rectOffset: keyof Pick<DOMRect, 'top' | 'left'>
}

/** 滚动事件回调参数 */
export interface ScrollbarEmitEvent {
  scrollTop: number
  scrollLeft: number
}
