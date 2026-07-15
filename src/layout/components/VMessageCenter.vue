<template>
  <div>
    <div class="btn-bell hidden-sm-and-down">
      <el-tooltip effect="dark" :content="message ? `有${message}条未读消息` : `消息中心`" placement="bottom">
        <el-icon :color="variablesList.textColor" @click="handleBellClick">
          <Bell />
        </el-icon>
      </el-tooltip>
      <span v-if="message" class="btn-bell-badge" />
    </div>

    <el-drawer v-model="messageDrawerVisible" :with-header="false" body-class="message-list">
      <MessageList
        :messages="messageList"
        @read="onRead"
        @mark-all-read="onMarkAllRead"
        @click="onClickMessage"
      />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import variables from '@/assets/styles/variables.module.scss'
import MessageList from './MessageList.vue'

const variablesList = computed(() => variables)
const messageDrawerVisible = ref(false)
const message = ref(4)

const handleBellClick = () => {
  messageDrawerVisible.value = true
}

const messageList = ref([
  {
    id: 1,
    title: '系统更新通知',
    content: '系统将于今晚 22:00 进行维护升级，预计持续 2 小时。',
    type: '通知' as const,
    timestamp: Date.now() - 300000,
    read: false,
  },
  {
    id: 2,
    title: '存储空间不足',
    content: '当前磁盘使用率已达 92%，请及时清理无用文件。',
    type: '警告' as const,
    timestamp: Date.now() - 3600000,
    read: false,
  },
  {
    id: 3,
    title: '部署成功',
    content: 'v2.1.0 版本已成功部署到生产环境。',
    type: '成功' as const,
    timestamp: Date.now() - 86400000,
    read: true,
  },
  {
    id: 4,
    title: '接口调用异常',
    content: '/api/users 接口连续 5 次返回 500 错误，请检查服务状态。',
    type: '错误' as const,
    timestamp: Date.now() - 172800000,
    read: true,
  },
])

function onRead(id: number) {
  const msg = messageList.value.find((m) => m.id === id)
  if (msg) msg.read = true
}

function onMarkAllRead() {
  messageList.value.forEach((m) => (m.read = true))
}

function onClickMessage(msg: unknown) {
  console.log('点击消息:', msg)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.btn-bell {
  position: relative;
  width: 24px;
  padding-top: 5px;
  margin-right: 15px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;

  .btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #ff3232;
    color: $textColor;
  }
}

:deep(.message-list) {
  padding: 0;
}
</style>
