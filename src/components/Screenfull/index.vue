<template>
  <span class="fullscreen-btn">
    <Icon :name="isFullscreen ? 'svg-exit-fullscreen' : 'svg-fullscreen'" :color="props.color" @click="onClick" />
  </span>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import screenfull from 'screenfull'
import { ElMessage } from 'element-plus'

interface ScreenfullProps {
  color?: string
}

defineOptions({ name: 'Screenfull' })

const props = withDefaults(defineProps<ScreenfullProps>(), {
  color: '#5a5e66',
})

const isFullscreen = ref(false)

const init = () => {
  if (screenfull.isEnabled) {
    screenfull.on('change', screenfullChange)
  }
}
const screenfullChange = () => {
  isFullscreen.value = screenfull.isFullscreen
}
const onClick = () => {
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

onMounted(() => {
  init()
})
onBeforeUnmount(() => {
  destroy()
})
</script>

<style lang="scss" scoped>
.fullscreen-btn {
  cursor: pointer;
}
</style>
