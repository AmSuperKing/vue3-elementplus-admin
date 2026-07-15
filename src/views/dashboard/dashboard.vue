<template>
  <div class="dashboard-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <div class="welcome-text">
          <h2 class="welcome-title">欢迎回来, {{ userNameCn || '管理员' }}</h2>
          <p class="welcome-subtitle">祝您今天工作愉快！</p>
        </div>
        <div class="welcome-date">
          <div class="date-item">
            <Icon name="Calendar" />
            <span>{{ currentDate }}</span>
          </div>
          <div class="date-item">
            <Icon name="Clock" />
            <span class="time-display">{{ currentTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计卡片区域 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card-wrapper">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon users">
                <Icon name="svg-peoples" />
              </div>
              <div class="stat-info">
                <div class="stat-value">
                  <CountTo :start-val="0" :end-val="9687" :duration="2000" />
                </div>
                <div class="stat-label">总用户数</div>
                <div class="stat-trend up">
                  <Icon name="Top" />
                  <span>+12.5%</span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card-wrapper">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon orders">
                <Icon name="el-icon-Tickets" />
              </div>
              <div class="stat-info">
                <div class="stat-value">
                  <CountTo :start-val="0" :end-val="5678" :duration="2000" />
                </div>
                <div class="stat-label">今日订单</div>
                <div class="stat-trend up">
                  <Icon name="Top" />
                  <span>+8.3%</span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card-wrapper">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon revenue">
                <Icon name="money" />
              </div>
              <div class="stat-info">
                <div class="stat-value">
                  <CountTo :start-val="0" :end-val="89012" :duration="2000" />
                </div>
                <div class="stat-label">本月收入</div>
                <div class="stat-trend up">
                  <Icon name="Top" />
                  <span>+15.2%</span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <div class="stat-card-wrapper">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon products">
                <Icon name="Goods" />
              </div>
              <div class="stat-info">
                <div class="stat-value">
                  <CountTo :start-val="0" :end-val="4321" :duration="2000" />
                </div>
                <div class="stat-label">商品数量</div>
                <div class="stat-trend down">
                  <Icon name="Bottom" />
                  <span>-2.1%</span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <!-- 快捷访问区域 -->
    <el-row :gutter="20" class="quick-access-section">
      <el-col :span="24">
        <el-card class="quick-access-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>快捷访问</span>
            </div>
          </template>
          <div class="quick-access-grid">
            <div class="quick-access-item" @click="navigateTo('/editor/markdownEditor')">
              <div class="access-icon editor">
                <Icon name="EditPen" />
              </div>
              <div class="access-info">
                <div class="access-title">编辑器</div>
                <div class="access-desc">6种编辑工具</div>
              </div>
            </div>
            <div class="quick-access-item" @click="navigateTo('/fileViewer/pdfViewer')">
              <div class="access-icon file">
                <Icon name="Document" />
              </div>
              <div class="access-info">
                <div class="access-title">文件查看器</div>
                <div class="access-desc">PDF/Office预览</div>
              </div>
            </div>
            <div class="quick-access-item" @click="navigateTo('/media/compress')">
              <div class="access-icon media">
                <Icon name="PictureRounded" />
              </div>
              <div class="access-info">
                <div class="access-title">文件压缩</div>
                <div class="access-desc">图片/视频压缩</div>
              </div>
            </div>
            <div class="quick-access-item" @click="navigateTo('/table/TableExample')">
              <div class="access-icon table">
                <Icon name="Grid" />
              </div>
              <div class="access-info">
                <div class="access-title">表格</div>
                <div class="access-desc">嵌套表格示例</div>
              </div>
            </div>
            <div class="quick-access-item" @click="navigateTo('/components/scrollbar')">
              <div class="access-icon component">
                <Icon name="Sunset" />
              </div>
              <div class="access-info">
                <div class="access-title">组件</div>
                <div class="access-desc">自定义组件</div>
              </div>
            </div>
            <div class="quick-access-item" @click="navigateTo('/icons/list')">
              <div class="access-icon icon">
                <Icon name="HelpFilled" />
              </div>
              <div class="access-info">
                <div class="access-title">图标资源</div>
                <div class="access-desc">图标库展示</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 主要内容区域 -->
    <el-row :gutter="20" class="main-content">
      <!-- 左侧图表区域 -->
      <el-col :xs="24" :lg="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>数据趋势分析</span>
              <el-radio-group v-model="chartPeriod" size="small">
                <el-radio-button value="week">本周</el-radio-button>
                <el-radio-button value="month">本月</el-radio-button>
                <el-radio-button value="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="chartRef" class="echarts-container"></div>
        </el-card>
      </el-col>

      <!-- 右侧活动时间线 -->
      <el-col :xs="24" :lg="8">
        <el-card class="activity-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>活动时间线</span>
              <el-button type="primary" size="small" text>查看全部</el-button>
            </div>
          </template>
          <el-timeline class="activity-timeline">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.time"
              :type="activity.type"
              :color="activity.color"
            >
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-desc">{{ activity.desc }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部信息区域 -->
    <el-row :gutter="20" class="bottom-section">
      <el-col :xs="24" :lg="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>系统健康状态</span>
              <el-tag :type="systemHealth.type" size="small">{{ systemHealth.status }}</el-tag>
            </div>
          </template>
          <div class="system-status">
            <div class="status-item">
              <div class="status-label">
                <Icon name="Odometer" />
                <span>服务器运行时间</span>
              </div>
              <div class="status-value">15天 8小时 32分钟</div>
            </div>
            <div class="status-item">
              <div class="status-label">
                <Icon name="Cpu" />
                <span>CPU使用率</span>
              </div>
              <div class="status-progress">
                <el-progress :percentage="35" :color="getProgressColor(35)" />
              </div>
            </div>
            <div class="status-item">
              <div class="status-label">
                <Icon name="svg-save-fill" class="fs-16" />
                <span>内存使用率</span>
              </div>
              <div class="status-progress">
                <el-progress :percentage="62" :color="getProgressColor(62)" />
              </div>
            </div>
            <div class="status-item">
              <div class="status-label">
                <Icon name="Coin" />
                <span>磁盘空间</span>
              </div>
              <div class="status-progress">
                <el-progress :percentage="78" :color="getProgressColor(78)" />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>通知中心</span>
              <el-badge :value="unreadCount" class="notification-badge" />
            </div>
          </template>
          <div class="notifications">
            <div
              v-for="(notification, index) in notifications"
              :key="index"
              class="notification-item"
              :class="{ unread: notification.unread }"
            >
              <el-tag :type="notification.type" size="small">{{ notification.tag }}</el-tag>
              <span class="notification-text">{{ notification.text }}</span>
              <span class="notification-time">{{ notification.time }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfo'
import CountTo from '@/components/CountTo/CountTo.vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const router = useRouter()
const userInfoStore = useUserInfoStore()
const userNameCn = computed(() => userInfoStore.userNameCn)

// Date and time
const currentDate = ref('')
const currentTime = ref('')
let dateTimer: ReturnType<typeof setInterval> | null = null

const updateDateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Chart
const chartRef = ref<HTMLElement>()
const chartPeriod = ref('week')
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  updateChart()

  window.addEventListener('resize', handleChartResize)
}

const updateChart = () => {
  if (!chartInstance) return

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['访问量', '订单数', '收入']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        itemStyle: {
          color: '#ff7979'
        }
      },
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        data: [320, 332, 301, 334, 390, 330, 320],
        itemStyle: {
          color: '#67c23a'
        }
      },
      {
        name: '收入',
        type: 'bar',
        data: [1200, 1320, 1010, 1340, 2900, 2300, 2100],
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#248ff7"
            },
            {
              offset: 0.5,
              color: "#409eff"
            },
            {
              offset: 1,
              color: "#6851f1"
            }
          ])
        },
        barMaxWidth: 50
      }
    ]
  }

  chartInstance.setOption(option)
}

