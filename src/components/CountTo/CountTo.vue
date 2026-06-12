<template>
  <span>{{ displayValue }}</span>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

// 定义窗口对象的扩展接口
interface WindowWithPrefixes extends Window {
  [key: string]: unknown
}

/**
 * Props 定义接口
 */
interface CountToProps {
  startVal?: number
  endVal?: number
  duration?: number
  autoplay?: boolean
  decimals?: number
  decimal?: string
  separator?: string
  prefix?: string
  suffix?: string
  useEasing?: boolean
  easingFn?: (t: number, b: number, c: number, d: number) => number
}

/**
 * Props 定义
 * @prop {Number} startVal - 起始值，默认0
 * @prop {Number} endVal - 结束值，默认0
 * @prop {Number} duration - 动画持续时间，默认2000毫秒
 * @prop {Boolean} autoplay - 是否自动播放，默认true
 * @prop {Number} decimals - 小数位数，默认0
 * @prop {String} decimal - 小数点符号，默认"."
 * @prop {String} separator - 千分位分隔符，默认","
 * @prop {String} prefix - 前缀，默认""
 * @prop {String} suffix - 后缀，默认""
 * @prop {Boolean} useEasing - 是否使用缓动效果，默认true
 * @prop {Function} easingFn - 自定义缓动函数，默认使用指数缓动函数
 */
const props = withDefaults(defineProps<CountToProps>(), {
  startVal: 0,
  endVal: 0,
  duration: 2000,
  autoplay: true,
  decimals: 0,
  decimal: '.',
  separator: ',',
  prefix: '',
  suffix: '',
  useEasing: true,
  easingFn: (t: number, b: number, c: number, d: number) => {
    return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b
  },
})

/**
 * Emits 声明
 * 当 onMounted 时将触发 mountedCallback 事件
 * 当动画结束时将触发 callback 事件
 */
const emit = defineEmits<{
  (e: 'mountedCallback'): void
  (e: 'callback'): void
}>()

// 动画数据
const localStartVal = ref<number>(props.startVal) // 动画开始值
const displayValue = ref<string>(formatNumber(props.startVal)) // 显示值
const printVal = ref<number | null>(null) // 输出值
const paused = ref<boolean>(false) // 是否暂停
const localDuration = ref<number>(props.duration) // 动画时长
const startTime = ref<number | null>(null) // 动画开始时间
const timestamp = ref<number | null>(null) // 时间戳
const remaining = ref<number | null>(null) // 剩余时间
const rAF = ref<number | null>(null) // requestAnimationFrame ID

// 判断是CountDown还是CountUp
const countDown = computed<boolean>(() => props.startVal > props.endVal)

// 获取 requestAnimationFrame 和 cancelAnimationFrame 的兼容实现
const getRAF = () => {
  let lastTime = 0
  const prefixes = ['webkit', 'moz', 'ms', 'o'] // 各浏览器前缀

  let requestAnimationFrame: typeof window.requestAnimationFrame
  let cancelAnimationFrame: typeof window.cancelAnimationFrame

  const isServer = typeof window === 'undefined'
  if (isServer) {
    requestAnimationFrame = (() => 0) as typeof window.requestAnimationFrame
    cancelAnimationFrame = (() => { }) as typeof window.cancelAnimationFrame
  } else {
    requestAnimationFrame = window.requestAnimationFrame
    cancelAnimationFrame = window.cancelAnimationFrame

    // 通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
    for (const prefix of prefixes) {
      if (requestAnimationFrame !== undefined && cancelAnimationFrame !== undefined) {
        break
      }

      const windowWithPrefixes = window as unknown as WindowWithPrefixes

      const prefixedRequestAnimationFrame = windowWithPrefixes[`${prefix}RequestAnimationFrame`]
      const prefixedCancelAnimationFrame = windowWithPrefixes[`${prefix}CancelAnimationFrame`]
      const prefixedCancelRequestAnimationFrame = windowWithPrefixes[`${prefix}CancelRequestAnimationFrame`]

      if (prefixedRequestAnimationFrame && typeof prefixedRequestAnimationFrame === 'function' && !requestAnimationFrame) {
        requestAnimationFrame = prefixedRequestAnimationFrame as typeof window.requestAnimationFrame
      }

      if (prefixedCancelAnimationFrame && typeof prefixedCancelAnimationFrame === 'function' && !cancelAnimationFrame) {
        cancelAnimationFrame = prefixedCancelAnimationFrame as typeof window.cancelAnimationFrame
      } else if (prefixedCancelRequestAnimationFrame && typeof prefixedCancelRequestAnimationFrame === 'function' && !cancelAnimationFrame) {
        cancelAnimationFrame = prefixedCancelRequestAnimationFrame as typeof window.cancelAnimationFrame
      }
    }

    // 如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
    if (!requestAnimationFrame || !cancelAnimationFrame) {
      requestAnimationFrame = ((callback: FrameRequestCallback) => {
        const currTime = new Date().getTime()
        // 为了使setTimteout的尽可能的接近每秒60帧的效果
        const timeToCall = Math.max(0, 16 - (currTime - lastTime))
        const id = window.setTimeout(() => {
          callback(currTime + timeToCall)
        }, timeToCall)
        lastTime = currTime + timeToCall
        return id as number
      }) as typeof window.requestAnimationFrame

      cancelAnimationFrame = ((id: number) => {
        window.clearTimeout(id)
      }) as typeof window.cancelAnimationFrame
    }
  }

  return { requestAnimationFrame, cancelAnimationFrame }
}

