<template>
  <el-popover
    placement="bottom-end"
    :width="280"
    trigger="click"
    popper-class="theme-setting-popover"
  >
    <template #reference>
      <div class="theme-trigger mr-10" title="主题设置">
        <el-icon :size="22">
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 938.666667c235.648 0 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667z m0-85.333334V170.666667a341.333333 341.333333 0 1 1 0 682.666666z" fill="currentColor"></path></svg>
        </el-icon>
      </div>
    </template>

    <div class="theme-setting-panel">
      <!-- 标题 -->
      <div class="panel-title">主题设置</div>

      <!-- 主题模式选择 -->
      <div class="setting-section">
        <div class="section-label">主题模式</div>
        <div class="mode-options">
          <div
            v-for="mode in modeOptions"
            :key="mode.value"
            class="mode-item"
            :class="{ active: themeStore.themeMode === mode.value }"
            @click="themeStore.setThemeMode(mode.value)"
          >
            <el-icon :size="22">
              <component :is="mode.icon" />
            </el-icon>
            <span class="mode-label">{{ mode.label }}</span>
          </div>
        </div>
      </div>

      <!-- 主题色选择 -->
      <div class="setting-section">
        <div class="section-label">主题色</div>
        <div class="color-options">
          <div
            v-for="color in presetColors"
            :key="color"
            class="color-item"
            :class="{ active: themeStore.primaryColor === color }"
            :style="{ backgroundColor: color }"
            @click="themeStore.setPrimaryColor(color)"
          >
            <el-icon v-if="themeStore.primaryColor === color" :size="14">
              <Check />
            </el-icon>
          </div>
          <!-- <el-color-picker
            v-model="customColor"
            size="small"
            :predefine="presetColors"
            show-alpha
            @change="handleCustomColorChange"
          /> -->
        </div>
      </div>

      <!-- 预览区域 -->
      <div class="setting-section">
        <div class="section-label">效果预览</div>
        <div class="preview-area">
          <div class="preview-header">
            <span class="preview-text">Header</span>
            <el-button type="primary" size="small">按钮</el-button>
          </div>
          <div class="preview-body">
            <div class="preview-sidebar">
              <span class="preview-text">Menu</span>
            </div>
            <div class="preview-content">
              <span class="preview-text">Content Area</span>
              <el-input placeholder="输入内容" size="small" style="width: 150px; margin-top: 8px;" />
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="setting-actions">
        <el-button size="small" @click="handleReset">重置默认</el-button>
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Check, Sunny, Moon, Monitor } from '@element-plus/icons-vue'
import { useThemeStore, type ThemeMode } from '@/stores/theme'

const themeStore = useThemeStore()

// 模式选项
const modeOptions = [
  { value: 'light' as ThemeMode, label: '亮色', icon: Sunny },
  { value: 'dark' as ThemeMode, label: '暗色', icon: Moon },
  { value: 'system' as ThemeMode, label: '跟随系统', icon: Monitor },
]

// 预设主题色
const presetColors = [
  '#409eff',
  '#36cfc9',
  '#41b783',
  '#ffc53d',
  '#ff85c0',
  '#722ed1',
  '#f5222d',
]

// 自定义颜色（双向绑定）
const customColor = ref(themeStore.primaryColor)

// 处理自定义颜色变化
// const handleCustomColorChange = (color: string | null) => {
//   if (color) {
//     themeStore.setPrimaryColor(color)
//   }
// }

// 重置主题
const handleReset = () => {
  themeStore.resetTheme()
  customColor.value = themeStore.primaryColor
}
</script>

<style lang="scss" scoped>
.theme-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  color: var(--el-color-primary);

  &:hover {
    background-color: var(--el-fill-color-light);
    color: var(--el-color-primary);
  }
}

.theme-setting-panel {
  padding: 4px 0;
}

.panel-title {
  padding: 16px 20px 12px;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.setting-section {
  padding: 16px 20px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--el-border-color-extra-light);
  }
}

.section-label {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--el-text-color-regular);
}

.mode-options {
  display: flex;
  gap: 10px;
}

.mode-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 8px;
  border: 2px solid var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;

  .mode-label {
    font-size: 12px;
    color: var(--el-text-color-regular);
  }

  &:hover {
    border-color: var(--el-color-primary-light-5);
    background-color: var(--el-fill-color-light);
  }

  &.active {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);

    .mode-label {
      color: var(--el-color-primary);
      font-weight: 500;
    }

    .el-icon {
      color: var(--el-color-primary);
    }
  }
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.color-item {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.15);
  }

  &.active {
    border-color: var(--el-text-color-primary);

    .el-icon {
      color: var(--el-text-color-primary);
    }
  }
}

.preview-area {
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  overflow: hidden;

  html.dark & {
    border-color: var(--border-color);
  }
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--el-border-color-lighter);

  html.dark & {
    background-color: var(--header-bg);
  }
}

.preview-body {
  display: flex;
  height: 100px;
}

.preview-sidebar {
  width: 60px;
  padding: 10px;
  background-color: var(--menu-bg);
  display: flex;
  align-items: flex-start;

  html.dark & {
    background-color: var(--menu-bg);
  }
}

.preview-content {
  flex: 1;
  padding: 10px 14px;
  background-color: var(--contentBg);
  display: flex;
  flex-direction: column;

  html.dark & {
    background-color: var(--content-bg);
  }
}

.preview-text {
  font-size: 11px;
  color: var(--textColor, #606266);
  opacity: 0.7;
}

.setting-actions {
  padding: 12px 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

<style lang="scss">
.theme-setting-popover {
  padding: 0 !important;
  border-radius: 12px !important;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.12) !important;
}
</style>
