// directives/permission.ts
import type { Directive } from 'vue'
import { useUserInfoStore } from '@/stores/userInfo'

/** 指令值类型：单个权限标识或权限标识数组 */
export type PermissionValue = string | string[]

/**
 * 获取当前用户权限列表
 * TODO: 替换为你项目中实际的权限获取方式
 */
function getAuthList(): string[] {
  const userInfoStore = useUserInfoStore()
  return userInfoStore.permissions
}

/**
 * 权限校验指令 v-permission
 * 用法: v-permission="'user:add'" 或 v-permission="['user:add', 'user:edit']"
 * 模板中的类型提示由 src/types/directives.d.ts 中的 GlobalDirectives 增强提供
 */
const permission: Directive<HTMLElement, PermissionValue> = {
  mounted(el, binding) {
    const { value } = binding

    // 从全局状态/store/工具函数中获取当前用户的权限列表
    // ⚠️ 请根据项目实际情况替换此处逻辑
    const authList: string[] = getAuthList()

    if (!value) {
      // console.warn('[v-permission] 未传入权限标识')
      return
    }

    // 支持单个字符串或字符串数组
    const requiredPermissions = Array.isArray(value) ? value : [value]

    // 只要满足其中一个权限即显示（OR 逻辑）
    const hasPermission = requiredPermissions.some((perm) =>
      authList.includes(perm)
    )

    if (!hasPermission) {
      // 彻底移除 DOM 节点，而非隐藏
      if (el?.parentNode?.removeChild) el.parentNode?.removeChild(el)
      else el.style.display = 'none' // 兜底隐藏元素
    }
  },
}

export default permission
