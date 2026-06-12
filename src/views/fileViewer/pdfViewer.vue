<template>
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
