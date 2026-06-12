<template>
  <div>
    <div class="plugins-tips">
      Umo Editor 是一个基于 Vue3 和 Tiptap3 的本土化开源文档编辑器，提供类似于 Microsoft Word 的在线编辑功能和浏览体验。 访问地址：
      <el-link type="primary" href="https://dev.umodoc.com/cn/docs/editor" target="_blank">@umoteam/editor</el-link>
    </div>
    <div class="rich-text-editor">
      <umo-editor ref="editorRef" v-bind="options" @save="onSave" @file-upload="onFileUpload"
        @file-delete="onFileDelete" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { UmoEditor } from '@umoteam/editor'
import request from '@/utils/request'

const editorRef = ref()

const options = ref({
  // 配置项
  // ...
})

const onSave = async (content: string, page: string, document: string) => {
  const res = await request.post('/api/save', {
    content,
    page,
    document,
  });
  console.log('-onSave-', res)

  // 保存成功则返回 true，否则返回 false 或者抛出错误
  return true;
}

const onFileUpload = async (file: File) => {
  const formData = new FormData();
  // 添加文件到 formData 对象中
  formData.append('file', file);
  const res = await request.post('/api/file-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });

  // 保存成功则返回 {id, url}，否则返回 false 或者抛出错误
  return {
    id: res.data.id,
    url: res.data.url,
  };
}

const onFileDelete = (id: string, url: string, type: string) => {
  console.log('-onFileDelete-', id, url, type)
  request.delete(`/api/file/${id}`);
}

// 获取内容
// const getContent = () => {
//   const content = editorRef.value.getContent()
//   console.log(content)
// }
</script>

<style lang="scss" scoped>
.plugins-tips {
  margin-bottom: 15px;
  padding: 20px;
  background-color: #e7ecf3;
  color: #444;
}

.rich-text-editor {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}
</style>
