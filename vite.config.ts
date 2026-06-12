import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { svgBuilder } from './src/components/Icon/svg/index'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // ANSI color codes for terminal output
  const cyan = '\x1b[35m'
  const reset = '\x1b[0m'

  console.log(`${cyan}-------------------------${reset}`)
  console.log(`${cyan}--- vite config ---${reset}`)
  console.log(`${cyan}--- command: ${reset}`, command)
  console.log(`${cyan}--- mode: ${reset}`, mode)
  console.log(`${cyan}-------------------------${reset}`)

  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_BASE_PATH,
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      svgBuilder('./src/assets/svgs/')
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Element Plus 单独分包
            if (id.includes("element-plus")) {
              return "element-plus";
            }

            // Vue 核心库 - 精确匹配
            if (id.includes("/node_modules/vue/") ||
              id.includes("/node_modules/@vue/") ||
              id === "vue" ||
              id.includes("/node_modules/pinia/") ||
              id.includes("/node_modules/vue-router/")) {
              return "vue-vendor";
            }

            // 编辑器相关 - 按类型细分
            if (id.includes("/node_modules/tinymce/") || id.includes("/@tinymce/")) {
              return "editor-tinymce";
            }
            if (id.includes("/node_modules/@wangeditor/") || id.includes("wangeditor")) {
              return "editor-wangeditor";
            }
            if (id.includes("/node_modules/md-editor-v3/")) {
              return "editor-markdown";
            }
            if (id.includes("/node_modules/@umoteam/")) {
              return "editor-umoteam";
            }
            if (id.includes("/node_modules/@opentiny/")) {
              return "editor-opentiny";
            }

            // CodeMirror 相关 - 细分为核心和语言包
            if (id.includes("/node_modules/codemirror/") || id.includes("/node_modules/@codemirror/")) {
              if (id.includes("lang-") || id.includes("autocomplete") || id.includes("lint")) {
                return "codemirror-extensions";
              }
              return "codemirror-core";
            }
            if (id.includes("/node_modules/vue-codemirror6/")) {
              return "codemirror-vue";
            }

            // 图表库
            if (id.includes("/node_modules/echarts/")) {
              return "echarts";
            }

            // PDF 查看器
            if (id.includes("/node_modules/@embedpdf/")) {
              return "pdf-viewer";
            }

            // HTTP 请求库
            if (id.includes("/node_modules/axios/")) {
              return "http-client";
            }

            // 工具库
            if (id.includes("/node_modules/@vueuse/") ||
              id.includes("/node_modules/crypto-js/") ||
              id.includes("/node_modules/nprogress/")) {
              return "utils";
            }

            // 其他大型库
            if (id.includes("/node_modules/highlight.js/") ||
              id.includes("/node_modules/html2canvas/")) {
              return "visualization";
            }

            // LogicFlow 流程图
            if (id.includes("/node_modules/@logicflow/")) {
              return "logicflow";
            }

            // simple-mind-map 思维导图
            if (id.includes("/node_modules/simple-mind-map")) {
              return "mind-map";
            }

            // Quill 相关
            if (id.includes("/node_modules/quill") || id.includes("/quill-")) {
              return "quill";
            }

            // emoji-mart
            if (id.includes("/node_modules/emoji-mart/") || id.includes("/node_modules/@emoji-mart/")) {
              return "emoji";
            }

            // mathlive
            if (id.includes("/node_modules/mathlive/")) {
              return "mathlive";
            }

            // screenfull
            if (id.includes("/node_modules/screenfull/")) {
              return "screenfull";
            }

            // node_modules 中的其他依赖
            if (id.includes("node_modules")) {
              return "vendor";
            }
          }
        },
      },
      chunkSizeWarningLimit: 1000, // 提高警告阈值
      brotliSize: true, // 启用 brotli 压缩报告
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5100,
      // open: true,
      hmr: {
        overlay: true,
      },
    },
  }
})
