// types/directives.d.ts
// 全局自定义指令类型增强：
// 通过扩展 vue 的 GlobalDirectives 接口，让模板中使用全局注册指令
// （v-permission、v-click-outside）时获得完整类型提示：
// 指令名自动补全、binding 值类型校验、悬停显示文档。
// 注意：修改本文件后需重启 VSCode 的 Vue/TypeScript 服务才能立即生效。

import type clickOutside from '@/directives/clickOutside'
import type permission from '@/directives/permission'
import type move from '@/directives/move'
import type { PermissionValue } from '@/directives/permission'
import type { MoveOptions } from '@/directives/move'

/**
 * v-permission 指令类型
 * 用法: v-permission="'user:add'" 或 v-permission="['user:add', 'user:edit']"
 */
export type PermissionDirective = typeof permission

/**
 * v-click-outside 指令类型
 * 用法: v-click-outside="handler" 或 v-click-outside:selector="handler"
 */
export type ClickOutsideDirective = typeof clickOutside

/**
 * v-move 指令类型
 * 用法: v-move 或 v-move="options"
 */
export type MoveDirective = typeof move

declare module 'vue' {
  interface GlobalDirectives {
    /**
     * 权限校验指令：满足任一权限即显示元素，否则移除 DOM
     * 用法: v-permission="'user:add'" 或 v-permission="['user:add', 'user:edit']"
     */
    vPermission: PermissionDirective
    /**
     * 点击元素外部时触发回调；可用 arg 传入排除区域的 CSS 选择器
     * （含 "." 的选择器如 .class 会被解析成修饰符，需改用动态 arg v-click-outside:[selector]）
     * 用法: v-click-outside="handler" 或 v-click-outside:[excludeSelector]="handler"
     */
    vClickOutside: ClickOutsideDirective
    /**
     * 拖拽指令：可拖拽元素并实时更新位置
     * 用法: v-move 或 v-move="options"
     */
    vMove: MoveDirective
  }
}

// 供其他模块按需引用指令值类型
export type { ClickOutsideHandler } from '@/directives/clickOutside'
export type { PermissionValue } from '@/directives/permission'
export type { MoveOptions } from '@/directives/move'
