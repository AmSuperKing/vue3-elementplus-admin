<template>
  <div class="dashboard-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <div class="welcome-text">
          <h2 class="welcome-title">{{ $t('dashboard.welcome', { name: userNameCn ?? '管理员' }) }}</h2>
          <p class="welcome-subtitle">{{ $t('dashboard.wish') }}</p>
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

    <div v-permission="'sys:dashboard:viewAll'">

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
                  <div class="stat-label">{{ $t('dashboard.totalUser') }}</div>
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
                  <div class="stat-label">{{ $t('dashboard.todayOrder') }}</div>
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
                  <div class="stat-label">{{ $t('dashboard.monthIncome') }}</div>
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
                  <div class="stat-label">{{ $t('dashboard.productNum') }}</div>
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
                <span>{{ $t('dashboard.quickAccess') }}</span>
              </div>
            </template>
            <div class="quick-access-grid">
              <div class="quick-access-item" @click="navigateTo('/editor/markdownEditor')">
                <div class="access-icon editor">
                  <Icon name="EditPen" />
                </div>
                <div class="access-info">
                  <div class="access-title">{{ $t('dashboard.editor')}}</div>
                  <div class="access-desc">{{ $t('dashboard.editorCount', { number: 6 })}}</div>
                </div>
              </div>
              <div class="quick-access-item" @click="navigateTo('/fileViewer/pdfViewer')">
                <div class="access-icon file">
                  <Icon name="Document" />
                </div>
                <div class="access-info">
                  <div class="access-title">{{ $t('dashboard.fileViewer') }}</div>
                  <div class="access-desc">{{ $t('dashboard.officePreview') }}</div>
                </div>
              </div>
              <div class="quick-access-item" @click="navigateTo('/media/compress')">
                <div class="access-icon media">
                  <Icon name="PictureRounded" />
                </div>
                <div class="access-info">
                  <div class="access-title">{{ $t('dashboard.fileCompress') }}</div>
                  <div class="access-desc">{{ $t('dashboard.mediaCompress') }}</div>
                </div>
              </div>
              <div class="quick-access-item" @click="navigateTo('/table/TableExample')">
                <div class="access-icon table">
                  <Icon name="Grid" />
                </div>
                <div class="access-info">
                  <div class="access-title">{{ $t('dashboard.table') }}</div>
                  <div class="access-desc">{{ $t('dashboard.nestedTable') }}</div>
                </div>
              </div>
              <div class="quick-access-item" @click="navigateTo('/components/scrollbar')">
                <div class="access-icon component">
                  <Icon name="Sunset" />
                </div>
                <div class="access-info">
                  <div class="access-title">{{ $t('dashboard.component') }}</div>
                  <div class="access-desc">{{ $t('dashboard.customComponent') }}</div>
                </div>
              </div>
              <div class="quick-access-item" @click="navigateTo('/icons/list')">
                <div class="access-icon icon">
                  <Icon name="HelpFilled" />
                </div>
                <div class="access-info">
                  <div class="access-title">{{ $t('dashboard.iconResource') }}</div>
                  <div class="access-desc">{{ $t('dashboard.iconLibrary') }}</div>
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
                <span>{{ $t('dashboard.dataTrend') }}</span>
                <el-radio-group v-model="chartPeriod" size="small">
                  <el-radio-button value="week">{{ $t('dashboard.week') }}</el-radio-button>
                  <el-radio-button value="month">{{ $t('dashboard.month') }}</el-radio-button>
                  <el-radio-button value="year">{{ $t('dashboard.year') }}</el-radio-button>
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
                <span>{{ $t('dashboard.activityTimeline') }}</span>
                <el-button type="primary" size="small" text>{{ $t('dashboard.viewAll') }}</el-button>
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
                <span>{{ $t('dashboard.systemHealth') }}</span>
                <el-tag :type="systemHealth.type" size="small">{{ systemHealth.status }}</el-tag>
              </div>
            </template>
            <div class="system-status">
              <div class="status-item">
                <div class="status-label">
                  <Icon name="Odometer" />
                  <span>{{ $t('dashboard.serverUptime') }}</span>
                </div>
                <div class="status-value">{{ $t('dashboard.uptime', { day: 15, hour: 8, minute: 32 }) }}</div>
              </div>
              <div class="status-item">
                <div class="status-label">
                  <Icon name="Cpu" />
                  <span>{{ $t('dashboard.cpuUsage') }}</span>
                </div>
                <div class="status-progress">
                  <el-progress :percentage="35" :color="getProgressColor(35)" />
                </div>
              </div>
              <div class="status-item">
                <div class="status-label">
                  <Icon name="svg-save-fill" class="fs-16" />
                  <span>{{ $t('dashboard.memoryUsage') }}</span>
                </div>
                <div class="status-progress">
                  <el-progress :percentage="62" :color="getProgressColor(62)" />
                </div>
              </div>
              <div class="status-item">
                <div class="status-label">
                  <Icon name="Coin" />
                  <span>{{ $t('dashboard.diskSpace') }}</span>
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
                <span>{{ $t('dashboard.notificationCenter') }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useI18n } from 'vue-i18n'
