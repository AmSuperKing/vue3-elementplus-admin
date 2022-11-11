import type { App } from 'vue'
import * as elIcons from '@element-plus/icons-vue'
import Icon from '@/components/icon/index.vue'

export function registerIcons(app: App) {
  /*
   * 全局注册 Icon
   * 使用方式: <Icon name="name" size="size" color="color" />
   * 图标名称：如果是element图标需 el-icon- 前缀 + 图标名；
   * 如果是自定义svg图标，需 svg- 前缀 + svg资源文件名，资源见<assets/icons/svg>目录
   */
  app.component('Icon', Icon)

  /*
   * 全局注册element Plus的icon
   */
  const icons = elIcons as any
  for (const i in icons) {
    // 以 el-icon- 前缀使用
    app.component(`el-icon-${icons[i].name}`, icons[i])
    // 直接图标组件名 使用
    app.component(`${icons[i].name}`, icons[i])
  }
}

/**
 * 是否是外部链接
 * @param path
 */
export function isExternal(path: string): boolean {
  return /^(https?|ftp|mailto|tel):/.test(path)
}

/**
 * 展平数组
 * @param {Array} arr
 * @returns {Array} flatternArrayRes
 */
export function flattern(arr: anyObj[]): anyObj[] {
  const res: any = []
  arr.forEach((item) => {
    if (item?.children?.length) {
      res.push(...flattern(item.children))
    } else {
      res.push(item)
    }
  })
  return res
}
