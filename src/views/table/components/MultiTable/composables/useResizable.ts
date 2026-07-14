import { ref } from 'vue'

export function useResizable() {
  const widthOverrides = ref<Record<string, number>>({})

  // 拖拽状态
  const resizing = ref(false)
  const resizeColIndex = ref<string>('')
  const startX = ref(0)
  const startWidth = ref(0)

  function onResizeMouseDown(
    e: MouseEvent,
    dataIndex: string,
    currentWidth: number
  ) {
    e.preventDefault()
    e.stopPropagation()

    resizing.value = true
    resizeColIndex.value = dataIndex
    startX.value = e.clientX
    startWidth.value = currentWidth

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  function onMouseMove(e: MouseEvent) {
    if (!resizing.value) return
    const diff = e.clientX - startX.value
    const newWidth = Math.max(50, startWidth.value + diff)
    widthOverrides.value = {
      ...widthOverrides.value,
      [resizeColIndex.value]: newWidth,
    }
  }

  function onMouseUp() {
    resizing.value = false
    resizeColIndex.value = ''
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  function getEffectiveWidth(dataIndex: string, defaultWidth: number): number {
    return widthOverrides.value[dataIndex] ?? defaultWidth
  }

  return {
    widthOverrides, // 列宽度覆盖
    resizing, // 拖拽状态
    resizeColIndex, // 当前正在拖拽的列索引
    onResizeMouseDown, // 鼠标按下事件处理函数
    getEffectiveWidth, // 获取有效宽度
  }
}
