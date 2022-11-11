<template>
  <ElConfigProvider :locale="zhCn" size="default">
    <RouterView />
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>
