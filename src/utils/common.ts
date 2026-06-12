import type { App, Component } from 'vue'
import * as elIcons from '@element-plus/icons-vue'
import CustomIcon from '@/components/CustomIcon/index.vue'

export function registerIcons(app: App) {
  /*
   * 全局注册 CustomIcon
   * 使用方式: <CustomIcon name="name" size="size" color="color" />
   * 图标名称：如果是element图标需 el-icon- 前缀 + 图标名；
   * 如果是自定义svg图标，需 svg- 前缀 + svg资源文件名，资源见<assets/icons/svg>目录
   */
  app.component('CustomIcon', CustomIcon)

  /*
   * 全局注册element Plus的icon
   */
  for (const key in elIcons) {
    if (Object.prototype.hasOwnProperty.call(elIcons, key)) {
      const icon = elIcons[key as keyof typeof elIcons]
      // 以 el-icon- 前缀使用
      app.component(`el-icon-${icon.name}`, icon as Component)
      // 直接图标组件名 使用
      app.component(`${icon.name}`, icon as Component)
    }
  }
}

/**
 * 是否是外部链接
 * @param path - 要检查的路径或URL
 * @returns 是否为外部链接
 */
export function isExternal(path: string): boolean {
  return /^(https?|ftp|mailto|tel):/.test(path)
}

/**
 * 展平数组（递归处理嵌套的children结构）
 * @param arr - 包含可能嵌套children属性的对象数组
 * @returns 展平后的数组
 */
interface TreeNode {
  children?: TreeNode[]
  [key: string]: unknown
}

export function flattern(arr: TreeNode[]): TreeNode[] {
  const res: TreeNode[] = []
  arr.forEach((item) => {
    if (item?.children && item.children.length > 0) {
      res.push(...flattern(item.children))
    } else {
      res.push(item)
    }
  })
  return res
}
