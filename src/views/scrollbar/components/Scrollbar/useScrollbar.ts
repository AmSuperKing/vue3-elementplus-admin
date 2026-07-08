import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  provide,
} from 'vue'
import type { ScrollbarProps, ScrollbarEmits } from './types'

/** 用于注入 wrapRef 到子组件 Bar 的 key */
export const scrollbarContextKey = Symbol('scrollbarContextKey')

export function useScrollbar(
  props: ScrollbarProps,
  emit: ScrollbarEmits
) {
  const scrollbarRef = ref<HTMLElement>()
  const wrapRef = ref<HTMLElement>()
  const resizeObserver = ref<ResizeObserver | null>(null)

  /** 手动触发 scroll 事件通知 Bar 更新 */
  const moveX = ref(0) // 横向滚动百分比 0-100
  const moveY = ref(0) // 纵向滚动百分比 0-100

  /** 滚动条大小百分比 */
  const sizeWidth = ref('')
  const sizeHeight = ref('')

  // 响应式的滚动位置，供 Bar 组件的 computed 依赖
  const scrollTop = ref(0)
  const scrollLeft = ref(0)

  // 解构 props 中的 distance，设置默认值为 0
  const { distance = 0 } = props;

  // ---- Wrap 的 style ----
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

  // ---- 计算滚动条大小和位置 ----
  function update() {
    if (!wrapRef.value) return
    const wrap = wrapRef.value

    // 计算滑块占比
    const heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight
    const widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth

    sizeHeight.value =
      heightPercentage < 100 ? `${Math.max(heightPercentage, props.minSize ?? 20)}%` : ''
    sizeWidth.value =
      widthPercentage < 100 ? `${Math.max(widthPercentage, props.minSize ?? 20)}%` : ''

    // 同步更新响应式数据
    scrollTop.value = wrap.scrollTop
    scrollLeft.value = wrap.scrollLeft

    // 计算滑块位置
    moveY.value = wrap.scrollHeight > wrap.clientHeight
      ? (wrap.scrollTop * 100) / wrap.clientHeight
      : 0
    moveX.value = wrap.scrollWidth > wrap.clientWidth
      ? (wrap.scrollLeft * 100) / wrap.clientWidth
      : 0
  }

  // ---- 滚动事件 ----
  function handleScroll() {
    if (!wrapRef.value) return
    const wrap = wrapRef.value

    // 滚动时更新响应式数据，触发 Bar 的 computed 重新计算
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

    // 判断是否到达底部或右部
    const scrollTopVal = wrap.scrollTop;
    const scrollLeftVal = wrap.scrollLeft;
    const scrollHeight = wrap.scrollHeight;
    const scrollWidth = wrap.scrollWidth;
    const clientHeight = wrap.clientHeight;
    const clientWidth = wrap.clientWidth;

    // 判断垂直方向是否到达底部 (距离底部 distance 像素内)
    const isVerticalEnd = scrollTopVal ? Math.ceil(scrollTopVal + clientHeight) >= scrollHeight - distance : false;
    // 判断水平方向是否到达右部 (距离右部 distance 像素内)
    const isHorizontalEnd =  scrollLeftVal ? Math.ceil(scrollLeftVal + clientWidth) >= scrollWidth - distance : false;

    // 如果到达底部或右部，触发事件
    // 可以根据需求选择触发一个事件携带方向信息，或者分别触发
    if (isVerticalEnd || isHorizontalEnd) {
      emit('end-reached', {
        direction: {
          vertical: isVerticalEnd,
          horizontal: isHorizontalEnd,
        },
        scrollTop: scrollTopVal,
        scrollLeft: scrollLeftVal,
      });
    }
  }

  // ---- 对外暴露方法 start ----
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
  // ---- 对外暴露方法 end ----

  // ---- ResizeObserver ----
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

  // ---- provide 给子组件 ----
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
