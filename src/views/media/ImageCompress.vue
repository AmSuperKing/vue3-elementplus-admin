<template>
  <div>
    <div v-loading="imgLoading" element-loading-text="正在压缩图片，请稍候...">
      <el-form label-width="150px" class="compress-form mt-10">
        <el-form-item label="选择图片">
          <!-- <el-upload :auto-upload="false" :show-file-list="false" accept=".jpg,.jpeg,.png,.webp,.bmp" :on-change="(file) => handleImageChange(file.raw)">
            <el-button type="primary" :disabled="imgLoading">选择图片</el-button>
          </el-upload> -->
          <el-upload drag :auto-upload="false" :show-file-list="false" accept=".jpg,.jpeg,.png,.webp,.bmp" :on-change="(file) => handleImageChange(file.raw)" class="wp-100">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽文件到这里 或<em>点击上传</em>
            </div>
          </el-upload>
          <span v-if="imageFile" style="margin-left: 10px;">{{ imageFile.name }}</span>
        </el-form-item>
        <el-form-item label="压缩质量">
          <el-slider v-model="imageQuality" :min="0.1" :max="1" :step="0.05" show-input :disabled="imgLoading" style="max-width: 375px;" />
        </el-form-item>
        <el-form-item label="最大宽度">
          <el-input-number v-model="imageMaxWidth" :min="10" :max="3840" :step="100" :disabled="imgLoading" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="compressImage" :loading="imgLoading">压缩图片</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="compressedImageUrl" class="preview-box">
      <p>压缩后大小: {{ formatSize(compressedImageSize) }}，图片预览：</p>
      <el-image :src="compressedImageUrl" fit="scale-down" :preview-src-list="[compressedImageUrl]" style="width: 300px; height: auto;" />
      <el-button type="primary" link @click="downloadFile(compressedImageUrl, `compressed_${imageFile?.name || 'image'}`)" style="margin-top: 10px;">
        <el-icon><Download /></el-icon> 下载压缩图片
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Download } from '@element-plus/icons-vue';
import imageCompression from 'browser-image-compression';

// --- 图片压缩相关状态 ---
const imageFile = ref<File | null>(null);
const imageType = ref<string>('image/jpeg');
const imageQuality = ref(0.8);
const imageMaxWidth = ref(1200);
const imgLoading = ref(false);
const compressedImageUrl = ref('');
const compressedImageSize = ref(0);

const imageCompressTargetSize = computed(() => {
  let targetMB = 1;
  // 根据imageFile.size 和  imageQuality 计算目标大小
  if (imageFile.value) {
    const fileSizeMB = imageFile.value.size / (1024 * 1024);
    targetMB = Number((fileSizeMB * imageQuality.value).toFixed(2));;
  }
  return targetMB;
});

// 工具函数：格式化文件大小
const formatSize = (bytes: number, result: 'string' | 'number' = 'string'): string | number => {
  if (!bytes) return result === 'string' ? '0 MB' : 0;
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  if (result === 'string') return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  if (result === 'number') return parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return result === 'string' ? '0 MB' : 0;
};

// 工具函数：安全下载文件
const downloadFile = (url: string, filename: string): void => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 1. 图片压缩核心逻辑
const handleImageChange = (file: File | undefined): void => {
  if (!file) return;
  console.log('Selected file:', file);
  imageFile.value = file;
  const acceptTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
  if (!acceptTypes.includes(file.type)) {
    ElMessage.warning('当前图片格式暂不支持，请上传 jpg, jpeg, png, webp, bmp 格式的图片');
    return;
  }
  imageType.value = file.type;
  if (compressedImageUrl.value) URL.revokeObjectURL(compressedImageUrl.value);
  compressedImageUrl.value = '';

  // 获取图片宽度并更新 imageMaxWidth
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.src = url;
  img.onload = () => {
    imageMaxWidth.value = img.width;
    URL.revokeObjectURL(url);
  };
};

const compressImage = async () => {
  if (!imageFile.value) return ElMessage.warning('请先选择图片');
  imgLoading.value = true;
  try {
    const img = new Image();
    const url = URL.createObjectURL(imageFile.value);
    img.src = url;
    await new Promise((resolve) => { img.onload = resolve; });

    let width = img.width;
    if (width > imageMaxWidth.value) {
      width = imageMaxWidth.value;
    }

    console.log('imageCompressTargetSize.value:', imageCompressTargetSize.value);

    const options = {
      maxSizeMB: imageCompressTargetSize.value,
      maxWidthOrHeight: width,
      useWebWorker: true,
    }

    const compressedFile = await imageCompression(imageFile.value, options);

    if (compressedImageUrl.value) URL.revokeObjectURL(compressedImageUrl.value);
    URL.revokeObjectURL(url);

    if (compressedFile) {
      compressedImageUrl.value = URL.createObjectURL(compressedFile);
      compressedImageSize.value = compressedFile.size;
      ElMessage.success('图片压缩完成');
    }
  } catch (err) {
    console.error('图片压缩失败:', err);
    ElMessage.error('图片压缩失败');
  } finally {
    imgLoading.value = false;
  }
};


</script>

<style lang="scss" scoped>
.preview-box {
  margin-top: 15px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 进度条区域样式 */
.progress-box {
  margin: 15px 0;
  padding: 10px;
  background: #ecf5ff;
  border-radius: 4px;
}
.progress-text {
  margin-top: 8px;
  font-size: 12px;
  color: #606266;
  text-align: center;
}
</style>
