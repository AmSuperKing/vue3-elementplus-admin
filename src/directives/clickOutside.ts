// directives/clickOutside.ts
import type { Directive } from 'vue'

/**
 * 指令值类型：点击外部时触发的回调
 * @param event 原生 click 事件
 */
export type ClickOutsideHandler = (event: MouseEvent) => void

/**
 * 每个指令实例的内部状态
 * 使用 WeakMap 存储，避免在 DOM 元素上挂载自定义属性，防止内存泄漏
 */
interface ClickOutsideState {
  /** 当前绑定的回调函数 */
  handler: ClickOutsideHandler
  /** 排除区域的 CSS 选择器 */
  excludeSelector?: string
  /** 是否已激活（用于跳过挂载时的首次点击） */
  active: boolean
}

/**
 * 全局状态管理
 * - stateMap: WeakMap 自动 GC，DOM 移除后状态自动回收
 * - activeElements: Set 存储当前活跃的 DOM 引用，供全局监听器遍历
 */
const stateMap = new WeakMap<HTMLElement, ClickOutsideState>()
const activeElements = new Set<HTMLElement>()
let globalListenerRegistered = false

/**
 * 全局唯一点击处理器（事件委托核心）
 * 无论页面有多少个指令实例，document 上始终只有这 1 个监听器
 */
function delegatedClickHandler(event: MouseEvent) {
  const target = event.target as HTMLElement
  // 防御性检查：确保 target 存在且在 document 内
  if (!target || !document.documentElement.contains(target)) return

  // 遍历所有活跃的指令实例
  for (const el of activeElements) {
    const state = stateMap.get(el)
    // 如果状态丢失或未激活（刚挂载还在延迟期内），则跳过
    if (!state || !state.active) continue

    // 1. 点击发生在宿主元素内部 → 忽略
    if (el.contains(target)) continue

    // 2. 点击命中排除区域（如触发按钮自身） → 忽略
    if (state.excludeSelector && target.closest(state.excludeSelector)) continue

    // 3. 触发回调，增加 try-catch 防止单个实例报错阻断其他实例
    try {
      if (typeof state.handler === 'function') {
        state.handler(event)
      }
    } catch (err) {
      console.error('[v-click-outside] handler execution error:', err)
    }
  }
}

/** 确保全局监听器只注册一次 */
function ensureGlobalListener() {
  if (!globalListenerRegistered && typeof document !== 'undefined') {
    // 使用 capture: true (捕获阶段) 监听，防止业务代码中的
    // event.stopPropagation() 导致外部点击事件被拦截而无法触发关闭
    // 可根据需要调整关闭
    document.addEventListener('click', delegatedClickHandler, true)
    globalListenerRegistered = true
  }
}

/** 当没有任何活跃实例时，安全移除全局监听器，彻底释放资源 */
function teardownGlobalListenerIfNeeded() {
  if (activeElements.size === 0 && globalListenerRegistered) {
    document.removeEventListener('click', delegatedClickHandler, true)
    globalListenerRegistered = false
  }
}

/**
 * v-click-outside 指令
 *
 * 【用法示例】
 * 1. 基础用法：<div v-click-outside="closeDropdown">...</div>
 * 2. 排除区域：<div v-click-outside:[excludeSelector]="closeDropdown">...</div>
 *
 * 【优化特性】
 * - 事件委托：全局仅 1 个 document click 监听器，极大降低多实例性能开销
 * - 响应式更新：支持 binding.value 和 binding.arg 的动态热更新
 * - 内存安全：WeakMap 存储状态，DOM 卸载后自动 GC，零 DOM 属性污染
 */
const clickOutside: Directive<
  HTMLElement,
  ClickOutsideHandler,
  string,
  string
> = {
  mounted(el, binding) {
    if (typeof document === 'undefined') return

    ensureGlobalListener()

    // 初始化实例状态
    const state: ClickOutsideState = {
      handler: binding.value,
      excludeSelector: binding.arg,
      active: false, // 初始为 false，延迟激活
    }

    stateMap.set(el, state)
    activeElements.add(el)

    // 延迟到下一个宏任务激活：若弹层由某次点击打开，
    // 可跳过该次点击事件冒泡，避免“点开即触发关闭”
    setTimeout(() => {
      const current = stateMap.get(el)
      if (current) {
        current.active = true
      }
    }, 0)
  },

  /**
   * 响应式更新钩子
   * 解决 binding.value (处理函数) 或 binding.arg (排除选择器)
   * 是响应式变量时，状态无法同步的问题
   */
  updated(el, binding) {
    const state = stateMap.get(el)
    if (!state) return

    // 精确比对，仅在值真正变化时更新引用
    if (binding.value !== state.handler) {
      state.handler = binding.value
    }
    if (binding.arg !== state.excludeSelector) {
      state.excludeSelector = binding.arg
    }
  },

  unmounted(el) {
    // 从活跃集合中移除，全局监听器遍历将不再命中此元素
    activeElements.delete(el)

    // 显式清理 WeakMap 引用（虽然 DOM 移除后 WeakMap 也会自动 GC，
    // 但显式 delete 能立即释放闭包和回调函数的内存引用）
    stateMap.delete(el)

    // 检查是否需要卸载全局监听器
    teardownGlobalListenerIfNeeded()
  },
}

export default clickOutside
