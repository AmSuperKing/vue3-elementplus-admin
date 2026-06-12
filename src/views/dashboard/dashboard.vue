<template>
  <div class="dashboard-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <h2 class="welcome-title">欢迎回来, {{ userNameCn || '管理员' }}</h2>
      <p class="welcome-subtitle">祝您今天工作愉快！</p>
    </div>

    <!-- 统计卡片区域 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon users">
              <CustomIcon name="svg-peoples" />
            </div>
            <div class="stat-info">
              <div class="stat-value">
                <CountTo :start-val="0" :end-val="9687" :duration="2000" />
              </div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon orders">
              <CustomIcon name="el-icon-Tickets" />
            </div>
            <div class="stat-info">
              <div class="stat-value">
                <CountTo :start-val="0" :end-val="5678" :duration="2000" />
              </div>
              <div class="stat-label">今日订单</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon revenue">
              <CustomIcon name="money" />
            </div>
            <div class="stat-info">
              <div class="stat-value">
                <CountTo :start-val="0" :end-val="89012" :duration="2000" />
              </div>
              <div class="stat-label">本月收入</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon products">
              <CustomIcon name="Goods" />
            </div>
            <div class="stat-info">
              <div class="stat-value">
                <CountTo :start-val="0" :end-val="4321" :duration="2000" />
              </div>
              <div class="stat-label">商品数量</div>
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
              <span>数据趋势</span>
              <el-button type="primary" size="small">查看详情</el-button>
            </div>
          </template>
          <div class="chart-placeholder">
            <div class="chart-area">
              <div class="chart-bar" style="height: 60%"></div>
              <div class="chart-bar" style="height: 80%"></div>
              <div class="chart-bar" style="height: 45%"></div>
              <div class="chart-bar" style="height: 90%"></div>
              <div class="chart-bar" style="height: 70%"></div>
              <div class="chart-bar" style="height: 85%"></div>
              <div class="chart-bar" style="height: 55%"></div>
            </div>
            <div class="chart-labels">
              <span>周一</span>
              <span>周二</span>
              <span>周三</span>
              <span>周四</span>
              <span>周五</span>
              <span>周六</span>
              <span>周日</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧快捷操作 -->
      <el-col :xs="24" :lg="8">
        <el-card class="quick-actions" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="action-buttons">
            <el-button type="primary" class="action-btn">
              <CustomIcon name="edit" />
              <span>新建任务</span>
            </el-button>
            <el-button type="success" class="action-btn">
              <CustomIcon name="user" />
              <span>添加用户</span>
            </el-button>
            <el-button type="warning" class="action-btn">
              <CustomIcon name="Document" />
              <span>生成报告</span>
            </el-button>
            <el-button type="info" class="action-btn">
              <CustomIcon name="message" />
              <span>发送消息</span>
            </el-button>
          </div>

          <div class="recent-activities">
            <h3>最近活动</h3>
            <ul class="activity-list">
              <li class="activity-item">
                <span class="activity-time">10:30</span>
                <span class="activity-desc">新用户注册</span>
              </li>
              <li class="activity-item">
                <span class="activity-time">09:45</span>
                <span class="activity-desc">订单完成</span>
              </li>
              <li class="activity-item">
                <span class="activity-time">09:15</span>
                <span class="activity-desc">系统更新</span>
              </li>
              <li class="activity-item">
                <span class="activity-time">08:30</span>
                <span class="activity-desc">备份完成</span>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部信息区域 -->
    <el-row :gutter="20" class="bottom-section">
      <el-col :xs="24" :lg="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>系统状态</span>
            </div>
          </template>
          <div class="system-status">
            <div class="status-item">
              <span class="status-label">服务器运行时间:</span>
              <span class="status-value">15天 8小时 32分钟</span>
            </div>
            <div class="status-item">
              <span class="status-label">CPU使用率:</span>
              <el-progress :percentage="35" :color="'#67c23a'" />
            </div>
            <div class="status-item">
              <span class="status-label">内存使用率:</span>
              <el-progress :percentage="62" :color="'#e6a23c'" />
            </div>
            <div class="status-item">
              <span class="status-label">磁盘空间:</span>
              <el-progress :percentage="78" :color="'#f56c6c'" />
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>通知中心</span>
              <el-badge :value="3" class="notification-badge" />
            </div>
          </template>
          <div class="notifications">
            <div class="notification-item">
              <el-tag type="success">成功</el-tag>
              <span class="notification-text">系统备份已完成</span>
              <span class="notification-time">2小时前</span>
            </div>
            <div class="notification-item">
              <el-tag type="warning">警告</el-tag>
              <span class="notification-text">存储空间即将不足</span>
              <span class="notification-time">5小时前</span>
            </div>
            <div class="notification-item">
              <el-tag type="danger">错误</el-tag>
              <span class="notification-text">数据库连接异常</span>
              <span class="notification-time">昨天</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserInfoStore } from '@/stores/userInfo'