import { useUserInfoStore } from '@/stores/userInfo'
import CountTo from '@/components/CountTo/CountTo.vue'

const router = useRouter()
const userInfoStore = useUserInfoStore()
const { t, locale } = useI18n()
const userNameCn = computed(() => userInfoStore.userNameCn)

// Date and time
const currentDate = ref('')
const currentTime = ref('')
let dateTimer: ReturnType<typeof setInterval> | null = null

const updateDateTime = () => {
  const now = new Date()
  // 根据当前 locale 动态选择语言标签
  const dateLocale = locale.value === 'en-US' ? 'en-US' : 'zh-CN'
  currentDate.value = now.toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
  currentTime.value = now.toLocaleTimeString(dateLocale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
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

const getChartOption = (): EChartsOption => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  legend: {
    data: [
      t('dashboard.chart.visits'),
      t('dashboard.chart.orders'),
      t('dashboard.chart.income'),
    ],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: [
      t('dashboard.weekdays.mon'),
      t('dashboard.weekdays.tue'),
      t('dashboard.weekdays.wed'),
      t('dashboard.weekdays.thu'),
      t('dashboard.weekdays.fri'),
      t('dashboard.weekdays.sat'),
      t('dashboard.weekdays.sun'),
    ],
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: t('dashboard.chart.visits'),
      type: 'line',
      smooth: true,
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      itemStyle: { color: '#ff7979' },
    },
    {
      name: t('dashboard.chart.orders'),
      type: 'line',
      smooth: true,
      data: [320, 332, 301, 334, 390, 330, 320],
      itemStyle: { color: '#67c23a' },
    },
    {
      name: t('dashboard.chart.income'),
      type: 'bar',
      data: [1200, 1320, 1010, 1340, 2900, 2300, 2100],
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#248ff7' },
          { offset: 0.5, color: '#409eff' },
          { offset: 1, color: '#6851f1' },
        ]),
      },
      barMaxWidth: 50,
    },
  ],
})

const updateChart = () => {
  if (!chartInstance) return
  chartInstance.setOption(getChartOption())
}

const handleChartResize = () => {
  chartInstance?.resize()
}

watch(locale, () => {
  updateDateTime()
  updateChart()
})

// Activities
const activitiesOrigin = ref([
  {
    time: '10:30',
    titleKey: 'dashboard.activities.userRegistration',
    descParams: { user: 'user123' },
    descKey: 'dashboard.activities.userRegistrationDesc',
    type: 'primary' as const,
    color: '#409eff',
  },
  {
    time: '09:45',
    titleKey: 'dashboard.activities.orderCompleted',
    descParams: { id: '12345' },
    descKey: 'dashboard.activities.orderCompletedDesc',
    type: 'success' as const,
    color: '#67c23a',
  },
  {
    time: '09:15',
    titleKey: 'dashboard.activities.systemUpdate',
    descParams: { version: 'v2.1.0' },
    descKey: 'dashboard.activities.systemUpdateDesc',
    type: 'warning' as const,
    color: '#e6a23c',
  },
  {
    time: '08:30',
    titleKey: 'dashboard.activities.backupCompleted',
    descParams: {},
    descKey: 'dashboard.activities.backupCompletedDesc',
    type: 'info' as const,
    color: '#909399',
  },
])
const activities = computed(() =>
  activitiesOrigin.value.map((item) => ({
    ...item,
    title: t(item.titleKey),
    desc: t(item.descKey, item.descParams),
  }))
)

