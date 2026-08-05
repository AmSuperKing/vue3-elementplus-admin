<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="@embedpdf/vue-pdf-viewer" name="embedpdf">
        <EmbedPdf />
      </el-tab-pane>

      <el-tab-pane label="pdfjs-dist" name="pdfjsdist">
        <div class="plugins-tips">
          pdfjs-dist 查看器示例。
          <el-link type="primary" href="https://mozilla.github.io/pdf.js/getting_started/" target="_blank">
            pdfjs-dist
          </el-link>
        </div>
        <PdfDist :url="pdfUrl" height="70vh" @loaded="onLoaded" @page-change="onPageChange" @error="onError" />
      </el-tab-pane>
  </el-tabs>

  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import EmbedPdf from './components/EmbedPdf.vue'
import PdfDist from './components/PdfDist.vue'

const activeName = ref('embedpdf')

const fileData = ref<File | null>(null)

const fileSrc = computed(() => {
  return `${import.meta.env.VITE_BASE_PATH}files/test.xls` // 或者使用test.xlsx
})

const fetchFile = () => {
  fetch(fileSrc.value)
    .then(response => response.blob())
    .then(data => {
      console.log('获取文件成功', data);
      // 将 Blob 转换为 File 对象
      const file = new File([data], 'test.xlsx', { type: data.type || 'application/octet-stream' });
      fileData.value = file;
    })
    .catch(e => {
      console.log('获取文件失败', e);
    });
}

const pdfUrl = "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";

function onLoaded(total: number) {
  console.log(`PDF 加载完成，共 ${total} 页`);
}

function onPageChange(page: number) {
  console.log(`当前页：${page}`);
}

function onError(err: Error) {
  console.error("PDF 加载出错：", err.message);
}

onMounted(() => {
  fetchFile();
});
</script>

<style lang="scss" scoped>
.plugins-tips {
  margin-bottom: 15px;
  padding: 20px;
  background-color: #e7ecf3;
  color: #444;
}
</style>