const { requestAnimationFrame, cancelAnimationFrame } = getRAF()

// 判断是否为数字
function isNumber(val: unknown): boolean {
  return !isNaN(parseFloat(String(val)))
}

// 格式化数字, 添加千分位、小数位、前后缀等
function formatNumber(num: number): string {
  num = Number(num.toFixed(props.decimals))
  const numStr = num.toString()
  const parts = numStr.split('.')
  let integerPart = parts[0] || ''
  const decimalPart = parts.length > 1 ? props.decimal + parts[1] : ''
  const rgx = /(\d+)(\d{3})/

  if (props.separator && !isNumber(props.separator)) {
    while (rgx.test(integerPart)) {
      integerPart = integerPart.replace(rgx, '$1' + props.separator + '$2')
    }
  }

  return props.prefix + integerPart + decimalPart + props.suffix
}

// 动画主函数
function count(ts: number) {
  if (!startTime.value) startTime.value = ts
  timestamp.value = ts
  const progress = ts - startTime.value
  remaining.value = localDuration.value - progress

  if (props.useEasing) {
    if (countDown.value) {
      printVal.value = localStartVal.value - props.easingFn!(progress, 0, localStartVal.value - props.endVal, localDuration.value)
    } else {
      printVal.value = props.easingFn!(progress, localStartVal.value, props.endVal - localStartVal.value, localDuration.value)
    }
  } else {
    if (countDown.value) {
      printVal.value = localStartVal.value - (localStartVal.value - props.endVal) * (progress / localDuration.value)
    } else {
      printVal.value = localStartVal.value + (props.endVal - localStartVal.value) * (progress / localDuration.value)
    }
  }

  if (countDown.value) {
    printVal.value = printVal.value! < props.endVal ? props.endVal : printVal.value
  } else {
    printVal.value = printVal.value! > props.endVal ? props.endVal : printVal.value
  }

  displayValue.value = formatNumber(printVal.value!)

  if (progress < localDuration.value) {
    rAF.value = requestAnimationFrame(count)
  } else {
    emit('callback')
  }
}

// 开始动画
function start() {
  localStartVal.value = props.startVal
  startTime.value = null
  localDuration.value = props.duration
  paused.value = false
  rAF.value = requestAnimationFrame(count)
}

// 暂停动画
function pause() {
  if (rAF.value !== null) {
    cancelAnimationFrame(rAF.value)
  }
}

// 恢复动画
function resume() {
  startTime.value = null
  localDuration.value = Number(remaining.value)
  localStartVal.value = Number(printVal.value)
  rAF.value = requestAnimationFrame(count)
}

// 停止动画与恢复动画切换
function pauseResume() {
  if (paused.value) {
    resume()
    paused.value = false
  } else {
    pause()
    paused.value = true
  }
}

// 重置动画
function reset() {
  startTime.value = null
  if (rAF.value !== null) {
    cancelAnimationFrame(rAF.value)
  }
  displayValue.value = formatNumber(props.startVal)
}

// 监听 startVal 和 endVal 变化
watch(
  () => props.startVal,
  () => {
    if (props.autoplay) start()
  },
)

watch(
  () => props.endVal,
  () => {
    if (props.autoplay) start()
  },
)

onMounted(() => {
  if (props.autoplay) {
    start()
  }
  emit('mountedCallback')
})

onBeforeUnmount(() => {
  if (rAF.value !== null) {
    cancelAnimationFrame(rAF.value)
  }
})

defineExpose({
  start,
  pauseResume,
  reset,
})
</script>
