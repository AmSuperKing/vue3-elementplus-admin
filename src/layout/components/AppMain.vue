<template>
  <div id="page-content" class="content">
    <router-view v-slot="{ Component, route }">
      <transition mode="out-in">
        <keep-alive :include="tagsList.nameList" :max="8">
          <suspense>
            <template #default>
              <component :is="Component" :key="route.path ?? undefined" />
            </template>
            <template #fallback> Loading... </template>
          </suspense>
        </keep-alive>
      </transition>
    </router-view>
    <el-backtop />
  </div>
</template>

<script lang="ts" setup>
import { useTagsListStore } from '@/stores/tagsList'

const tagsList = useTagsListStore()

</script>

<style lang="scss" scoped>

</style>
