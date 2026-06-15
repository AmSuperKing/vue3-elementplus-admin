<template>
  <div>
    <div class="plugins-tips">
      TinyMCE富文本编辑器示例。
      <el-link type="primary" href="https://www.tiny.cloud/docs/tinymce/latest/vue-cloud/" target="_blank">
        @tinymce/tinymce-vue
      </el-link>
    </div>
    <div class="rich-text-editor">
      <!--  本地托管tinymce资源，不使用官方CDN Cloud -->
      <Editor tinymceScriptSrc="/tinymce/tinymce.min.js" license-key="gpl" :init="editorInitOptions"
        v-model="editorContent" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import type { RawEditorOptions } from "tinymce";
import { ElLoading, ElMessage } from 'element-plus'
import request from '@/utils/request'


const editorContent = ref('<p>欢迎使用 TinyMCE!</p>')

const plugins = [
  "table",
  "link",
  "image",
  "media",
  "code",
  "lists",
  "advlist",
  "hr",
  "formatpainter",
  "searchreplace",
  "autolink"
];

const toolbar =
  "undo redo | forecolor backcolor bold italic underline strikethrough codesample blockquote subscript superscript hr | removeformat | styles fontsize fontfamily | alignleft aligncenter alignright alignjustify outdent indent lineheight formatpainter | bullist numlist | table link image media | code";

const editorInitOptions: RawEditorOptions = {
  language: "zh-CN",
  base_url: '/tinymce', // 本地托管tinymce资源，不使用官方CDN Cloud
  skin: "oxide",
  branding: false,
  promotion: false,
  statusbar: false,
  width: "100%",
  height: "50vh",
  resize: false,
  menubar: false,
  plugins,
  toolbar,
  convert_urls: false,

  // 图片上传配置
  images_upload_url: "/api/upload",

  setup: function (editor) {
    editor.on("ExecCommand", function (e) {
      if (e.command === "mceInsertTable") {
        setTimeout(() => {
          const tables = editor.dom.select("table");
          const latestTable = tables[tables.length - 1];
          if (latestTable) {
            editor.dom.select("td, th", latestTable).forEach((cell) => {
              editor.dom.setStyles(cell, {
                "border-style": "solid",
                "border-width": "1px",
                "border-color": "#000",
                padding: "5px"
              });
            });
          }
        }, 10);
      }
    });
  },

  paste_postprocess: function (plugin, args) {
    const elements = args.node.querySelectorAll("table, td, th");
    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.border = "1px solid #000";
        el.style.padding = "5px";
        el.style.textAlign = "center";
        el.style.borderCollapse = "collapse";
        if (el.tagName === "TABLE") {
          el.style.width = "100%";
          el.setAttribute("border", "1");
        }
      }
    });
    const imgElements = args.node.querySelectorAll("img");
    imgElements.forEach((imgEl) => {
      if (imgEl instanceof HTMLImageElement) {
        imgEl.style.width = "100%";
      }
    });
  },

  file_picker_callback: (callback, value, meta) => {
    const loadingInstance = ElLoading.service({ fullscreen: true })
    const fileType = meta.filetype === "media" ? "video" : "image";

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", `${fileType}/*`);

    input.onchange = async () => {
      const files = input.files;
      if (!files || files.length === 0) {
        loadingInstance.close();
        return;
      }
      const file = files[0];
      if (!file) {
        loadingInstance.close();
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      const url = "/api/upload";

      try {
        // 假设 request.post 返回的是 Promise
        const rs = await request.post(url, formData) as unknown as ApiResponse<{ url: string }>
        loadingInstance.close()
        if (rs && rs.code === 200) {
          callback(rs.data.url);
        } else {
          ElMessage.error("上传失败");
        }
      } catch {
        loadingInstance.close()
        ElMessage.error("上传异常");
      }
    };
    input.click();
  },

  images_upload_handler: (blobInfo) =>
    new Promise(async (resolve, reject) => {
      const formData = new FormData();
      formData.append("file", blobInfo.blob());
      const url = "/api/upload";
      const loadingInstance = ElLoading.service({ fullscreen: true })

      try {
        const rs = await request.post(url, formData) as unknown as ApiResponse<{ url: string }>
        loadingInstance.close()
        if (rs && rs.code === 200) {
          resolve(rs.data.url);
        } else {
          reject(rs.message || "上传失败");
        }
      } catch {
        loadingInstance.close()
        reject("上传异常");
      }
    })
};
</script>

<style lang="scss" scoped>
.plugins-tips {
  margin-bottom: 15px;
  padding: 20px;
  background-color: #e7ecf3;
  color: #444;
}
</style>
