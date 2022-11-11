<template>
  <div class="container">
    <UploadImgSingle
      url="/api/v1/upload"
      :params="{'id': 'params'}"
      :disabled="false"
      tips="请选择图片上传，图片大小请小于10M"
      @onSuccess="handleUploadSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import UploadImgSingle from '@/components/UploadImgSingle/index.vue'

const handleUploadSuccess = () => {
  console.log('handleUploadSuccess')
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
</style>