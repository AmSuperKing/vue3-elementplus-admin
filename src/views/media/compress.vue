<template>
  <div>
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="图片压缩" name="image">
        <ImageCompress />
      </el-tab-pane>
      <el-tab-pane label="视频压缩" name="video">
        <VideoCompress />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImageCompress from './ImageCompress.vue'
import VideoCompress from './VideoCompress.vue'

const activeTab = ref("image")
</script>

<style lang="scss" scoped></style>
