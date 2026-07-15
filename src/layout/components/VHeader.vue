<template>
  <div class="header-bar">
    <div id="collapse-btn" class="collapse-btn" @click="collapseChage">
      <el-icon v-if="!sidebar.collapse" class="collapse-btn-icon" :size="22">
        <Fold />
      </el-icon>
      <el-icon v-else class="collapse-btn-icon" :size="22">
        <Expand />
      </el-icon>
    </div>

    <div class="logo hidden-md-and-down">{{ settings.pageTitle }}</div>

    <div class="header-right">
      <div class="right-content">
        <VMessageCenter />
        <Screenfull id="screenfull" class="screenfull-btn hidden-sm-and-down" />
        <VMenuSearch />
        <VUserMenu />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted} from 'vue'
import { useSidebarStore } from '@/stores/sidebar'
import { settings } from '@/settings'
import VMessageCenter from './VMessageCenter.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import VMenuSearch from './VMenuSearch.vue'
import VUserMenu from './VUserMenu.vue'

const sidebar = useSidebarStore()

const collapseChage = () => {
  sidebar.toggleCollappse()
}

onMounted(() => {
  if (document.body.clientWidth < 1500) {
    collapseChage()
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.header-bar {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 24px;
  color: $headerText;
  border-bottom: 1px solid $headerBg;
  background-color: #fff;

  .logo {
    float: left;
    line-height: 70px;
    font-weight: bold;
  }
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 66px;

  &:hover {
    background-color: var(--el-color-primary-light-9);
  }

  &:hover .collapse-btn-icon {
    color: #555;
  }

  .collapse-btn-icon {
    vertical-align: middle;
    color: $headerText;
  }
}

.header-right {
  position: absolute;
  top: 0;
  right: 0;
  padding-right: 15px;

  .right-content {
    position: relative;
    display: flex;
    height: 70px;
    align-items: center;
  }
}

.screenfull-btn {
  display: inline-block;
  margin-right: 15px;
  font-size: 18px;
  color: $menuText;

  &:hover {
    color: $headerText;
  }
}
</style>
