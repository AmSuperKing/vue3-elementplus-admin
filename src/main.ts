import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { useCookies } from 'vue3-cookies'
import directives from './directives'
import { registerIcons } from '@/utils/common'
import i18n from './locales'

import './assets/styles/index.scss'
// 自定义element-plus主题，在 element-plus scss 文件之前导入element.scss以避免 sass 混合变量的问题
import '@/assets/styles/element.scss'
import 'element-plus/theme-chalk/display.css'
// 导入暗色模式样式
import './assets/styles/dark.scss'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

// 注册 i18n
app.use(i18n)

// 注册自定义指令
app.use(directives)

registerIcons(app)

const Vue3Cookies = useCookies()
const $cookies = Vue3Cookies.cookies
app.provide('$cookies', $cookies)

app.mount('#app')
