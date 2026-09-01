// directives/move.ts
import type { ObjectDirective, DirectiveBinding } from 'vue'

// ===================== 类型定义 =====================

/** 元素上的 vMove 状态存储接口 */
interface ElementWithMoveState extends HTMLElement {
  [MOVE_STATE_KEY]?: MoveState
}



/** 拖拽轴约束 */
type Axis = 'x' | 'y' | 'both'

/** 边界类型 */
type BoundaryType = 'parent' | 'viewport' | string | HTMLElement

/** 拖拽事件回调数据 */
interface MoveEventData {
  /** 当前 translateX 偏移量 */
  x: number
  /** 当前 translateY 偏移量 */
  y: number
  /** 本次移动的增量 X */
  deltaX: number
  /** 本次移动的增量 Y */
  deltaY: number
  /** 原始鼠标/触摸事件 */
  event: MouseEvent | TouchEvent
}

/** 指令配置选项 */
interface MoveOptions {
  /** 是否禁用拖拽 */
  disabled?: boolean
  /** 拖拽轴约束：'x' | 'y' | 'both' */
  axis?: Axis
  /** 拖拽手柄的 CSS 选择器（不设置则整个元素可拖拽） */
  handle?: string
  /**
   * 拖拽边界
   * - 'parent': 父元素
   * - 'viewport': 视口
   * - CSS 选择器字符串
   * - HTMLElement 实例
   */
  boundary?: BoundaryType
  /** 网格吸附 [gridX, gridY]，如 [10, 10] 表示每次移动吸附 10px */
  grid?: [number, number]
  /** 拖拽开始回调 */
  onStart?: (el: HTMLElement, data: MoveEventData) => void
  /** 拖拽中回调（节流于 rAF） */
  onMove?: (el: HTMLElement, data: MoveEventData) => void
  /** 拖拽结束回调 */
  onEnd?: (el: HTMLElement, data: MoveEventData) => void
}

/** 内部状态（挂载在元素上） */
interface MoveState {
  /** 是否正在拖拽 */
  isDragging: boolean
  /** 鼠标/触摸按下时的客户端坐标 */
  startClientX: number
  startClientY: number
  /** 按下时元素已有的 translate 偏移 */
  originX: number
  originY: number
  /** 上一次帧的偏移（用于计算 delta） */
  prevX: number
  prevY: number
  /** 当前偏移 */
  currentX: number
  currentY: number
  /** rAF ID */
  rafId: number | null
  /** 最新的事件对象（用于 rAF 读取） */
  pendingEvent: MouseEvent | TouchEvent | null
  /** 解析后的配置 */
  options: ResolvedOptions
  /** 绑定的事件处理函数（用于移除） */
  onMouseDown: (e: MouseEvent) => void
  onMouseMove: (e: MouseEvent) => void
  onMouseUp: (e: MouseEvent) => void
  onTouchStart: (e: TouchEvent) => void
  onTouchMove: (e: TouchEvent) => void
  onTouchEnd: (e: TouchEvent) => void
  /** 手柄元素引用 */
  handleEl: HTMLElement | null
  /** 是否已初始化 position/transform */
  initialized: boolean
}

interface ResolvedOptions {
  disabled: boolean
  axis: Axis
  handle: string | null
  boundary: BoundaryType | null
  grid: [number, number] | null
  onStart?: (el: HTMLElement, data: MoveEventData) => void
  onMove?: (el: HTMLElement, data: MoveEventData) => void
  onEnd?: (el: HTMLElement, data: MoveEventData) => void
}

// ===================== 工具函数 =====================

