<template>
  <div>
    <div class="plugins-tips">
      PDF查看器示例。
      <el-link type="primary" href="https://www.embedpdf.com/vue-pdf-viewer" target="_blank">
        @embedpdf/vue-pdf-viewer
      </el-link>
    </div>

  <div class="pdfviewer-wrapper">
    <PDFViewer :config="{
      src: 'https://snippet.embedpdf.com/ebook.pdf',
      theme: { preference: 'light' },
      i18n: {
        defaultLocale: 'zh-CN',
        fallbackLocale: 'en'
      },
      disabledCategories: disabledCategories,
    }" class="embedpdf-viewer" />
  </div>
  </div>
</template>

<script lang="ts" setup>
import { PDFViewer } from '@embedpdf/vue-pdf-viewer';

const disabledCategories = [
  'annotation',
  'form',
  'redaction',
  'document-open',
  'document-close',
  'document-capture',
  'document-fullscreen',
  'document-protect',
  'panel',
  'history',
  'insert',
  'security',
  'zoom-marquee'
];

</script>

<style lang="scss" scoped>
.plugins-tips {
  margin-bottom: 15px;
  padding: 20px;
  background-color: #e7ecf3;
  color: #444;
}

.pdfviewer-wrapper {
  height: 65vh;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.embedpdf-viewer {
  width: 100%;
  height: 100%;
}
</style>
