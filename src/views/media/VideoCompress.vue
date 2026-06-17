<template>
  <div>
    <div v-loading="coverLoading" element-loading-text="正在提取视频封面...">
      <el-form label-width="100px" class="compress-form">
        <el-form-item label="选择视频">
          <!-- <el-upload :auto-upload="false" :show-file-list="false" accept="video/*" :on-change="(file) => file.raw && handleVideoChange(file.raw)">
            <el-button type="primary" :disabled="coverLoading || videoLoading">选择视频</el-button>
          </el-upload> -->
          <el-upload drag :auto-upload="false" :show-file-list="false" accept="video/*" :on-change="(file) => file.raw && handleVideoChange(file.raw)" class="wp-100">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽文件到这里 或<em>点击上传</em>
            </div>
          </el-upload>
          <span v-if="videoFile" class="ml-10">{{ videoFile.name }}</span>
        </el-form-item>

        <el-form-item label="目标大小(MB)">
          <el-input-number v-model="videoTargetSize" :min="1" :max="1000" :step="1" :disabled="videoLoading" />
          <span class="compress-tip fs-12 ml-10">(默认压缩50%)</span>
        </el-form-item>
        <el-form-item label="视频宽度">
          <el-select v-model="videoWidth" placeholder="保持原始比例" :disabled="videoLoading" style="max-width: 400px;">
            <el-option label="保持原始" :value="0" />
            <el-option label="1920 (1080P)" :value="1920" />
            <el-option label="1280 (720P)" :value="1280" />
            <el-option label="854 (480P)" :value="854" />
            <el-option label="640 (360P)" :value="640" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="extractCover" :loading="coverLoading">提取封面</el-button>
          <el-button type="warning" @click="compressVideo" :loading="videoLoading">压缩视频</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 视频压缩进度条与状态提示 -->
    <div v-if="videoLoading || ffmpegProgress > 0" class="progress-box">
      <el-progress :percentage="ffmpegProgress" :status="ffmpegProgress === 100 ? 'success' : ''" />
      <p class="progress-text">{{ ffmpegStatusText }}</p>
    </div>

    <div v-if="coverUrl" class="preview-box">
      <p>视频封面:</p>
      <el-image :src="coverUrl" fit="scale-down" :preview-src-list="[coverUrl]" style="max-width: 300px; height: auto;" />
      <el-button type="primary" link class="mt-10" @click="downloadFile(coverUrl, `cover_${videoFile?.name.replace(/\.[^/.]+$/, '.jpg')}`)">
        <el-icon><Download /></el-icon> 下载封面
      </el-button>
    </div>
    <div v-if="compressedVideoUrl" class="preview-box">
      <p>压缩后视频大小: {{ formatSize(compressedVideoSize) }}</p>
      <video :src="compressedVideoUrl" controls style="max-height: 700px; width: auto"></video>
      <el-button type="primary" link class="mt-10" @click="downloadFile(compressedVideoUrl, `compressed_${videoFile?.name}`)">
        <el-icon><Download /></el-icon> 下载压缩视频
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { ElMessage } from 'element-plus';
import { Download } from '@element-plus/icons-vue';

// --- 视频处理相关状态 ---
const videoFile = ref<File | null>(null);
const videoTargetSize = ref(10);
const videoWidth = ref(0);
const coverLoading = ref(false);
const videoLoading = ref(false);
const ffmpegProgress = ref(0);
const ffmpegStatusText = ref('');
const coverUrl = ref('');
const compressedVideoUrl = ref('');
const compressedVideoSize = ref(0);

