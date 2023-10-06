<template>
  <div id="tags-list" ref="containerRef" class="tags">
    <ul ref="tagsRef" class="tags-ul">
      <li
        v-for="(item, index) of tagsList.list"
        :key="index"
        :ref="tabsRefs.set"
        class="tags-li"
        @contextmenu.prevent="openMenu(item, $event)"
      >
        <div class="tags-li-item" :class="{ active: isActive(item.path) }">
          <router-link :to="item.path || ''" class="tags-li-title">
            {{ item.title }}
          </router-link>
          <span v-if="tagsList.list.length > 1" class="tags-li-icon" @click.prevent.stop="closeTags(index)">
            <el-icon class="tags-icon-content" :size="14"><Close /></el-icon>
          </span>
        </div>
      </li>
    </ul>

    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li v-if="isActive(selectedTag.path)" class="menu-item" tabindex="-1" @click="refresh">
        <el-icon class="menu-item-icon"><Refresh /></el-icon>刷新
      </li>
      <li class="menu-item" tabindex="-1" @click="closeCurrTag(selectedTag)">
        <el-icon class="menu-item-icon"><Close /></el-icon>关闭
      </li>
      <li v-if="isActive(selectedTag.path)" class="menu-item" tabindex="-1" @click="closeOther">
        <el-icon class="menu-item-icon"><Remove /></el-icon>关闭其他
      </li>
      <li class="menu-item" tabindex="-1" @click="closeAll">
        <el-icon class="menu-item-icon"><CircleClose /></el-icon>关闭全部
      </li>
    </ul>

    <div id="tags-operation" class="tags-close-box">
      <el-dropdown @command="handleTags">
        <span class="close-btn">
          标签选项<el-icon class="close-btn-icon"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu size="small" class="dropdown-menu">
            <el-dropdown-item :icon="DArrowLeft" command="left">关闭左侧</el-dropdown-item>
            <el-dropdown-item :icon="DArrowRight" command="right">关闭右侧</el-dropdown-item>
            <el-dropdown-item :icon="Remove" command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item :icon="CircleClose" command="all">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, onMounted, nextTick } from 'vue'
import { useTemplateRefsList } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { CircleClose, Close, DArrowLeft, DArrowRight, Refresh,Remove } from '@element-plus/icons-vue'
import { useTagsListStore } from '@/stores/tagsList'
import HorizontalScroll from './HorizontalScroll'

const route = useRoute()
const router = useRouter()

const tagsList = useTagsListStore()
const isActive = (path: string) => path && path === route.fullPath
const containerRef = ref()
const tagsRef = ref()
const tabsRefs = useTemplateRefsList()

onMounted(() => {
  setTags(route)
  new HorizontalScroll(tagsRef.value)
  document.body.addEventListener('click', closeMenu)
})

watch(route, (newVal, oldVal) => { 
  setTags(newVal) 
  const index = tagsList.list.findIndex((item: anyObj) => item.path && item.path === newVal.fullPath)
  nextTick(() => {
    if (index !== -1) selectNavTab(tabsRefs.value[index])
  })
})

// onBeforeRouteUpdate((to) => {
//   setTags(to)
//   const index = tagsList.list.findIndex(item => item.path === to.fullPath)
//   nextTick(() => {
//     if (index !== -1) selectNavTab(tabsRefs.value[index])
//   })
// })

// 设置标签
const setTags = (route: anyObj) => {
  if (!route || !route.meta.title) return
  tagsList.setTagsItem({
    name: route.name,
    title: route?.meta?.title || '未知路径',
    path: route.fullPath
  })
}
// 关闭单个标签
const closeTags = (index: number) => {
  if (index === -1 || index === undefined || index === null) return
  const delItem = tagsList.list[index]
  tagsList.closeTagsItem(index)
  const item = tagsList.list[index] ? tagsList.list[index] : tagsList.list[index - 1]
  const activeIndex = tagsList.list[index] ? index : tagsList.list[index - 1] ? index - 1 : 0
  if (item) {
    delItem.path === route.fullPath && router.push(item.path)
  } else {
    router.push('/')
  }
  nextTick(() => {
    if (activeIndex !== -1) selectNavTab(tabsRefs.value[activeIndex])
  })
}
// 关闭其他标签
const closeOther = () => {
  const index = tagsList.list.findIndex((item) => item.path && item.path === route.fullPath)
  if (index === -1) return
  tagsList.closeOtherTags(index)
}
//关闭左侧标签
const closeLeft = () => {
  const index = tagsList.list.findIndex((item: anyObj) => item.path === route.fullPath)
  if (index === -1) return
  tagsList.closeLeftTagsItem(index)
}
//关闭右侧标签
const closeRight = () => {
  const index = tagsList.list.findIndex((item: anyObj) => item.path === route.fullPath)
  if (index === -1) return
  tagsList.closeRightTagsItem(index)
}
// 关闭全部标签
const closeAll = () => {
  tagsList.clearTags()
  router.push('/')
  refresh()
}
const selectNavTab = function (dom: HTMLElement | any) {
  if (!dom) return false
  let scrollLeft = dom.offsetLeft + dom.clientWidth - tagsRef.value.clientWidth
  if (dom.offsetLeft < tagsRef.value.scrollLeft) {
    tagsRef.value.scrollTo(dom.offsetLeft, 0)
  } else if (scrollLeft > tagsRef.value.scrollLeft) {
    tagsRef.value.scrollTo(scrollLeft, 0)
  }
}
const handleTags = (command: string) => {
  switch (command) {
    case 'left':
      closeLeft()
      break
    case 'right':
      closeRight()
      break
    case 'other':
      closeOther()
      break
    case 'all':
      closeAll()
      break
    default:
      break
  }
}

