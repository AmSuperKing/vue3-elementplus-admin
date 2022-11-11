<template>
  <div>
    <Icon :name="isFullscreen ? 'svg-exit-fullscreen' : 'svg-fullscreen'" color="#5a5e66" @click="click" />
  </div>
</template>

<script lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import screenfull from 'screenfull'
import { ElMessage } from 'element-plus'

export default {
  name: 'Screenfull',
  setup() {
    const isFullscreen = ref(false)

    onMounted(() => {
      init()
    })
    onBeforeUnmount(() => {
      destroy()
    })
    const init = () => {
      if (screenfull.isEnabled) {
        screenfull.on('change', screenfullChange)
      }
    }
    const screenfullChange = () => {
      isFullscreen.value = screenfull.isFullscreen
    }
    const click = () => {
      if (!screenfull.isEnabled) {
        ElMessage.warning('您的浏览器不支持全屏显示')
        return false
      }
      screenfull.toggle()
    }
    const destroy = () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', screenfullChange)
      }
    }

    return { isFullscreen, click }
  },
}
</script>

<style lang="scss" scoped></style>
