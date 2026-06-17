<template>
  <div class="pptx-preview-container">
    <div ref="pptxPreviewContent" class="pptx-preview-content">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTemplateRef, onMounted, computed } from 'vue'
import {init} from 'pptx-preview'

const pptxPreviewContentRef = useTemplateRef("pptxPreviewContent")

const fileUrl = computed(() => {
  return `${import.meta.env.VITE_BASE_PATH}files/test.pptx`
})

let pptxPrviewer: ReturnType<typeof init> | null = null

//调用库的init方法生成一个预览器
const initPptxPreviewer = () => {
  if (pptxPreviewContentRef.value) {
    pptxPrviewer = init(pptxPreviewContentRef.value, {
      width: pptxPreviewContentRef.value?.offsetWidth || 800,
      height: pptxPreviewContentRef.value?.offsetHeight || 600
    })
  }
}

const fetchFile = () => {
  //获取文件或者读取文件，获取文件的 ArrayBuffer格式数据，传给组件进行预览
  fetch(fileUrl.value).then(response=>{
    return response.arrayBuffer()
  }).then(res =>{
    //调用预览器的preview方法
    if (pptxPrviewer) {
      pptxPrviewer.preview(res)
    }
  })
}

onMounted(() => {
  initPptxPreviewer()
  fetchFile()
})
</script>

<style lang="scss" scoped>
.pptx-preview-container {
  width: 100%;
  height: 100%;
  border: 1px solid #bfbfbf;
  background-color: #bfbfbf;
}
</style>