const left = ref(0)
const top = ref(0)
const visible = ref(false)
const selectedTag = ref<anyObj>({})

const openMenu = (tag: anyObj, e: MouseEvent) => {
  left.value = e.clientX
  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}
const closeMenu = () => {
  visible.value = false
}
const refresh = () => {
  window.location.reload()
}
const closeCurrTag = (tag: anyObj) => {
  const index = tagsList.list.findIndex((item: anyObj) => item.path === tag.path)
  if (index === -1) return
  closeTags(index)
}

</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
$dark-text: #666;
.tags {
  position: relative;
  height: 34px;
  overflow: hidden;
  background: $tagsContainerBg;
  padding-right: 120px;
  border-bottom: 1px solid #e3e3e3;
  box-shadow: 0 2px 4px #dfdfdf;
  & .tags-ul {
    display: flex;
    box-sizing: border-box;
    list-style: none;
    width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      height: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #eaeaea;
      border-radius: var(--el-border-radius-base);
      box-shadow: none;
    }
  }
  &:hover {
    &::-webkit-scrollbar-thumb:hover {
      background: #c8c9cc;
    }
  }
}
.tags-li {
  float: left;
}
.tags-li-item {
  display: inline-block;
  flex-shrink: 0;
  position: relative;
  margin: 4px 6px 0 6px;
  padding: 0 12px;
  border-radius: 3px;
  font-size: 12px;
  // overflow: hidden;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  background: #fff;
  vertical-align: middle;
  color: $dark-text;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: all 0.3s ease-in;
  background-color: #fff;
  &::before {
    content: '';
    position: absolute;
    left: -6px;
    bottom: 0;
    width: 0;
    height: 0;
    border-bottom: 6px solid #fff;
    border-top: 6px solid transparent;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    border-radius: 2px;
    transition: all 0.3s ease-in;
  }
  &::after {
    content: '';
    position: absolute;
    right: -6px;
    bottom: 0;
    width: 0;
    height: 0;
    border-bottom: 6px solid #fff;
    border-top: 6px solid transparent;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    border-radius: 2px;
    transition: all 0.3s ease-in;
  }
  &:hover::before,
  &:hover::after {
    border-bottom-color: $tagsBg;
  }
}
.tags-li-item:not(.active):hover {
  background: $tagsBg;
}
.active {
  background: $tagsBg;
  &::before,
  &::after {
    border-bottom-color: $tagsBg;
  }
}
.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 2px;
  color: $dark-text;
}
.tags-li-item.active {
  .tags-li-title,
  .tags-icon-content {
    color: $tagActiveText;
  }
}

.tags-li-icon {
  display: inline-block;
  height: 23px;
  &:hover {
    .tags-icon-content {
      color: #fff;
      background-color: $tagActiveText;
    }
    .el-icon {
      color: #fff !important;
    }
  }
  .el-icon {
    border-radius: 50% !important;
  }
}
.tags-icon-content {
  color: $dark-text;
  top: 3px;
  left: 8px;
  border-radius: 3px;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  // box-sizing: border-box;
  // padding-top: 1px;
  // text-align: center;
  width: 110px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  &:hover {
    background-color: $tagsBg;
    .close-btn {
      color: $tagActiveText;
    }
  }

  .close-btn {
    padding: 7px 15px;
    box-sizing: border-box;
    &:hover, &:focus-visible {
      border: none;
      outline: none;
    }
    .close-btn-icon {
      margin-left: 5px;
    }
  }
}

:deep(.dropdown-menu .el-dropdown-menu__item:not(.is-disabled):hover) {
  background-color: var(--el-dropdown-menuItem-hover-fill) !important;
  color: var(--el-dropdown-menuItem-hover-color) !important;
}

.contextmenu {
  margin: 0;
  background-color: #fff;
  z-index: 9999;
  position: fixed;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
  .menu-item {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      color: $tagActiveText;
      background-color: $tagsBg;
    }
    &-icon {
      margin-right: 10px;
    }
  }
  }
</style>
