<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { supportLanguages, type SupportedLocale } from '@/locales'

const { locale } = useI18n()

// 切换语言
const handleLangChange = (lang: SupportedLocale) => {
  locale.value = lang
  // 持久化到 localStorage
  localStorage.setItem('app-locale', lang)
}
</script>

<template>
  <el-dropdown
    trigger="click"
    @command="handleLangChange"
  >
    <span class="lang-switch-trigger">
      <Icon name="svg-language" size="18px" color="var(--el-color-primary)"></Icon>
      {{ supportLanguages.find(l => l.value === locale)?.label }}
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="lang in supportLanguages"
          :key="lang.value"
          :command="lang.value"
          :class="{ 'is-active': locale === lang.value }"
        >
          {{ lang.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.lang-switch-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-color-regular);
}
.is-active {
  color: var(--el-color-primary);
  font-weight: bold;
}
</style>
