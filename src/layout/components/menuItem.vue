<template>
  <template v-if="item.children && item.children.length">
    <template v-if="item.children.length > 1">
      <el-sub-menu :key="item.menuPath" :index="item.menuPath" class="menu-border-bottom">
        <template #title>
          <Icon v-if="item.icon" :name="item.icon" style="padding-bottom: 2px;" />
          <span>{{ item.menuName }}</span>
        </template>
        <menu-item
          v-for="subItem in item.children"
          :key="subItem.menuPath"
          :item="subItem"
        />
      </el-sub-menu>
    </template>
    <template v-if="item.children.length === 1">
      <router-link :key="item.children[0].menuPath" :to="item.children[0].menuPath">
        <el-menu-item :index="item.children[0].menuPath" class="menu-border-bottom">
          <Icon v-if="item.icon" :name="item.icon" style="width: 24px;padding-bottom: 2px; margin-right: 5px" />
          <template #title>{{ item.children[0].menuName }}</template>
        </el-menu-item>
      </router-link>
    </template>
  </template>
  <template v-else>
    <router-link v-if="!item.hidden" :key="item.menuPath" :to="item.menuPath">
      <el-menu-item :index="item.menuPath">
        <Icon v-if="item.icon" :name="item.icon" style="width: 24px;padding-bottom: 2px; margin-right: 5px" />
        <template v-if="item.menuName" #title>{{ item.menuName }}</template>
      </el-menu-item>
    </router-link>
  </template>
</template>

<script lang="ts">

export default {
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  setup() {
    /**
     * 仅使用 @element-plus/icons-vue：
     * <el-icon v-if="item.icon" class="icon"><component :is="item.icon" /></el-icon>
     * 
     * 同时使用 @element-plus/icons-vue 和自定义svg图标，图标组件根据类型返回：
     * <Icon v-if="item.icon" :name="item.icon" />
     * 具体详细见全局自定义图标组件的使用
    */
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.menu-border-bottom {
  border-bottom: 1px solid $subMenuBorder;
}
:deep(.el-sub-menu__title:hover) {
  background-color: var(--el-color-primary-light-7) !important;
}
:deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary-light-7);
}
:deep(.el-menu-item:hover) {
  background-color: var(--el-color-primary-light-7);
}
.is-active .icon {
  color: var(--el-menu-active-color) !important;
}
</style>