import CountTo from '@/components/CountTo/CountTo.vue'

const userInfoStore = useUserInfoStore()
const userNameCn = computed(() => userInfoStore.userNameCn)
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.welcome-section {
  margin-bottom: 20px;

  .welcome-title {
    font-size: 24px;
    color: #303133;
    margin: 0 0 8px 0;
  }

  .welcome-subtitle {
    font-size: 14px;
    color: #909399;
    margin: 0;
  }
}

.stats-cards {
  margin-bottom: 20px;

  .stat-card {
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .stat-content {
      display: flex;
      align-items: center;

      .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        color: #fff;

        &.users {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.orders {
          background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
        }

        &.revenue {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        }

        &.products {
          background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);
        }
      }

      .stat-info {
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
}

.main-content {
  margin-bottom: 20px;

  .chart-card,
  .quick-actions {
    border-radius: 8px;
    height: 100%;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .chart-placeholder {
    height: 300px;
    display: flex;
    flex-direction: column;

    .chart-area {
      flex: 1;
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      padding: 20px 0;

      .chart-bar {
        width: 30px;
        background: linear-gradient(to top, #409eff, #a0cfff);
        border-radius: 4px 4px 0 0;
        transition: all 0.3s ease;

        &:hover {
          opacity: 0.8;
          transform: scaleY(1.05);
        }
      }
    }

    .chart-labels {
      display: flex;
      justify-content: space-around;
      padding-top: 10px;
      border-top: 1px solid #ebeef5;

      span {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .quick-actions {
    .action-buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 20px;

      .action-btn {
        height: auto;
        padding: 12px 8px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;

        &+.action-btn {
          margin-left: 0;
        }

        span {
          font-size: 12px;
        }
      }
    }

    .recent-activities {
      h3 {
        font-size: 16px;
        color: #303133;
        margin: 0 0 15px 0;
      }

      .activity-list {
        list-style: none;
        padding: 0;
        margin: 0;

        .activity-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          .activity-time {
            font-size: 12px;
            color: #909399;
          }

          .activity-desc {
            font-size: 14px;
            color: #606266;
          }
        }
      }
    }
  }
}

.bottom-section {
  .info-card {
    border-radius: 8px;
    height: 100%;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .system-status {
      .status-item {
        margin-bottom: 15px;

        &:last-child {
          margin-bottom: 0;
        }

        .status-label {
          display: block;
          font-size: 14px;
          color: #606266;
          margin-bottom: 5px;
        }

        .status-value {
          font-size: 14px;
          color: #303133;
          font-weight: 500;
        }
      }
    }

    .notifications {
      .notification-item {
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .notification-text {
          flex: 1;
          margin: 0 10px;
          font-size: 14px;
          color: #606266;
        }

        .notification-time {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
  }

  .stats-cards {
    .stat-card {
      margin-bottom: 15px;
    }
  }

  .main-content {
    .chart-placeholder {
      height: 250px;
    }

    .quick-actions {
      .action-buttons {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
