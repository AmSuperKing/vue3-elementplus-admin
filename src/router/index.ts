import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import permission from './permission'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 注意：布局中 body 为 overflow: hidden，页面滚动发生在 layout 的
    // el-scrollbar__wrap 上，此处的 window 滚动实际不生效；
    // 页面切换的滚动重置由 AppMain.vue 的 transition before-enter 钩子处理
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

permission(router)

export default router
