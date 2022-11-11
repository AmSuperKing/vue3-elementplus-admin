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

  const mockDevConfig = {
    supportTs: true,
    logger: false,
    mockPath: './mock/dev/',
  }
  const mockProdConfig = {
    supportTs: true,
    logger: false,
    mockPath: './mock/prod/',
    localEnabled: false, // 开发环境
    prodEnabled: true, // 生产环境设为true，也可以根据官方文档格式
    injectCode: 
    ` import { setupProdMockServer } from '../mock/prod';
      setupProdMockServer(); `,
    watchFiles: true, // 监听文件内容变更
    injectFile: path.resolve('src/main.ts'), // 在main.ts注册后需要在此处注入，否则可能报找不到setupProdMockServer的错误
  }

  const mockConfig = mode === 'production' ? mockProdConfig : mockDevConfig

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
