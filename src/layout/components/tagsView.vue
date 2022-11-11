<template>
  <div id="tags-list" ref="containerRef" class="tags">
    <ul ref="tagsRef">
      <li
        v-for="(item, index) in tagsList.list"
        :key="index"
        :ref="tabsRefs.set"
        :class="{ active: isActive(item.path) }"
        class="tags-li"
      >
        <router-link :to="item.path" class="tags-li-title">
          {{ item.title }}
        </router-link>
        <span v-if="tagsList.list.length > 1" class="tags-li-icon" @click="closeTags(index)">
          <el-icon class="tags-icon-content" :size="14"><Close /></el-icon>
        </span>
      </li>
    </ul>
    <div id="tags-operation" class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="small" type="primary" class="close-btn">
          标签选项
          <el-icon class="close-btn-icon"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu size="small">
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
import { DArrowLeft, DArrowRight, Remove, CircleClose } from '@element-plus/icons-vue'
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
})

watch(route, (newVal, oldVal) => { 
  setTags(newVal) 
  const index = tagsList.list.findIndex(item => item.path === newVal.fullPath)
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
  const curItem = tagsList.list.filter((item) => item.path === route.fullPath)
  if (!curItem) return
  tagsList.closeOtherTags(curItem)
}
//关闭左侧标签
const closeLeft = () => {
  const index = tagsList.list.findIndex((item) => item.path === route.fullPath)
  if (index === -1) return
  tagsList.closeLeftTagsItem(index)
}
//关闭右侧标签
const closeRight = () => {
  const index = tagsList.list.findIndex((item) => item.path === route.fullPath)
  if (index === -1) return
  tagsList.closeRightTagsItem(index)
}
// 关闭全部标签
const closeAll = () => {
  tagsList.clearTags()
  router.push('/')
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
  & ul {
    display: flex;
    box-sizing: border-box;
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
  flex-shrink: 0;
  position: relative;
  float: left;
  margin: 5px 5px 2px 5px;
  padding: 0 12px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid #e9eaec;
  background: $tagActiveText;
  vertical-align: middle;
  color: $dark-text;
  transition: all 0.3s ease-in;
}
.tags-li:not(.active):hover {
  background: $tagsBg;
}
.tags-li.active {
  color: $tagActiveText;
  background: $tagsBg;
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
.tags-li.active .tags-li-title {
  color: $tagActiveText;
}
.tags-li:not(.active):hover .tags-li-title {
  color: $tagActiveText;
}
.tags-li-icon {
  display: inline-block;
  height: 23px;
  &:hover .tags-icon-content {
    color: #fff;
    background-color: #c8c9cc;
  }
}
.tags-icon-content {
  color: $dark-text;
  top: 3px;
  left: 8px;
  border-radius: 3px;
}
.tags-li:not(.active):hover .tags-icon-content {
  color: $tagActiveText;
}
.tags-li.active .tags-icon-content {
  color: $tagActiveText;
}
.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: $tagsContainerBg;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
.close-btn {
  min-height: 28px;
  padding: 7px 15px !important;
}
.close-btn-icon {
  margin-left: 5px;
  color: $tagActiveText;
}
</style>
