import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { svgBuilder } from './src/components/icon/svg/index'

// 引入viteMockServe
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log('server start mode: =>', mode)

  const mockConfig = {
    supportTs: true,
    logger: false,
    mockPath: './mock',
    localEnabled: mode === 'development' ? true : false, // 开发环境
    prodEnabled: mode === 'production' ? true : false, // 生产环境
    watchFiles: true, // 监听文件内容变更
  }

  return {
    base: './',
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      svgBuilder('./src/assets/icons/'),
      viteMockServe(mockConfig),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 9527,
      open: true,
      hmr: {
        overlay: true,
      },
    },
  }
})
