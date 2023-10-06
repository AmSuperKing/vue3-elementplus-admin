import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import './permission'

import './styles/index.scss' // global css

// 自定义element-plus主题，在 element-plus scss 文件之前导入element.scss以避免 sass 混合变量的问题
import './styles/element.scss'
import 'element-plus/theme-chalk/display.css'

import { registerIcons } from '@/utils/common'

import VueCookies from 'vue-cookies'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

registerIcons(app)

app.provide('$cookies', VueCookies)

app.mount('#app')
