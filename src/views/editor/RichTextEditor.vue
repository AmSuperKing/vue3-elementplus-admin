<template>
  <div class="container">
    <div class="plugins-tips">
      wangEditor：轻量级 web 富文本编辑器，配置方便，使用简单。 访问地址：
      <el-link type="primary" href="https://www.wangeditor.com/" target="_blank">wangEditor</el-link>
    </div>
    <div style="border: 1px solid #ccc">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
        @onCreated="handleCreated" />
    </div>
    <el-button type="primary" class="mt-10" @click="syncHTML">提交</el-button>
  </div>
</template>

<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import type { IDomEditor } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const editorRef = shallowRef<IDomEditor | undefined>()
const valueHtml = ref('<p>hello</p>')
const mode: 'default' | 'simple' = 'default'
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor // 记录 editor 实例
}

const syncHTML = () => {
  console.log('rich text sync HTML:', valueHtml.value)
}

// 组件销毁时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style lang="scss" scoped>
.container {
  margin: 20px;
}

.plugins-tips {
  margin-bottom: 15px;
  padding: 20px;
  background-color: #e7ecf3;
  color: #444;
}
</style>