const handleChartResize = () => {
  chartInstance?.resize()
}

// Activities
const activities = ref([
  {
    time: '10:30',
    title: '新用户注册',
    desc: '用户 user123 完成注册',
    type: 'primary' as const,
    color: '#409eff'
  },
  {
    time: '09:45',
    title: '订单完成',
    desc: '订单 #12345 已完成支付',
    type: 'success' as const,
    color: '#67c23a'
  },
  {
    time: '09:15',
    title: '系统更新',
    desc: '系统版本更新至 v2.1.0',
    type: 'warning' as const,
    color: '#e6a23c'
  },
  {
    time: '08:30',
    title: '备份完成',
    desc: '数据库自动备份成功',
    type: 'info' as const,
    color: '#909399'
  }
])

// System health
const systemHealth = ref({
  status: '运行正常',
  type: 'success' as const
})

const getProgressColor = (percentage: number) => {
  if (percentage < 50) return '#67c23a'
  if (percentage < 80) return '#e6a23c'
  return '#f56c6c'
}

// Notifications
const unreadCount = ref(3)
const notifications = ref([
  {
    tag: '成功',
    text: '系统备份已完成',
    time: '2小时前',
    type: 'success' as const,
    unread: true
  },
  {
    tag: '警告',
    text: '存储空间即将不足',
    time: '5小时前',
    type: 'warning' as const,
    unread: true
  },
  {
    tag: '错误',
    text: '数据库连接异常',
    time: '昨天',
    type: 'danger' as const,
    unread: true
  },
  {
    tag: '信息',
    text: '新版本可用',
    time: '2天前',
    type: 'info' as const,
    unread: false
  }
])

// Navigation
const navigateTo = (path: string) => {
  router.push(path)
}

onMounted(() => {
  updateDateTime()
  dateTimer = setInterval(updateDateTime, 1000)
  initChart()
})

