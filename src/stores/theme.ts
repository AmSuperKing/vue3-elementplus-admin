import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

// 默认主题色
const DEFAULT_PRIMARY_COLOR = '#409eff'

export const useThemeStore = defineStore('theme', () => {
  // 主题模式：亮色、暗色、跟随系统
  const themeMode = ref<ThemeMode>('light')
  // 主题色
  const primaryColor = ref(DEFAULT_PRIMARY_COLOR)
  // 是否为暗色模式（计算值）
  const isDark = ref(false)

  // 监听系统主题变化
  let mediaQuery: MediaQueryList | null = null
  const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
    if (themeMode.value === 'system') {
      isDark.value = e.matches
      applyDarkClass(e.matches)
      // 同步更新组件颜色变量
      updateComponentColors(e.matches)
    }
  }

  // 更新组件相关的颜色变量
  const updateComponentColors = (dark: boolean) => {
    const root = document.documentElement
    if (dark) {
      root.style.setProperty('--menu-bg', '#1d1e1f')
      root.style.setProperty('--menu-text', '#cfd3dc')
      root.style.setProperty('--sub-menu-border', '#cfd3dc')
      root.style.setProperty('--sidebar-header-bg', '#262727')
    } else {
      root.style.removeProperty('--menu-bg')
      root.style.removeProperty('--menu-text')
      root.style.removeProperty('--sub-menu-border')
      root.style.removeProperty('--sidebar-header-bg')
    }
  }

  // 应用/移除 dark 类到 html 元素
  const applyDarkClass = (dark: boolean) => {
    const html = document.documentElement
    if (dark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  // 设置主题模式
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode
    if (mode === 'system') {
      // 跟随系统
      if (mediaQuery) {
        isDark.value = mediaQuery.matches
        applyDarkClass(mediaQuery.matches)
      }
    } else {
      isDark.value = mode === 'dark'
      applyDarkClass(mode === 'dark')
    }
    // 根据模式更新组件相关的颜色变量
    updateComponentColors(isDark.value)
  }

  // 设置主题色
  const setPrimaryColor = (color: string) => {
    primaryColor.value = color
    applyPrimaryColor(color)
  }

  // 应用主题色到 CSS 变量
  const applyPrimaryColor = (color: string) => {
    const root = document.documentElement
    root.style.setProperty('--el-color-primary', color)
    // 生成主题色的不同深浅色阶
    for (let i = 1; i <= 9; i++) {
      root.style.setProperty(`--el-color-primary-light-${i}`, getLightColor(color, i / 10))
    }
    root.style.setProperty('--el-color-primary-dark-2', getDarkColor(color, 0.2))
    // 同步更新组件相关的主题色变量
    // 标签栏背景色（基于主题色的浅色版本）
    root.style.setProperty('--tags-bg', getLightColor(color, 0.9))
    // 标签栏文字颜色（基于主题色的浅色版本）
    root.style.setProperty('--tag-text', mixWhiteColor(color, 0.55))
    // 标签栏激活文字颜色（主题色）
    root.style.setProperty('--tag-active-text', color)
    // 菜单栏激活文字颜色（主题色）
    root.style.setProperty('--menu-active-text', color)
    // 菜单栏激活背景色（基于主题色的极浅版）
    root.style.setProperty('--menu-active-bg', getLightColor(color, 0.85))
  }

  // 颜色变亮
  const getLightColor = (color: string, amount: number): string => {
    const rgb = hexToRgb(color)
    if (!rgb) return color
    return rgbToHex(
      Math.round(rgb.r + (255 - rgb.r) * amount),
      Math.round(rgb.g + (255 - rgb.g) * amount),
      Math.round(rgb.b + (255 - rgb.b) * amount)
    )
  }

  // 颜色变暗
  const getDarkColor = (color: string, amount: number): string => {
    const rgb = hexToRgb(color)
    if (!rgb) return color
    return rgbToHex(
      Math.round(rgb.r * (1 - amount)),
      Math.round(rgb.g * (1 - amount)),
      Math.round(rgb.b * (1 - amount))
    )
  }

  // 以白色为底色混合颜色
  const mixWhiteColor = (
    color: string,
    amount: number,
    outputFormat: 'hex' | 'rgb' = 'hex'
  ): string => {
    const rgb = hexToRgb(color)
    if (!rgb) return color

    const ratio = Math.min(1, Math.max(0, amount))

    const r = Math.round(255 * (1 - ratio) + rgb.r * ratio)
    const g = Math.round(255 * (1 - ratio) + rgb.g * ratio)
    const b = Math.round(255 * (1 - ratio) + rgb.b * ratio)

    if (outputFormat === 'rgb') {
      return `rgb(${r}, ${g}, ${b})`
    }
    return rgbToHex(r, g, b)
  }

  // HEX 转 RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1]!, 16),
          g: parseInt(result[2]!, 16),
          b: parseInt(result[3]!, 16),
        }
      : null
  }

  // RGB 转 HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
  }

  // 初始化主题
  const initTheme = () => {
    // 监听系统主题变化
    if (window.matchMedia) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', handleSystemThemeChange)
    }
    // 应用当前设置的主题模式
    setThemeMode(themeMode.value)
    // 应用当前设置的主题色
    applyPrimaryColor(primaryColor.value)
  }

  // 重置主题
  const resetTheme = () => {
    setThemeMode('light')
    setPrimaryColor(DEFAULT_PRIMARY_COLOR)
  }

  return {
    themeMode,
    primaryColor,
    isDark,
    setThemeMode,
    setPrimaryColor,
    mixWhiteColor,
    initTheme,
    resetTheme,
  }
}, {
  persist: {
    key: 'theme-settings',
    pick: ['themeMode', 'primaryColor'],
  },
})
