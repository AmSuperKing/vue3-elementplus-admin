<template>
  <div class="container">
    <div class="plugins-tips">
      md-editor-v3：vue3版本的 markdown 编辑器，配置丰富，请详看文档。 访问地址：
      <el-link type="primary" href="https://imzbf.github.io/md-editor-v3/index" target="_blank">md-editor-v3</el-link>
    </div>
    <MdEditor v-model="text" :toolbars="toolbars" @on-upload-img="onUploadImg" />
    <el-button type="primary" class="mt-10">提交</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { MdEditor, type ToolbarNames } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const toolbars: ToolbarNames[] = [
  "bold",
  "underline",
  "underline",
  "italic",
  "strikeThrough",
  "title",
  "sub",
  "sup",
  "quote",
  "unorderedList",
  "orderedList",
  "task",
  "codeRow",
  "code",
  "link",
  "image",
  "table",
  "mermaid",
  "katex",
  "revoke",
  "next",
  "save",
  "prettier",
  "pageFullscreen",
  "fullscreen",
  "preview",
  "previewOnly",
  "htmlPreview",
  "catalog",
  "-", // 分组标识
  "="
]
const text = ref('Hello Markdown Editor!')
const onUploadImg = (files: FileList) => {
  console.log('markdown upload img files:', files)
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30px;

  .plugins-tips {
    margin-bottom: 15px;
    padding: 20px;
    background-color: #e7ecf3;
    color: #444;
  }
}
</style>
