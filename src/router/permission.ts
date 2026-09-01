// import { ElMessage } from 'element-plus'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import type { Router, RouteLocationNormalized } from 'vue-router'
import { getToken } from '@/utils/auth'
import { useUserInfoStore } from '@/stores/userInfo'
import { settings } from '../settings'

/**
 * 递归查找给定路径是否存在于菜单数据中
 * @param menus - 菜单数据数组
 * @param targetPath - 需要查找的目标路径字符串
 * @returns 如果找到匹配的路径返回 true，否则返回 false
 */
export function isPathInMenus(menus: MenuRoute[], targetPath: string): boolean {
  if (!menus || menus.length === 0) return false
  // 遍历当前层级的所有菜单项
  for (const menu of menus) {
    // 如果当前菜单项的 path 与目标路径匹配，直接返回 true
    if (menu.path === targetPath) {
      return true
    }

    // 如果当前菜单项有子菜单，则递归在子菜单中查找
    if (menu.children && menu.children.length > 0) {
      if (isPathInMenus(menu.children, targetPath)) {
        return true // 如果在子菜单中找到了，也直接返回 true
      }
    }
  }

  // 当前层级及所有子层级都未找到匹配的路径，返回 false
  return false
}

/**
 * 检查路径是否有权限访问，无权限则返回 403 路由
 * @param menus - 用户授权菜单
 * @param path - 当前访问路径
 * @returns 有权限返回 undefined（放行），无权限返回 403 路由对象
 */
function checkPermissionOrRedirect(menus: MenuRoute[], path: string) {
  if (!isPathInMenus(menus, path)) {
    return { name: '403', replace: true }
  }
  return false
}

const permission = (router: Router) => {
  NProgress.configure({ showSpinner: false }) // NProgress Configuration

  // 白名单，里面是路由对象的name
  const _WhiteList: string[] = ['login', '403', '404']

  router.beforeEach(async (to: RouteLocationNormalized) => {
    // start progress bar
    NProgress.start()
    document.title = `${to?.meta?.title || '未知页面标题'} | ${settings.pageTitle}`

    const token = getToken()
    // 将 store 获取移入守卫内部，避免模块加载时 pinia 未初始化的问题
    const userInfoStore = useUserInfoStore()

    // ========== 未登录状态处理 ==========
    if (!token) {
      // 白名单，直接访问
      if (to.name && _WhiteList.includes(to.name as string)) {
        return true
      }
      // 非白名单，重置缓存信息，跳转到登录页面
      userInfoStore.resetInfo()
      return {
        name: 'login',
        query: {
          redirect: to.fullPath, // redirect是指登录之后可以跳回到redirect指定的页面
        },
        replace: true,
      }
    }

    // ========== 已登录状态处理 ==========

    // 登录后，再次访问登录页面，重定向到首页
    if (to.path === '/login') {
      return { path: '/', replace: true }
    }

    // 用户信息未初始化时，先拉取数据
    if (!userInfoStore.userName || userInfoStore.authMenus.length === 0) {
      try {
        await userInfoStore.initUserData()
      } catch (error) {
        console.error(error)
        // 初始化失败，阻止导航（返回 false）
        return false
      }
    }

    // 校验当前路径是否在授权菜单中，不在则跳转 403
    // 无论是否刚完成初始化，都需要校验
    const redirectResult = checkPermissionOrRedirect(userInfoStore.authMenus, to.path)
    if (redirectResult) {
      return redirectResult
    }

    // 有权限，放行
    return true
  })

  router.afterEach(() => {
    // finish progress bar
    // 统一在此处结束进度条，无需在 beforeEach 中手动调用 NProgress.done()
    NProgress.done()
  })
}

export default permission
