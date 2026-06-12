import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { svgBuilder } from './src/components/CustomIcon/svg/index'

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
            if (id.includes("element-plus")) {
              return "element-plus";
            }
            if (id.includes("tinymce")) {
              return "tinymce";
            }
            if (id.includes("codemirror")) {
              return "codemirror";
            }
            if (id.includes("md-editor-v3")) {
              return "md-editor-v3";
            }
            if (id.includes("wangeditor")) {
              return "wangeditor";
            }
            if (id.includes("umoteam")) {
              return "umoteam-editor";
            }
            if (id.includes("@opentiny/fluent-editor") ||
              id.includes("emoji-mart") ||
              id.includes("quill-table-up") ||
              id.includes("quill-toolbar-tip") ||
              id.includes("mathlive") ||
              id.includes("quill-markdown-shortcuts") ||
              id.includes("simple-mind-map") ||
              id.includes("@logicflow/core") ||
              id.includes("highlight.js") ||
              id.includes("html2canvas") ||
              id.includes("katex")) {
              return "opentiny-fluent-editor";
            }
            if (id.includes("node_modules")) {
              return "vendor";
            }
          }
        },
      },
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
