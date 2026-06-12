<template>
  <div class="rich-text-editor">
    <div class="plugins-tips">
      TinyEditor 是一个基于 Quill 2.0 的富文本编辑器，在 Quill 基础上扩展了表格、图片、超链接、复制粘贴、插入表情、文件上传、@提醒、斜杆菜单等丰富的模块和格式，框架无关、兼容 Quill API、兼容
      Quill 模块生态。 访问地址：
      <el-link type="primary" href="https://opentiny.github.io/tiny-editor/"
        target="_blank">@opentiny/fluent-editor</el-link>
    </div>
    <TinyEditor v-model="editorContent" />
    <div class="mt-20">
      <h4>当前内容：</h4>
      <div class="content-preview">{{ editorContent }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TinyEditor from './components/TinyEditor.vue'

// 使用 v-model 绑定编辑器内容
const editorContent = ref('<p>Hello <strong>Fluent Editor</strong></p><p><br><a href="https://opentiny.github.io/tiny-editor/">https://opentiny.github.io/tiny-editor/</a></p>')
</script>

<style lang="scss" scoped>
.plugins-tips {
  margin-bottom: 15px;
  padding: 20px;
  background-color: #e7ecf3;
  color: #444;
}

.content-preview {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
}
</style>