// System health
const systemHealth = computed(() => ({
  status: t('dashboard.runningNormal'),
  type: 'success' as const,
}))

const getProgressColor = (percentage: number) => {
  if (percentage < 50) return '#67c23a'
  if (percentage < 80) return '#e6a23c'
  return '#f56c6c'
}

// Notifications
const unreadCount = ref(3)
const notificationsOrigin = ref([
  {
    tagKey: 'dashboard.notifications.tagSuccess',
    textKey: 'dashboard.notifications.backupDone',
    timeKey: 'dashboard.notifications.time2hAgo',
    type: 'success' as const,
    unread: true,
  },
  {
    tagKey: 'dashboard.notifications.tagWarning',
    textKey: 'dashboard.notifications.storageLow',
    timeKey: 'dashboard.notifications.time5hAgo',
    type: 'warning' as const,
    unread: true,
  },
  {
    tagKey: 'dashboard.notifications.tagError',
    textKey: 'dashboard.notifications.dbConnectionError',
    timeKey: 'dashboard.notifications.timeYesterday',
    type: 'danger' as const,
    unread: true,
  },
  {
    tagKey: 'dashboard.notifications.tagInfo',
    textKey: 'dashboard.notifications.newVersionAvailable',
    timeKey: 'dashboard.notifications.time2dAgo',
    type: 'info' as const,
    unread: false,
  },
])
const notifications = computed(() =>
  notificationsOrigin.value.map((item) => ({
    ...item,
    tag: t(item.tagKey),
    text: t(item.textKey),
    time: t(item.timeKey),
  }))
)

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
  background-color: var(--bg-color);
  min-height: 100%;
  --shadow-color-light-1: rgba(0, 0, 0, 0.05);
  --shadow-color-light-2: rgba(0, 0, 0, 0.12);
}
.dark .dashboard-container {
  --shadow-color-light-1: rgba(255, 255, 255, 0.05);
  --shadow-color-light-2: rgba(255, 255, 255, 0.08);
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
      color: var(--text-color-primary);
      margin: 0 0 8px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .welcome-subtitle {
      font-size: 14px;
      color: var(--text-color-secondary);
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
      color: var(--text-color-regular);
      background: var(--bg-color);
      padding: 8px 16px;
      border-radius: 20px;
      border-color: var(--border-color);
      box-shadow: 0 2px 8px var(--shadow-color-light-1);

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
    box-shadow: 0 12px 32px var(--shadow-color-light-2);

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px var(--shadow-color-light-2);
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
          color: var(--text-color-primary);
          margin-bottom: 4px;
          line-height: 1;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-color-secondary);
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
    box-shadow: 0 12px 32px var(--shadow-color-light-2);
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px var(--shadow-color-light-2);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: var(--text-color-primary);
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
          color: #303133;
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
    box-shadow: 0 12px 32px var(--shadow-color-light-2);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: var(--text-color-primary);
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
        color: var(--text-color-primary);
        margin-bottom: 4px;
      }

      .activity-desc {
        font-size: 12px;
        color: var(--text-color-regular);
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
    box-shadow: 0 12px 32px var(--shadow-color-light-2);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: var(--text-color-primary);
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
          color: var(--text-color-secondary);
          margin-bottom: 8px;
          font-weight: 500;
        }

        .status-value {
          font-size: 14px;
          color: var(--text-color-primary);
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
            color: var(--text-color-primary);
            font-weight: 500;
          }
        }

        .notification-text {
          flex: 1;
          margin: 0 12px;
          font-size: 14px;
          color: var(--text-color-regular);
        }

        .notification-time {
          font-size: 12px;
          color: var(--text-color-regular);
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
