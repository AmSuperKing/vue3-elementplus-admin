import { createI18n } from 'vue-i18n'
import zhCN from './lang/zh-CN'
import enUS from './lang/en-US'

// 支持的语言列表
export const supportLanguages = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
] as const

// 语言类型推导（TypeScript 类型安全）
export type SupportedLocale = (typeof supportLanguages)[number]['value']

// 所有语言消息
const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

// 从 localStorage 获取缓存的语言，默认为中文
const getStoredLocale = (): SupportedLocale => {
  const stored = localStorage.getItem('app-locale') as SupportedLocale | null
  if (stored && supportLanguages.some((lang) => lang.value === stored)) {
    return stored
  }
  return 'zh-CN'
}

const i18n = createI18n({
  legacy: false,       // ⚠️ 必须设置为 false，才能使用 Composition API（useI18n）
  locale: getStoredLocale(),
  fallbackLocale: 'zh-CN',  // 回退语言
  messages,
  // 如果缺少翻译 key，不输出警告（生产环境建议关闭）
  missingWarn: false,
  fallbackWarn: false,
})

export default i18n