const ffmpeg = new FFmpeg();

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
const downloadFile = (url: string, filename: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 视频封面提取核心逻辑
const handleVideoChange = (file: File) => {
  videoFile.value = file;
  const fileSize = file.size / (1024 * 1024);
  if (Number((fileSize * 0.5).toFixed(2)) <= 500) videoTargetSize.value = Number((fileSize * 0.5).toFixed(2));
  if (coverUrl.value) URL.revokeObjectURL(coverUrl.value);
  if (compressedVideoUrl.value) URL.revokeObjectURL(compressedVideoUrl.value);
  coverUrl.value = '';
  compressedVideoUrl.value = '';
  ffmpegProgress.value = 0;
};

const extractCover = async () => {
  if (!videoFile.value) return ElMessage.warning('请先选择视频');
  coverLoading.value = true;
  try {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.src = URL.createObjectURL(videoFile.value);

    await new Promise((resolve) => { video.onloadeddata = resolve; });
    video.currentTime = 0.1;
    await new Promise((resolve) => { video.onseeked = resolve; });

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    if (coverUrl.value) URL.revokeObjectURL(coverUrl.value);
    URL.revokeObjectURL(video.src);

    canvas.toBlob((blob) => {
      if (blob) {
        coverUrl.value = URL.createObjectURL(blob);
        ElMessage.success('封面提取成功');
      }
    }, 'image/png', 1);
  } catch {
    ElMessage.error('封面提取失败');
  } finally {
    coverLoading.value = false;
  }
};

// 视频压缩核心逻辑 (精准计算比特率 + 进度提示)
const compressVideo = async () => {
  if (!videoFile.value) return ElMessage.warning('请先选择视频');
  videoLoading.value = true;
  ffmpegProgress.value = 0;
  ffmpegStatusText.value = '正在初始化 FFmpeg 核心...';

  try {
    // 加载 FFmpeg WASM 核心
    if (!ffmpeg.loaded) {
      const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
    }

    ffmpegStatusText.value = '正在读取视频文件...';
    await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile.value));

    // 获取视频真实时长
    ffmpegStatusText.value = '正在分析视频时长...';
    let duration = 0;
    const logHandler = ({ message }: { message: string }) => {
      const match = message.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
      if (match) {
        const [, h, m, s] = match;
        if (h && m && s) {
          duration = parseFloat(h) * 3600 + parseFloat(m) * 60 + parseFloat(s);
        }
      }
    };
    ffmpeg.on('log', logHandler);
    await ffmpeg.exec(['-i', 'input.mp4']);
    ffmpeg.off('log', logHandler);

    if (duration === 0) throw new Error('无法获取视频时长');

    // 动态计算比特率
    const totalBitrate = Math.floor((videoTargetSize.value * 8192) / duration);
    const videoBitrate = Math.floor(totalBitrate * 0.9);
    const audioBitrate = totalBitrate - videoBitrate;

    // 构建 FFmpeg 命令参数
    const args = ['-i', 'input.mp4', '-c:v', 'libx264'];
    if (videoWidth.value > 0) {
      args.push('-vf', `scale=${videoWidth.value}:-1`);
    }
    args.push('-b:v', `${videoBitrate}k`, '-b:a', `${audioBitrate}k`, '-y', 'output.mp4');

    // 监听压缩进度
    ffmpegStatusText.value = '正在压缩视频，请耐心等待...';
    const progressHandler = ({ progress }: { progress: number }) => {
      ffmpegProgress.value = Math.round(progress * 100);
    };
    ffmpeg.on('progress', progressHandler);
    await ffmpeg.exec(args);
    ffmpeg.off('progress', progressHandler);

    // 读取输出文件并释放旧URL
    ffmpegStatusText.value = '正在生成预览...';
    const data = await ffmpeg.readFile('output.mp4');
    const blob = data instanceof Uint8Array
      ? new Blob([data.buffer as ArrayBuffer], { type: 'video/mp4' })
      : new Blob([data], { type: 'video/mp4' });

    if (compressedVideoUrl.value) URL.revokeObjectURL(compressedVideoUrl.value);
    compressedVideoUrl.value = URL.createObjectURL(blob);
    compressedVideoSize.value = blob.size;

    // 清理 FFmpeg 内存中的文件
    await ffmpeg.deleteFile('input.mp4');
    await ffmpeg.deleteFile('output.mp4');

    ffmpegProgress.value = 100;
    ffmpegStatusText.value = '压缩完成！';
    ElMessage.success('视频压缩完成');
  } catch (err) {
    console.error(err);
    ElMessage.error('视频压缩失败，请检查浏览器环境');
    ffmpegStatusText.value = '压缩失败';
  } finally {
    videoLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.compress-tip {
  color: #959595;
}

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
