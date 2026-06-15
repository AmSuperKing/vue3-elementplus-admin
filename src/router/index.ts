import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import permission from './permission'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

permission(router)

export default router
