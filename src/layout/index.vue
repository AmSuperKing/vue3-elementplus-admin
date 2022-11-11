<template>
  <div>
    <div
      :class="{ 'sidebar-layer': device.isMobile && !sidebar.collapse }"
      @click="collapseChage"
    ></div>
    <VSideBar :class="device.isMobile ? 'v-sidebar-mobile' : 'v-sidebar-desktop'" />
    <div
      class="header-section"
      :class="{
        'mobile-header': device.isMobile,
        'desktop-header-open': !device.isMobile && !sidebar.collapse,
        'desktop-header-close': !device.isMobile && sidebar.collapse
      }"
    >
      <VHeader />
      <TagsView />
    </div>
    <div
      class="content"
      :class="{
        'mobile-content': device.isMobile,
        'desktop-content-open': !device.isMobile && !sidebar.collapse,
        'desktop-content-close': !device.isMobile && sidebar.collapse
      }"
    >
     <AppMain />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'
import VSideBar from './components/sideBar.vue'
import VHeader from './components/header.vue'
import TagsView from './components/tagsView.vue'
import AppMain from './components/AppMain.vue'
import { useSidebarStore } from '@/stores/sidebar'
import { useDeviceStore } from '@/stores/device'

const sidebar = useSidebarStore()
const device = useDeviceStore()

const WIDTH = 992
const resizeHandler = () => {
  const rect = document.body.getBoundingClientRect()
  if (rect.width - 1 < WIDTH) {
    device.setIsMobile(true)
    sidebar.setCollapse(true)
  } else {
    device.setIsMobile(false)
    sidebar.setCollapse(false)
  }
}
const collapseChage = () => {
  sidebar.toggleCollappse()
}

onMounted(() => {
  resizeHandler()
  window.addEventListener('resize', resizeHandler)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
})

</script>

<style lang="scss" setup>
@import '@/styles/variables.scss';
.v-sidebar-desktop {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: $menuBg;
}
.v-sidebar-mobile {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 99;
  background-color: $menuBg;
  & .el-menu--collapse {
    width: 0 !important;
    display: none !important;
  }
  & .el-scrollbar {
    height: calc(100% - 57px) !important;
  }
}

.sidebar-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
  width: 100%;
  background-color: #000;
  opacity: .4;
  transition: all .3s ease-in-out;
}

.header-section {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  transition: all .3s ease;
}
.mobile-header {
 left: 0;
}
.desktop-header-open {
  left: 210px;
}
.desktop-header-close {
  left: 63px;
}

.content {
  min-height: 100%;
  padding: 60px 10px 10px 10px;
  transition: all .3s ease;
  background: $contentBg;
}
.mobile-content {
  margin-left: 0;
}
.desktop-content-open {
  margin-left: 210px;
}
.desktop-content-close {
  margin-left: 63px;
}

</style>
