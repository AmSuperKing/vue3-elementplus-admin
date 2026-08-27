<template>
  <div id="menu-sidebar" class="sidebar">
    <div v-if="device.isMobile && !sidebar.collapse" class="sidebar-header">
      <Fold class="fold-icon" @click="handleCollapse" />
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu id="menu-list" class="sidebar-el-menu" :default-active="onRoutes" :collapse="sidebar.collapse"
        :background-color="menuStyle.backgroundColor" :text-color="menuStyle.textColor"
        :active-text-color="menuStyle.activeTextColor">
        <menu-item v-for="item of userInfo.authMenus" :key="item.path" :item="item" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfo'
import { useSidebarStore } from '@/stores/sidebar'
import { useDeviceStore } from '@/stores/device'
import { useThemeStore } from '@/stores/theme'
import MenuItem from './VMenuItem.vue'

const route = useRoute()
const userInfo = useUserInfoStore()
const sidebar = useSidebarStore()
const device = useDeviceStore()
const themeStore = useThemeStore()

// 动态菜单样式（跟随主题色变化）
const menuStyle = computed(() => ({
  backgroundColor: themeStore.isDark ? 'var(--menu-bg)' : 'var(--menu-bg, #e7ecf3)',
  textColor: themeStore.isDark ? 'var(--text-color-primary, #ffffff)' : 'var(--menu-text)',
  activeTextColor: themeStore.primaryColor,
}))

const onRoutes = computed(() => route.path)

const handleCollapse = () => {
  sidebar.toggleCollappse()
}
</script>

<style lang="scss" scoped>
.sidebar {
  display: block;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: var(--menu-bg);
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-header {
    position: relative;
    width: 210px;
    height: 56px;
    border-bottom: 1px solid var(--sub-menu-border);
    background-color: var(--sidebar-header-bg);
    background-image: url('../../assets/imgs/logo.png');
    background-position: center center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    transition: all 0.3s ease-in-out;
    transition-delay: 0.3s;

    .fold-icon {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      color: rgba(var(--el-color-primary-rgb), 0.7);
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  .el-scrollbar {
    height: 100%;
  }
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu {
  border-right-width: 0px !important;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 210px;
}

.sidebar>ul {
  height: 100%;
}
</style>
