<template>
  <div id="page-content" ref="contentRef" class="content">
    <router-view v-slot="{ Component, route }">
      <template v-if="Component">
        <transition name="fade-transform" mode="out-in" @enter="handleEnter">
          <keep-alive :include="tagsList.nameList" :max="8">
            <suspense>
              <template #default>
                <component :is="Component" :key="route.fullPath" />
              </template>
              <template #fallback> Loading... </template>
            </suspense>
          </keep-alive>
        </transition>
      </template>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTagsListStore } from '@/stores/tagsList'

const route = useRoute()
const tagsList = useTagsListStore()

// 页面滚动发生在 layout 的 el-scrollbar 内部 wrap 上（body 为 overflow: hidden，
// window 不滚动，router 的 scrollBehavior 因此不生效），滚动位置的存取均针对该容器
let scrollWrap: HTMLElement | null = null
const contentRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const wrap = contentRef.value?.closest('.el-scrollbar__wrap')
  scrollWrap = wrap instanceof HTMLElement ? wrap : null
})

// 以 fullPath 为键记录各页面离开时的滚动位置，切回时恢复、新开时归零
const scrollPositions = new Map<string, number>()
// 本次切换待应用的目标滚动位置
let pendingPosition = 0

watch(
  () => route.fullPath,
  (_, oldPath) => {
    // flush: 'pre' 时旧页面尚未离场，此刻读取的 scrollTop 即其真实位置
    if (scrollWrap && oldPath) scrollPositions.set(oldPath, scrollWrap.scrollTop)
    pendingPosition = scrollPositions.get(route.fullPath) ?? 0
  },
)

// 标签关闭后清除对应存档，避免重新打开同名页面时误恢复旧位置
watch(
  () => tagsList.list,
  (list) => {
    const keys = new Set(list.map((item: TagsItem) => item.path))
    scrollPositions.forEach((_, key) => {
      if (!keys.has(key)) scrollPositions.delete(key)
    })
  },
  { deep: true },
)

// out-in 模式下该钩子在新页面插入 DOM 后、本帧渲染前同步触发，归零与恢复均无视觉跳动；
// 不能用 before-enter：内容尚未插入，非零位置会被 clamp 到 0
const handleEnter = () => {
  if (scrollWrap) scrollWrap.scrollTop = pendingPosition
}
</script>

<style lang="scss" scoped></style>
