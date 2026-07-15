<template>
  <div class="message-list-container">
    <!-- 头部 -->
    <div class="message-header">
      <h3>消息列表</h3>
      <el-badge :value="unreadCount" :hidden="unreadCount === 0" type="danger">
        <el-button :icon="Bell" circle @click="handleMarkAllRead" />
      </el-badge>
    </div>

    <!-- 消息列表 -->
    <el-scrollbar ref="scrollbarRef" class="message-scrollbar">
      <el-timeline style="padding-left: 5px;">
        <el-timeline-item
          v-for="msg in messages"
          :key="msg.id"
          :timestamp="formatTime(msg.timestamp)"
          :type="getTimelineType(msg.type)"
          :hollow="msg.read"
          placement="top"
        >
          <el-card
            shadow="hover"
            :class="['message-card', { unread: !msg.read }]"
            @click="handleClick(msg)"
          >
            <div class="message-content">
              <div class="message-title">
                <el-icon v-if="!msg.read" class="unread-dot">
                  <ChatDotRound />
                </el-icon>
                <span>{{ msg.title }}</span>
              </div>
              <p class="message-body">{{ msg.content }}</p>
              <div class="message-footer">
                <el-tag :type="getTagType(msg.type)" size="small">
                  {{ msg.type }}
                </el-tag>
                <el-button
                  v-if="!msg.read"
                  type="primary"
                  link
                  size="small"
                  @click.stop="handleRead(msg)"
                >
                  标为已读
                </el-button>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <!-- 空状态 -->
      <el-empty
        v-if="messages.length === 0"
        description="暂无消息"
        :image-size="100"
      />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Bell, ChatDotRound } from '@element-plus/icons-vue'
import type { ScrollbarInstance } from 'element-plus'

// 消息类型定义
interface Message {
  id: number
  title: string
  content: string
  type: '通知' | '警告' | '成功' | '错误'
  timestamp: number
  read: boolean
}

// Props
const props = withDefaults(
  defineProps<{
    messages: Message[]
  }>(),
  {
    messages: () => [],
  }
)

// Emits
const emit = defineEmits<{
  (e: 'read', id: number): void
  (e: 'markAllRead'): void
  (e: 'click', message: Message): void
}>()

// Refs
const scrollbarRef = ref<ScrollbarInstance>()

// 计算未读数量
const unreadCount = computed(() => props.messages.filter((m) => !m.read).length)

// 格式化时间
function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

// 时间线节点类型
function getTimelineType(type: Message['type']): '' | 'primary' | 'warning' | 'success' | 'danger' | 'info' {
  const map: Record<Message['type'], '' | 'primary' | 'warning' | 'success' | 'danger' | 'info'> = {
    通知: 'primary',
    警告: 'warning',
    成功: 'success',
    错误: 'danger',
  }
  return map[type]
}

// 标签类型
function getTagType(type: Message['type']): 'primary' | 'warning' | 'success' | 'danger' | 'info' {
  const map: Record<Message['type'], 'primary' | 'warning' | 'success' | 'danger' | 'info'> = {
    通知: 'primary',
    警告: 'warning',
    成功: 'success',
    错误: 'danger',
  }
  return map[type]
}


// 点击消息
function handleClick(msg: Message) {
  if (!msg.read) {
    emit('read', msg.id)
  }
  emit('click', msg)
}

// 标记已读
function handleRead(msg: Message) {
  emit('read', msg.id)
}

// 全部标记已读
function handleMarkAllRead() {
  emit('markAllRead')
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    scrollbarRef.value?.setScrollTop(99999)
  })
}

defineExpose({ scrollToBottom })
</script>

<style lang="scss" scoped>
.message-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

.message-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.message-scrollbar {
  flex: 1;
  padding: 20px;
}

.message-card {
  cursor: pointer;
  transition: all 0.3s;
}

.message-card.unread {
  background: #ecf5ff;
  border-left: 3px solid #409eff;
}

.message-card:hover {
  transform: translateY(-2px);
}

.message-content {
  width: 100%;
}

.message-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.unread-dot {
  color: #f56c6c;
  font-size: 12px;
}

.message-body {
  margin: 0 0 12px;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
