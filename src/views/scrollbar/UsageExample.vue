<template>
  <div class="p-20">

    <!-- ① 基础纵向滚动 -->
    <div class="mb-20" style="border: 1px solid #f0f0f0; border-radius: 6px;">
      <Scrollbar height="300px" @scroll="onScroll">
        <div v-for="i in 50" :key="i" style="padding: 10px; border-bottom: 1px solid #eee;">
          列表项 {{ i }}
        </div>
      </Scrollbar>
    </div>

    <!-- ② 横向滚动 -->
    <div class="mtb-20" style="border: 1px solid #f0f0f0; border-radius: 6px;">
      <Scrollbar>
        <div style="display: flex;">
            <div v-for="i in 3" :key="i" style="min-width: 2000px; white-space: nowrap; padding: 10px;flex: 1">
            这是一段很长的横向滚动内容，用来测试横向滚动条的功能是否正常工作。这是一段很长的横向滚动内容，用来测试横向滚动条的功能是否正常工作。这是一段很长的横向滚动内容，用来测试横向滚动条的功能是否正常工作。
          </div>
        </div>
      </Scrollbar>
    </div>

    <!-- ③ 始终可见 -->
    <div class="mtb-20" style="border: 1px solid #f0f0f0; border-radius: 6px;">
      <Scrollbar height="200px" :always="true">
        <div v-for="i in 20" :key="i" style="padding: 8px;">
          滚动条始终可见 - 项目 {{ i }}
        </div>
      </Scrollbar>
    </div>

    <!-- ④ 程序化控制 -->
    <div class="mtb-20" style="border: 1px solid #f0f0f0; border-radius: 6px;">
      <div class="mtb-15" style="display: flex; gap: 8px;">
        <button @click="scrollToTop">回到顶部</button>
        <button @click="scrollToBottom">滚动到底部</button>
        <button @click="scrollTo100">滚动到 100px</button>
      </div>
      <Scrollbar
        ref="scrollbarRef"
        height="200px"
      >
        <div v-for="i in 40" :key="i" style="padding: 8px;">
          程序化滚动 - 项目 {{ i }}
        </div>
      </Scrollbar>
    </div>
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