/** 从元素的 transform 中解析出 translateX 和 translateY */
function parseTranslate(el: HTMLElement): { x: number; y: number } {
  const style = getComputedStyle(el)
  const transform = style.transform

  if (!transform || transform === 'none') {
    return { x: 0, y: 0 }
  }

  // matrix(a, b, c, d, tx, ty) — 2D
  const matrix2d = transform.match(
    /matrix\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/
  )
  if (matrix2d && matrix2d.length > 6) {
    return {
      x: parseFloat(matrix2d[5] || '0') || 0,
      y: parseFloat(matrix2d[6] || '0') || 0,
    }
  }

  // matrix3d(...) — 3D, tx = m[12], ty = m[13]
  const matrix3d = transform.match(/matrix3d\((.+)\)/)
  if (matrix3d && matrix3d[1]) {
    const values = matrix3d[1].split(',').map((v) => parseFloat(v.trim()))
    return {
      x: (values[12] || 0) as number,
      y: (values[13] || 0) as number,
    }
  }

  return { x: 0, y: 0 }
}

/** 获取事件客户端坐标 */
function getClientXY(e: MouseEvent | TouchEvent): { clientX: number; clientY: number } {
  if ('touches' in e) {
    const touch = e.touches[0] || e.changedTouches[0]
    if (touch) {
      return { clientX: touch.clientX, clientY: touch.clientY }
    }
    // 如果没有触摸点，返回默认坐标
    return { clientX: 0, clientY: 0 }
  }
  return { clientX: (e as MouseEvent).clientX, clientY: (e as MouseEvent).clientY }
}

/** 获取边界矩形 */
function getBoundaryRect(
  boundary: BoundaryType,
  el: HTMLElement
): { left: number; top: number; right: number; bottom: number } | null {
  if (boundary === 'viewport') {
    return {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
    }
  }

  let container: HTMLElement | null = null

  if (boundary === 'parent') {
    container = el.parentElement
  } else if (typeof boundary === 'string') {
    container = document.querySelector(boundary)
  } else if (boundary instanceof HTMLElement) {
    container = boundary
  }

  if (!container) return null

  const rect = container.getBoundingClientRect()
  return {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
  }
}

/** 网格吸附 */
function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize
}

/** 钳制在边界内 */
function clampToBounds(
  x: number,
  y: number,
  el: HTMLElement,
  bounds: { left: number; top: number; right: number; bottom: number }
): { x: number; y: number } {
  const rect = el.getBoundingClientRect()
  // 元素的宽高（不含 translate）
  const elWidth = rect.width
  const elHeight = rect.height

  // 当前 translate 值
  const { x: currentTx, y: currentTy } = parseTranslate(el)

  // 元素的"原始"位置 = 当前 bounding rect - 当前 translate
  const originalLeft = rect.left - currentTx
  const originalTop = rect.top - currentTy

  // 计算 translate 的极限值
  const minX = bounds.left - originalLeft
  const maxX = bounds.right - originalLeft - elWidth
  const minY = bounds.top - originalTop
  const maxY = bounds.bottom - originalTop - elHeight

  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, minY), maxY),
  }
}

// ===================== 指令核心 =====================

const MOVE_STATE_KEY = '__v_move_state__'

function resolveOptions(binding: DirectiveBinding<MoveOptions>): ResolvedOptions {
  const value = binding.value || {}
  const modifiers = binding.modifiers || {}

  // 从 modifiers 中解析 axis
  let axis: Axis = value.axis || 'both'
  if (modifiers.x) axis = 'x'
  if (modifiers.y) axis = 'y'

  // 从 modifiers 中解析 disabled
  let disabled = value.disabled ?? false
  if (modifiers.disabled) disabled = true

  return {
    disabled,
    axis,
    handle: value.handle || null,
    boundary: value.boundary || null,
    grid: value.grid || null,
    onStart: value.onStart,
    onMove: value.onMove,
    onEnd: value.onEnd,
  }
}

