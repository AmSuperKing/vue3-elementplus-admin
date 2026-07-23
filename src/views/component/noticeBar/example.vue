<template>
  <div>
    <div class="w-400">
      <!-- 基础横向滚动 -->
      <NoticeBar text="这是一条很长的通知文本内容，用于测试横向滚动效果展示，当内容超出容器宽度时会自动滚动播放。" class="mtb-20" @click="onClick" />

      <!-- 多条消息纵向逐条滚动 -->
      <NoticeBar
        :text="['通知一：系统维护公告', '通知二：新版本已发布', '通知三：活动即将开始']"
        :height="40"
        class="mtb-20"
         @click="onClick"
      />

      <!-- 可关闭模式 -->
      <NoticeBar
        mode="closeable"
        text="这是一条可关闭的通知消息"
        class="mtb-20"
         @click="onClick"
        @close="onClose"
      />

      <!-- 链接模式 + 自定义左侧图标 -->
      <NoticeBar mode="link" text="点击查看详情"  class="mtb-20"  @click="onClick">
        <template #left-icon>
          <span>🔔</span>
        </template>
      </NoticeBar>

      <!-- 自定义样式 + 暂停 -->
      <NoticeBar
        text="鼠标移入暂停，移出继续滚动。这是一条很长的通知文本内容，用于测试效果展示，可鼠标移入移出进行测试"
        color="#fff"
        background="#e6553a"
        :speed="80"
        :delay="0.5"
        pausedable
        class="mtb-20"
         @click="onClick"
      />

      <!-- 禁用滚动 + 文本换行 -->
      <NoticeBar
        text="这是一条不会滚动的通知文本，启用换行后可以多行展示完整的内容信息。"
        :scrollable="false"
        wrapable
        :height="60"
        class="mtb-20"
         @click="onClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NoticeBar from './NoticeBar.vue'

function onClick() {
  console.log('通知栏已点击')
}

function onClose() {
  console.log('通知栏已关闭')
}
</script>
