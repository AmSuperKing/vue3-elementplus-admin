<template>
  <div class="layout-container">
    <div v-if="device.isMobile && !sidebar.collapse" class="sidebar-mask" @click="handleMaskClick"></div>

    <VSideBar class="sidebar-wrapper" :class="{
      'sidebar-mobile': device.isMobile,
      'sidebar-visible': !sidebar.collapse,
      'sidebar-hidden': sidebar.collapse
    }" />

    <div class="main-wrapper">
      <div class="header-container">
        <VHeader />
        <TagsView />
      </div>

      <el-scrollbar>
        <div class="content-container">
          <AppMain />
          <el-backtop target=".content-container" style="z-index: 1999;" />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'
import VSideBar from './components/VSideBar.vue'
import VHeader from './components/VHeader.vue'
import TagsView from './components/VTagsView.vue'
import AppMain from './components/AppMain.vue'
import { useSidebarStore } from '@/stores/sidebar'
import { useDeviceStore } from '@/stores/device'

const sidebar = useSidebarStore()
const device = useDeviceStore()

const BREAKPOINT = 992

// 使用requestAnimationFrame优化性能
let rafId: number | null = null
let lastWidth: number = 0

const checkDevice = () => {
  // 取消之前的动画帧请求
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }

  // 使用requestAnimationFrame确保在浏览器下次重绘前执行
  rafId = requestAnimationFrame(() => {
    const currentWidth = window.innerWidth
    const isMobile = currentWidth < BREAKPOINT

    // 只有当宽度发生变化时才更新状态
    if (currentWidth !== lastWidth || isMobile !== device.isMobile) {
      lastWidth = currentWidth

      if (isMobile !== device.isMobile) {
        device.setIsMobile(isMobile)

        if (isMobile) {
          sidebar.setCollapse(true)
        } else {
          sidebar.setCollapse(false)
        }
      }
    }

    rafId = null
  })
}

// 防抖函数，限制resize事件的处理频率
const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(fn: T, delay: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

const debouncedCheckDevice = debounce(checkDevice, 100)

const handleMaskClick = () => {
  sidebar.setCollapse(true)
}

onMounted(() => {
  checkDevice()
  window.addEventListener('resize', debouncedCheckDevice)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedCheckDevice)
  // 清理可能存在的动画帧
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.layout-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.sidebar-wrapper {
  height: 100%;
  background-color: $menuBg;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.sidebar-visible {
  width: 210px;
}

.sidebar-hidden {
  width: 63px;
}

.sidebar-mobile {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 2001;
  width: 210px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);

  &.sidebar-hidden {
    transform: translateX(-100%);
  }

  &.sidebar-visible {
    transform: translateX(0);
  }
}

.sidebar-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 1;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(2px);
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.header-container {
  flex-shrink: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 999;
}

.content-container {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  background: $contentBg;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
}

@media screen and (max-width: 768px) {
  .content-container {
    padding: 8px;
  }
}

@media screen and (max-width: 576px) {
  .content-container {
    padding: 6px;
  }
}
</style>