function initState(
  el: HTMLElement,
  options: ResolvedOptions
): MoveState {
  const state: MoveState = {
    isDragging: false,
    startClientX: 0,
    startClientY: 0,
    originX: 0,
    originY: 0,
    prevX: 0,
    prevY: 0,
    currentX: 0,
    currentY: 0,
    rafId: null,
    pendingEvent: null,
    options,
    onMouseDown: null!,
    onMouseMove: null!,
    onMouseUp: null!,
    onTouchStart: null!,
    onTouchMove: null!,
    onTouchEnd: null!,
    handleEl: null,
    initialized: false,
  }

  // ---- 拖拽开始 ----
  const onDragStart = (e: MouseEvent | TouchEvent) => {
    if (state.options.disabled) return

    // 忽略右键、中键
    if ('button' in e && (e as MouseEvent).button !== 0) return

    e.preventDefault()
    const { clientX, clientY } = getClientXY(e)
    const { x, y } = parseTranslate(el)

    state.isDragging = true
    state.startClientX = clientX
    state.startClientY = clientY
    state.originX = x
    state.originY = y
    state.prevX = x
    state.prevY = y
    state.currentX = x
    state.currentY = y

    // 设置样式
    el.style.userSelect = 'none'
    el.style.webkitUserSelect = 'none'
    el.style.touchAction = 'none'
    document.body.style.userSelect = 'none'

    // 添加全局事件
    document.addEventListener('mousemove', state.onMouseMove, { passive: false })
    document.addEventListener('mouseup', state.onMouseUp)
    document.addEventListener('touchmove', state.onTouchMove, { passive: false })
    document.addEventListener('touchend', state.onTouchEnd)
    document.addEventListener('touchcancel', state.onTouchEnd)

    const eventData: MoveEventData = {
      x, y, deltaX: 0, deltaY: 0, event: e,
    }
    state.options.onStart?.(el, eventData)

    el.dispatchEvent(new CustomEvent('move-start', { detail: eventData }))
  }

  // ---- 拖拽移动（rAF 节流） ----
  const processDragMove = () => {
    if (!state.isDragging || !state.pendingEvent) return

    const e = state.pendingEvent
    const { clientX, clientY } = getClientXY(e)

    let deltaX = clientX - state.startClientX
    let deltaY = clientY - state.startClientY

    // 轴约束
    if (state.options.axis === 'x') deltaY = 0
    if (state.options.axis === 'y') deltaX = 0

    let newX = state.originX + deltaX
    let newY = state.originY + deltaY

    // 网格吸附
    if (state.options.grid) {
      newX = snapToGrid(newX, state.options.grid[0])
      newY = snapToGrid(newY, state.options.grid[1])
    }

    // 边界约束
    if (state.options.boundary) {
      const bounds = getBoundaryRect(state.options.boundary, el)
      if (bounds) {
        const clamped = clampToBounds(newX, newY, el, bounds)
        newX = clamped.x
        newY = clamped.y
      }
    }

    // 应用 transform
    el.style.transform = `translate(${newX}px, ${newY}px)`
    el.style.willChange = 'transform'

    const moveDeltaX = newX - state.prevX
    const moveDeltaY = newY - state.prevY
    state.prevX = newX
    state.prevY = newY
    state.currentX = newX
    state.currentY = newY

    const eventData: MoveEventData = {
      x: newX, y: newY,
      deltaX: moveDeltaX, deltaY: moveDeltaY,
      event: e,
    }
    state.options.onMove?.(el, eventData)
    el.dispatchEvent(new CustomEvent('move', { detail: eventData }))

    state.pendingEvent = null
  }

  const onDragMove = (e: MouseEvent | TouchEvent) => {
    if (!state.isDragging) return
    e.preventDefault()
    state.pendingEvent = e

    // 使用 rAF 节流渲染
    if (state.rafId === null) {
      state.rafId = requestAnimationFrame(() => {
        state.rafId = null
        processDragMove()
      })
    }
  }

  // ---- 拖拽结束 ----
  const onDragEnd = (e: MouseEvent | TouchEvent) => {
    if (!state.isDragging) return

    state.isDragging = false

    // 取消 rAF
    if (state.rafId !== null) {
      cancelAnimationFrame(state.rafId)
      state.rafId = null
    }

    // 处理最后一帧（如果有未处理的移动）
    if (state.pendingEvent) {
      processDragMove()
    }

    // 移除全局事件
    document.removeEventListener('mousemove', state.onMouseMove)
    document.removeEventListener('mouseup', state.onMouseUp)
    document.removeEventListener('touchmove', state.onTouchMove)
    document.removeEventListener('touchend', state.onTouchEnd)
    document.removeEventListener('touchcancel', state.onTouchEnd)

    // 恢复样式
    el.style.userSelect = ''
    el.style.webkitUserSelect = ''
    el.style.touchAction = ''
    el.style.willChange = ''
    document.body.style.userSelect = ''

    const eventData: MoveEventData = {
      x: state.currentX, y: state.currentY,
      deltaX: 0, deltaY: 0,
      event: e,
    }
    state.options.onEnd?.(el, eventData)
    el.dispatchEvent(new CustomEvent('move-end', { detail: eventData }))
  }

  // 绑定处理函数
  state.onMouseDown = (e: MouseEvent) => onDragStart(e)
  state.onMouseMove = (e: MouseEvent) => onDragMove(e)
  state.onMouseUp = (e: MouseEvent) => onDragEnd(e)
  state.onTouchStart = (e: TouchEvent) => onDragStart(e)
  state.onTouchMove = (e: TouchEvent) => onDragMove(e)
  state.onTouchEnd = (e: TouchEvent) => onDragEnd(e)

  return state
}

