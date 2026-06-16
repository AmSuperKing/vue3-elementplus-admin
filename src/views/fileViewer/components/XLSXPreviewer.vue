<template>
  <div class="excel-preview-container">
    <div class="plugins-tips">
      XLSX查看器示例。
      <el-link type="primary" href="https://www.npmjs.com/package/@js-preview/excel" target="_blank">
        @js-preview/excel
      </el-link>
    </div>
    <div ref="excelPreviewerRoot" class="excel-preview-root"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, useTemplateRef } from "vue";
import jsPreviewExcel from "@js-preview/excel";
import '@js-preview/excel/lib/index.css';

const excelPreviewerRootRef = useTemplateRef('excelPreviewerRoot');

const fileSrc = computed(() => {
  return `${import.meta.env.VITE_BASE_PATH}files/test.xlsx`
})

const render = (data: string | Blob | ArrayBuffer) => {
  // 获取到 DOM 节点后进行初始化
  const excelPreviewer = jsPreviewExcel.init(excelPreviewerRootRef.value as HTMLElement);

  // 传递要预览的文件地址
  excelPreviewer.preview(data).then(res => {
    console.log('预览完成', res);
  }).catch(e => {
    console.log('预览失败', e);
  });
}

const fetchFile = () => {
  fetch(fileSrc.value)
    .then(response => response.blob())
    .then(data => {
      console.log('获取文件成功', data);
      render(data)
    })
    .catch(e => {
      console.log('获取文件失败', e);
    });
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
