<template>
  <template v-if="item.children && item.children.length">
    <template v-if="item.children.length > 1">
      <el-sub-menu :key="item.path" :index="item.path" class="menu-border-bottom">
        <template #title>
          <Icon v-if="item?.meta?.icon" :name="item?.meta?.icon" color="var(--menu-text-color)" size="18" style="padding-top: 2px" />
          <span>{{ item?.meta?.title }}</span>
        </template>
        <menu-item v-for="subItem in item.children" :key="subItem.path" :item="subItem" />
      </el-sub-menu>
    </template>
    <template v-if="item.children.length === 1">
      <router-link :key="item.children[0].path" :to="item.children[0].path">
        <el-menu-item :index="item.children[0].path" class="menu-border-bottom">
          <Icon v-if="item?.meta?.icon" :name="item?.meta?.icon" color="var(--menu-text)" size="18"
            style="width: 24px; padding-top: 2px; margin-right: 5px" />
          <template #title>{{ item.children[0]?.meta?.title }}</template>
        </el-menu-item>
      </router-link>
    </template>
  </template>
  <template v-else>
    <router-link v-if="!item.hidden" :key="item.path" :to="item.path">
      <el-menu-item :index="item.path">
        <Icon v-if="item?.meta?.icon" :name="item?.meta?.icon" color="var(--menu-text)" size="18"
          style="width: 24px; padding-top: 2px; margin-right: 5px" />
        <template v-if="item?.meta?.title" #title>{{ item?.meta?.title }}</template>
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
      default: () => { },
    },
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
  },
}
</script>

<style lang="scss" scoped>
.menu-border-bottom {
  border-bottom: 1px solid var(--border-color);
}
:deep(.el-sub-menu__title) {
  color: var(--menu-text) !important;
}
:deep(.el-sub-menu__title:hover) {
  color: var(--menu-active-text) !important;
  background-color: var(--menu-active-bg) !important;
}

:deep(.el-menu-item.is-active) {
  background-color: var(--menu-active-bg);
}

:deep(.el-menu-item:hover) {
  color: var(--menu-active-text) !important;
  background-color: var(--menu-active-bg);
}

.is-active .icon {
  color: var(--menu-active-text) !important;
}
</style>
