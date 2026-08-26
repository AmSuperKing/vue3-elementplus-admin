<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
// 导入 Element Plus 语言包
import zhCnEl from 'element-plus/es/locale/lang/zh-cn'
import enEl from 'element-plus/es/locale/lang/en'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'

const { locale } = useI18n()
const themeStore = useThemeStore()

// Element Plus 语言包映射
const elLocaleMap: Record<string, typeof zhCnEl> = {
  'zh-CN': zhCnEl,
  'en-US': enEl,
}
// 根据当前 i18n locale 动态计算 Element Plus 的 locale
const elLocale = computed(() => {
  return elLocaleMap[locale.value] || zhCnEl
})

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <el-config-provider :locale="elLocale">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
