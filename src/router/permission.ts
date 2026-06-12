import { ElMessage } from 'element-plus'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import type { Router } from 'vue-router'
import { getToken } from '@/utils/auth'
import { useUserInfoStore } from '@/stores/userInfo'
import { settings } from '../settings'

const permission = (router: Router) => {
  NProgress.configure({ showSpinner: false }) // NProgress Configuration

  // 白名单，里面是路由对象的name
  const _WhiteList: string[] = ['login', '403', '404']

  router.beforeEach(async (to) => {
    // start progress bar
    NProgress.start()
    document.title = `${to?.meta?.title || '未知页面标题'} | ${settings.pageTitle}`
    if (to.name && _WhiteList.includes(to.name as string)) {
      return true
    }
    const token = getToken()
    const userInfo = useUserInfoStore()
    if (!token) {
      userInfo.resetInfo()
      NProgress.done()
      return {
        name: 'login',
        query: {
          redirect: to.fullPath, // redirect是指登录之后可以跳回到redirect指定的页面
        },
        replace: true,
      }
    } else {
      if (to.path === '/login') {
        return {
          name: 'dashboard',
          replace: true,
        }
      }
      if (!userInfo.userName || userInfo.authMenus.length === 0) {
        try {
          await userInfo.initUserData()
        } catch (error) {
          NProgress.done()
          return false
        }
      }
      NProgress.done()
      return true
    }
  })

  router.afterEach(() => {
    // finish progress bar
    NProgress.done()
  })
}

export default permission
