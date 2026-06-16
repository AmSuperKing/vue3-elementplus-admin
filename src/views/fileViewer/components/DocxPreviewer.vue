<template>
  <div class="docx-preview-container">
    <div class="plugins-tips">
      DOCX查看器示例。
      <el-link type="primary" href="https://www.npmjs.com/package/docx-preview" target="_blank">
        docx-preview
      </el-link>
      <div class="pl-20 fs-14">
        docx-preview 的缺点：
        <ol>
          <li class="ml-20">将微软 Word 文档（.docx）进行渲染预览时才会正确解析分页。</li>
          <li class="ml-20">不支持 doc 格式旧格式文档。</li>
          <li class="ml-20">WPS编辑的 DOCX 文件无法正确解析分页符，部分样式可能无法正确显示。</li>
        </ol>
        解决方案：借助服务端将文档转换为标准Word格式，确保分页符和样式正确解析。
      </div>
    </div>
    <div ref="docxPreviewerRoot" id="docx-previewer-root"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, useTemplateRef } from 'vue'
import { renderAsync } from 'docx-preview'

/**
 * docx-preview 的缺点：
 * 1. 将微软 Word 文档（.docx）转换为 HTML 格式进行渲染时才会正确解析分页。
 * 2. 不支持 doc 格式旧格式文档。
 * 3. WPS编辑的 DOCX 文件无法正确解析分页符，部分样式可能无法正确显示。
 * 解决方案：借助服务端将文档转换为标准Word格式，确保分页符和样式正确解析。
 */

const docxPreviewerRootRef = useTemplateRef('docxPreviewerRoot')

// 计算 DOCX 文件路径
const docxFileSrc = computed(() => {
  // test.docx Word编辑的DOCX文件，test2.docx WPS编辑的DOCX文件
  // return import.meta.env.PROD ? `${import.meta.env.VITE_BASE_PATH}files/test2.docx` : '/files/test2.docx'
  return import.meta.env.PROD ? `${import.meta.env.VITE_BASE_PATH}files/test.docx` : '/files/test.docx'
})

const fetchAndPreprocessDocx = async (docxUrl: string) => {
  try {
    const response = await fetch(docxUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()

    renderDocx(arrayBuffer)
  } catch (err) {
    console.error('fetch docx file error', err)
  }
}

/**
 * 渲染 DOCX 文件
 * @param docxData 处理后的 DOCX 数据
 */
const renderDocx = (docxData: Blob | ArrayBuffer | Uint8Array) => {
  // 检查 DOM 元素是否已挂载
  if (!docxPreviewerRootRef.value) {
    console.error('docx previewer root element not found')
    return
  }

  const options = {
    ignoreHeight: false,
    ignoreWidth: false,
    ignoreFonts: false,
    breakPages: true,
    debug: true,
    experimental: true,
    className: "docx-preview",
    inWrapper: true,
    hideWrapperOnPrint: false,
    trimXmlDeclaration: true,
    ignoreLastRenderedPageBreak: false,
    renderHeaders: true,
    renderFooters: true,
    renderFootnotes: true,
    renderEndnotes: true,
    useBase64URL: true,
    renderChanges: false,
    renderComments: false,
    renderAltChunks: true,
    pageMargin: true,
    convertSectionProperties: true,
    ignoreBreaks: false,
    renderLineBreaks: true,
    useMathMLPolyfill: false,
    expandBookmarks: true,
    ignoreEmptyParagraphs: false,
  }

  renderAsync(docxData, docxPreviewerRootRef.value, undefined, options)
    .then((res) => {
      console.log('rendered', res)
    })
    .catch((err) => {
      console.error('render error', err)
    })
}

onMounted(() => {
  fetchAndPreprocessDocx(docxFileSrc.value)
})

</script>

<style lang="scss" scoped>
.plugins-tips {
  margin-bottom: 15px;
  padding: 20px;
  background-color: #e7ecf3;
  color: #444;
}
.docx-preview-container {
  position: relative;
  min-height: 400px;
}
</style>
