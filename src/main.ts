import './assets/styles/index.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useCookies } from 'vue3-cookies'
import { registerIcons } from '@/utils/common'

import App from './App.vue'
import router from './router'

// 自定义element-plus主题，在 element-plus scss 文件之前导入element.scss以避免 sass 混合变量的问题
import '@/assets/styles/element.scss'
import 'element-plus/theme-chalk/display.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

registerIcons(app)

const Vue3Cookies = useCookies()
const $cookies = Vue3Cookies.cookies
app.provide('$cookies', $cookies)

app.mount('#app')
