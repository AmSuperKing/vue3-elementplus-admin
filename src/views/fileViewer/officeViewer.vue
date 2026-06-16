<template>
  <div>
    <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="DOCX文档预览" name="docx">
      <DocxPreviewer v-if="activeName == 'docx'" />
    </el-tab-pane>
    <el-tab-pane label="Excel文档预览" name="xlsx">
      <div  v-if="activeName == 'xlsx'">
        <div class="plugins-tips">
          Excel查看器示例，依赖库：
          <el-link type="primary" href="https://www.npmjs.com/package/xlsx" target="_blank">
            xslx
          </el-link>
          <el-link type="primary" href="https://www.npmjs.com/package/exceljs" target="_blank" class="mlr-10">
            exceljs
          </el-link>
          <el-link type="primary" href="https://www.npmjs.com/package/@js-preview/excel" target="_blank">
            x-data-spreadsheet
          </el-link>
        </div>
        <div style="height: 60vh;">
          <ExcelPreviewer :file="fileData" v-if="fileData" />
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="PPTX文档预览" name="pptx">
      <PPTXPreviewer  v-if="activeName == 'pptx'" />
    </el-tab-pane>
  </el-tabs>

  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import DocxPreviewer from './components/DocxPreviewer.vue'
import ExcelPreviewer from './components/ExcelPreviewer.vue'
import PPTXPreviewer from './components/PPTXPreviewer.vue'

const activeName = ref('pptx')

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