function bindEvents(el: HTMLElement, state: MoveState) {
  // 确定手柄元素
  if (state.options.handle) {
    state.handleEl = el.querySelector(state.options.handle)
    if (!state.handleEl) {
      console.warn(`[v-move] Handle element not found: "${state.options.handle}"`)
      state.handleEl = el
    }
  } else {
    state.handleEl = el
  }

  const target = state.handleEl

  // 鼠标事件
  target.addEventListener('mousedown', state.onMouseDown)
  // 触摸事件（passive: false 以便 preventDefault）
  target.addEventListener('touchstart', state.onTouchStart, { passive: false })

  // 设置手柄光标样式
  if (!state.options.disabled) {
    target.style.cursor = 'grab'
  }

  state.initialized = true
}

function unbindEvents(el: HTMLElement, state: MoveState) {
  const target = state.handleEl || el

  target.removeEventListener('mousedown', state.onMouseDown)
  target.removeEventListener('touchstart', state.onTouchStart)

  // 确保全局事件也被清理
  document.removeEventListener('mousemove', state.onMouseMove)
  document.removeEventListener('mouseup', state.onMouseUp)
  document.removeEventListener('touchmove', state.onTouchMove)
  document.removeEventListener('touchend', state.onTouchEnd)
  document.removeEventListener('touchcancel', state.onTouchEnd)

  if (state.rafId !== null) {
    cancelAnimationFrame(state.rafId)
    state.rafId = null
  }

  // 恢复样式
  if (state.handleEl) {
    state.handleEl.style.cursor = ''
  }
  el.style.userSelect = ''
  el.style.webkitUserSelect = ''
  el.style.touchAction = ''
  el.style.willChange = ''
}

// ===================== 指令导出 =====================

export const move: ObjectDirective<HTMLElement, MoveOptions> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<MoveOptions>) {
    const options = resolveOptions(binding)
    const state = initState(el, options)
    ;(el as ElementWithMoveState)[MOVE_STATE_KEY] = state
    bindEvents(el, state)
  },

  updated(el: HTMLElement, binding: DirectiveBinding<MoveOptions>) {
    const state: MoveState | undefined = (el as ElementWithMoveState)[MOVE_STATE_KEY]
    if (!state) return

    const newOptions = resolveOptions(binding)

    // 如果 handle 变了，需要重新绑定
    const handleChanged = newOptions.handle !== state.options.handle

    // 更新光标
    const target = state.handleEl || el
    if (newOptions.disabled) {
      target.style.cursor = ''
    } else {
      target.style.cursor = 'grab'
    }

    state.options = newOptions

    // 如果手柄变更，重新绑定
    if (handleChanged) {
      unbindEvents(el, state)
      bindEvents(el, state)
    }
  },

  beforeUnmount(el: HTMLElement) {
    const state: MoveState | undefined = (el as ElementWithMoveState)[MOVE_STATE_KEY]
    if (!state) return

    unbindEvents(el, state)
    delete (el as ElementWithMoveState)[MOVE_STATE_KEY]
  },
}

export type { MoveOptions, MoveEventData, Axis, BoundaryType }
export default move
