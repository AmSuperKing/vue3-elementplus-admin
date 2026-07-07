import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  provide,
} from 'vue'
import type { ScrollbarProps } from './types'

export const scrollbarContextKey = Symbol('scrollbarContextKey')

export function useScrollbar(
  props: ScrollbarProps,
  emit: (event: 'scroll', payload: { scrollTop: number; scrollLeft: number }) => void
) {
  const scrollbarRef = ref<HTMLElement>()
  const wrapRef = ref<HTMLElement>()
  const resizeObserver = ref<ResizeObserver | null>(null)

  const moveX = ref(0)
  const moveY = ref(0)
  const sizeWidth = ref('')
  const sizeHeight = ref('')

  // ✅ 新增：响应式的滚动位置，供 Bar 组件的 computed 依赖
  const scrollTop = ref(0)
  const scrollLeft = ref(0)

  const wrapStyle = computed(() => {
    const style: Record<string, string> = {}
    if (props.height) {
      style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
    }
    if (props.maxHeight) {
      style.maxHeight =
        typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
    }
    return { ...style, ...((props.wrapStyle || {}) as Record<string, string>) }
  })

  function update() {
    if (!wrapRef.value) return
    const wrap = wrapRef.value

    const heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight
    const widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth

    sizeHeight.value =
      heightPercentage < 100 ? `${Math.max(heightPercentage, props.minSize ?? 20)}%` : ''
    sizeWidth.value =
      widthPercentage < 100 ? `${Math.max(widthPercentage, props.minSize ?? 20)}%` : ''

    // 同步更新响应式数据
    scrollTop.value = wrap.scrollTop
    scrollLeft.value = wrap.scrollLeft

    moveY.value = wrap.scrollHeight > wrap.clientHeight
      ? (wrap.scrollTop * 100) / wrap.clientHeight
      : 0
    moveX.value = wrap.scrollWidth > wrap.clientWidth
      ? (wrap.scrollLeft * 100) / wrap.clientWidth
      : 0
  }

  function handleScroll() {
    if (!wrapRef.value) return
    const wrap = wrapRef.value

    // ✅ 关键：滚动时更新响应式数据，触发 Bar 的 computed 重新计算
    scrollTop.value = wrap.scrollTop
    scrollLeft.value = wrap.scrollLeft

    moveY.value = wrap.scrollHeight > wrap.clientHeight
      ? (wrap.scrollTop * 100) / wrap.clientHeight
      : 0
    moveX.value = wrap.scrollWidth > wrap.clientWidth
      ? (wrap.scrollLeft * 100) / wrap.clientWidth
      : 0

    emit('scroll', {
      scrollTop: wrap.scrollTop,
      scrollLeft: wrap.scrollLeft,
    })
  }

  function scrollTo(options: ScrollToOptions) {
    wrapRef.value?.scrollTo(options)
  }

  function setScrollTop(top: number) {
    if (!wrapRef.value) return
    const wrap = wrapRef.value
    wrap.scrollTo({ top, behavior: 'auto' })
    // 使用 requestAnimationFrame 确保在下一帧更新
    requestAnimationFrame(() => {
      update()
    })
  }

  function setScrollLeft(left: number) {
    if (!wrapRef.value) return
    const wrap = wrapRef.value
    wrap.scrollTo({ left, behavior: 'auto' })
    requestAnimationFrame(() => {
      update()
    })
  }

  function initResizeObserver() {
    if (props.noresize || !wrapRef.value) return
    const firstChild = wrapRef.value.firstElementChild
    if (!firstChild) return

    resizeObserver.value = new ResizeObserver(() => {
      update()
    })
    resizeObserver.value.observe(firstChild as Element)
  }

  function destroyResizeObserver() {
    resizeObserver.value?.disconnect()
    resizeObserver.value = null
  }

  // ✅ provide 中增加 scrollTop / scrollLeft
  provide(scrollbarContextKey, {
    scrollbarRef,
    wrapRef,
    moveX,
    moveY,
    sizeWidth,
    sizeHeight,
    scrollTop,
    scrollLeft,
  })

  onMounted(() => {
    nextTick(update)
    initResizeObserver()
  })

  onBeforeUnmount(() => {
    destroyResizeObserver()
  })

  return {
    scrollbarRef,
    wrapRef,
    wrapStyle,
    moveX,
    moveY,
    sizeWidth,
    sizeHeight,
    handleScroll,
    scrollTo,
    setScrollTop,
    setScrollLeft,
    update,
  }
}