onBeforeUnmount(() => {
  if (dateTimer) {
    clearInterval(dateTimer)
  }
  window.removeEventListener('resize', handleChartResize)
  chartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
}

// Welcome Section
.welcome-section {
  margin-bottom: 24px;

  .welcome-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .welcome-text {
    .welcome-title {
      font-size: 28px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .welcome-subtitle {
      font-size: 14px;
      color: #909399;
      margin: 0;
    }
  }

  .welcome-date {
    display: flex;
    gap: 20px;

    .date-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #606266;
      background: #fff;
      padding: 8px 16px;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      span {
        font-weight: 500;
      }

      .time-display {
        display: inline-block;
        font-variant-numeric: tabular-nums;
      }
    }
  }
}

// Stats Cards
.stats-cards {
  margin-bottom: 24px;

  .stat-card-wrapper {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .stat-card {
    border-radius: 12px;
    border: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;

      .stat-icon {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: #fff;
        flex-shrink: 0;

        &.users {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }

        &.orders {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          box-shadow: 0 4px 16px rgba(245, 87, 108, 0.3);
        }

        &.revenue {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          box-shadow: 0 4px 16px rgba(79, 172, 254, 0.3);
        }

        &.products {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          box-shadow: 0 4px 16px rgba(67, 233, 123, 0.3);
        }
      }

      .stat-info {
        flex: 1;
        min-width: 0;

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #303133;
          margin-bottom: 4px;
          line-height: 1;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;

          &.up {
            color: #67c23a;
          }

          &.down {
            color: #f56c6c;
          }
        }
      }
    }
  }
}

// Quick Access Section
.quick-access-section {
  margin-bottom: 24px;

  .quick-access-card {
    border-radius: 12px;
    border: none;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: #303133;
    }

    .quick-access-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .quick-access-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        background: linear-gradient(135deg, #e0e5ec 0%, #d4d9e2 100%);
      }

      .access-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: #fff;
        flex-shrink: 0;

        &.editor {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.file {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.media {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.table {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        &.component {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        &.icon {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        }
      }

      .access-info {
        flex: 1;
        min-width: 0;

        .access-title {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 4px;
        }

        .access-desc {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
}

// Main Content
.main-content {
  margin-bottom: 24px;

  .chart-card,
  .activity-card {
    border-radius: 12px;
    border: none;
    height: 100%;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: #303133;
    }
  }

  .echarts-container {
    height: 400px;
    width: 100%;
  }

  .activity-timeline {
    padding: 8px 0;

    .activity-content {
      .activity-title {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 4px;
      }

      .activity-desc {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}

// Bottom Section
.bottom-section {
  .info-card {
    border-radius: 12px;
    border: none;
    height: 100%;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: #303133;
    }

    .system-status {
      .status-item {
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }

        .status-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #606266;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .status-value {
          font-size: 14px;
          color: #303133;
          font-weight: 600;
        }

        .status-progress {
          :deep(.el-progress) {
            .el-progress__text {
              font-size: 12px !important;
            }
          }
        }
      }
    }

    .notifications {
      .notification-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.2s ease;
        cursor: pointer;

        &:hover {
          background-color: #f5f7fa;
        }

        &:last-child {
          border-bottom: none;
        }

        &.unread {
          .notification-text {
            color: #303133;
            font-weight: 500;
          }
        }

        .notification-text {
          flex: 1;
          margin: 0 12px;
          font-size: 14px;
          color: #606266;
        }

        .notification-time {
          font-size: 12px;
          color: #909399;
          white-space: nowrap;
        }
      }
    }
  }
}

// Responsive Design
@media (max-width: 1200px) {
  .quick-access-section {
    .quick-access-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

@media (max-width: 992px) {
  .welcome-section {
    .welcome-content {
      flex-direction: column;
      align-items: flex-start;
    }

    .welcome-date {
      width: 100%;
      justify-content: flex-start;
    }
  }

  .quick-access-section {
    .quick-access-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 12px;
  }

  .welcome-section {
    margin-bottom: 16px;

    .welcome-text {
      .welcome-title {
        font-size: 24px;
      }
    }

    .welcome-date {
      flex-direction: column;
      gap: 8px;

      .date-item {
        width: 100%;
        justify-content: center;
      }
    }
  }

  .stats-cards {
    margin-bottom: 16px;

    .stat-card-wrapper {
      margin-bottom: 12px;
    }
  }

  .quick-access-section {
    margin-bottom: 16px;

    .quick-access-grid {
      grid-template-columns: 1fr;
    }
  }

  .main-content {
    margin-bottom: 16px;

    .echarts-container {
      height: 300px;
    }
  }

  .bottom-section {
    .info-card {
      margin-bottom: 16px;
    }
  }
}

@media (max-width: 576px) {
  .dashboard-container {
    padding: 8px;
  }

  .stat-card {
    .stat-content {
      .stat-icon {
        width: 56px;
        height: 56px;
        font-size: 24px;
      }

      .stat-info {
        .stat-value {
          font-size: 24px;
        }
      }
    }
  }

  .quick-access-item {
    padding: 16px;

    .access-icon {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }
  }
}
</style>
