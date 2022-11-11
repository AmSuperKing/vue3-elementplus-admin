<template>
  <div class="upload-container">
    <el-upload
      :action="action"
      :headers="headers"
      :multiple="false"
      :limit="1"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="props.fileList"
      :on-exceed="onExceed"
      :disabled="props.disabled"
      drag
      show-file-list
      auto-upload
      class="image-upload"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将图片拖入或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          {{ props.tips }}
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { getToken } from '@/utils/auth'

export interface UploadImgProps {
  url: string,
  fileList?: any[],
  params?: anyObj,
  disabled?: boolean,
  tips?: string
}

const props = withDefaults(defineProps<UploadImgProps>(), {
  url: '',
  params: () => { return {} },
  fileList: () => [],
  disabled: false,
  tips: '上传图片'
})

const emits = defineEmits<{
  (e: 'beforeUpload', value: any): void
  (e: 'onSuccess', value: any): void
  (e: 'onError', value: any): void
  (e: 'onRemove'): void
}>()

const paramsObj = computed(() => props.params)
const paramsData = computed(() => {
  const paramsList: string[] = []
  Object.keys(paramsObj.value).length && Object.keys(paramsObj.value).forEach((key) => {
    if (paramsObj.value[key] !== undefined && paramsObj.value[key] !== null) {
      paramsList.push(key + '=' + paramsObj.value[key])
    }
  })
  console.log(
    '%c upload image params(UploadImgSingle Tips): =>',
    'color: #00aadf',
    paramsList.length ? paramsList.join('&') : ''
  )
  return paramsList.length ? paramsList.join('&') : ''
})

const action = computed(() => `${import.meta.env.VITE_AXIOS_BASE_URL}` + props.url + '?' + paramsData.value)
const headers = computed(() => {
  return {
    Authorization: `${getToken()}`
  }
})

const typeControll = (fileName: string) => {
  const suffixMsg = fileName.substring(fileName.lastIndexOf('.') + 1)
  const extension = suffixMsg === 'jpg'
  const extension2 = suffixMsg === 'png'
  const extension3 = suffixMsg === 'jpeg'
  if (!extension && !extension2 && !extension3) {
    return false
  }
  return extension || extension2 || extension3
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  emits('beforeUpload', file)
  const checkRes = typeControll(file.name)
  if (!checkRes) {
    ElMessage.warning('上传文件只能是 jpg, jpeg, png格式!')
    return false
  }
}

const onSuccess: UploadProps['onSuccess'] = (response, file) => {
  const checkRes = typeControll(response.source1)
  if (checkRes) {
    ElMessage.success('上传成功')
    emits('onSuccess', true)
  } else {
    ElMessage.error('上传失败')
    emits('onError', file)
  }
}

const onError: UploadProps['onError'] = (err) => {
  emits('onError', err)
}

const onRemove: UploadProps['onRemove'] = () => {
  emits('onRemove')
}

const onExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning('只能上传一张图片')
}


</script>

<style lang="scss" scoped>
.upload-container {
  width: 100%;
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
      min-height: 150px;
    }
  }
}
</style>
