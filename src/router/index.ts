import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import permission from './permission'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
