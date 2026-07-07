<template>
  <div style="padding: 20px;">

    <!-- ① 基础纵向滚动 -->
    <Scrollbar height="300px" @scroll="onScroll">
      <div v-for="i in 50" :key="i" style="padding: 10px; border-bottom: 1px solid #eee;">
        列表项 {{ i }}
      </div>
    </Scrollbar>

    <!-- ② 横向滚动 -->
    <Scrollbar height="60px" style="margin-top: 20px;">
      <div style="width: 2000px; white-space: nowrap; padding: 10px;">
        这是一段很长的横向滚动内容，用来测试横向滚动条的功能是否正常工作。
      </div>
    </Scrollbar>

    <!-- ③ 始终可见 -->
    <Scrollbar height="200px" :always="true" style="margin-top: 20px;">
      <div v-for="i in 20" :key="i" style="padding: 8px;">
        滚动条始终可见 - 项目 {{ i }}
      </div>
    </Scrollbar>

    <!-- ④ 程序化控制 -->
    <div style="margin-top: 20px; display: flex; gap: 8px;">
      <button @click="scrollToTop">回到顶部</button>
      <button @click="scrollToBottom">滚动到底部</button>
      <button @click="scrollTo100">滚动到 100px</button>
    </div>
    <Scrollbar
      ref="scrollbarRef"
      height="200px"
      style="margin-top: 10px;"
    >
      <div v-for="i in 40" :key="i" style="padding: 8px;">
        程序化滚动 - 项目 {{ i }}
      </div>
    </Scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, toValue } from 'vue'
import Scrollbar from './components/Scrollbar/Scrollbar.vue'
import type { ScrollbarInstance } from './components/Scrollbar/types'

const scrollbarRef = ref<ScrollbarInstance>()

function onScroll({ scrollTop, scrollLeft }: { scrollTop: number; scrollLeft: number }) {
  console.log('scrollTop:', scrollTop, 'scrollLeft:', scrollLeft)
}

function scrollToTop() {
  scrollbarRef.value?.setScrollTop(0)
}

function scrollToBottom() {
  const wrap = toValue(scrollbarRef.value?.wrapRef)
  if (wrap) {
    scrollbarRef.value?.setScrollTop(wrap.scrollHeight)
  }
}

function scrollTo100() {
  scrollbarRef.value?.setScrollTop(100)
}
</script>
