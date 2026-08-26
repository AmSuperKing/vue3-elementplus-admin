/**
 * 从 src/router/routes.ts 自动生成 public/mock/authMenus.json
 *
 * 转换规则：
 * 1. 仅包含有 children 的路由（菜单是层级结构），自动排除纯重定向路由和 /login
 * 2. 排除 notFound 通配路由 { path: '/:pathMatch(.*)*', name: 'notFound' }
 * 3. 子路由 path 拼接为完整路径（父 path + / + 子 path）
 * 4. 子路由移除 component 字段
 * 5. 父路由 component: Layout 转为字符串 "Layout"
 * 6. 保留 meta、hidden、redirect 等字段
 *
 * 用法: node scripts/generate-menus.js
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const __dirname = dirname(fileURLToPath(import.meta.url))
const routesPath = resolve(__dirname, '../src/router/routes.ts')
const outputPath = resolve(__dirname, '../public/mock/authMenus.json')

function generateMenus() {
  // 1. 读取 routes.ts 源码
  const source = readFileSync(routesPath, 'utf-8')

  // 2. 转换源码为可执行 JS
  const transformed = source
    // 替换 Layout 导入为字符串常量
    .replace(
      /import\s+Layout\s+from\s+['"][^'"]+['"]/,
      'const Layout = "Layout"'
    )
    // 替换动态 import() 为字符串路径（提取路径，忽略 webpackChunkName 注释）
    .replace(
      /\(\)\s*=>\s*import\((?:\/\*[\s\S]*?\*\/\s*)?['"]([^'"]+)['"]\)/g,
      '"$1"'
    )
    // 移除 export default
    .replace(/export\s+default\s+routes/, '/* export default removed */')

  // 3. 执行转换后的代码获取 routes 数组
  const sandbox = { __routes: null }
  const code = `${transformed}\n__routes = routes;`
  vm.runInNewContext(code, sandbox)
  const routes = sandbox.__routes

  if (!Array.isArray(routes)) {
    throw new Error('Failed to parse routes from routes.ts')
  }

  // 4. 路由转换辅助函数

  /** 将子路由的相对 path 拼接为完整路径 */
  function buildFullPath(parentPath, childPath) {
    const base = parentPath.replace(/\/$/, '')
    return `${base}/${childPath}`
  }

  /** 转换子路由：拼接完整 path，移除 component */
  function transformChild(child, parentPath) {
    const item = {}

    if (child.path) {
      item.path = buildFullPath(parentPath, child.path)
    }
    if (child.name) item.name = child.name
    if (child.meta) item.meta = child.meta
    if (child.hidden !== undefined) item.hidden = child.hidden

    return item
  }

  /** 转换父路由：保留所有字段，递归处理 children */
  function transformRoute(route) {
    const item = {}

    if (route.path) item.path = route.path
    if (route.name) item.name = route.name
    if (route.redirect) item.redirect = route.redirect
    if (route.component) item.component = route.component
    if (route.meta) item.meta = route.meta
    if (route.hidden !== undefined) item.hidden = route.hidden

    if (route.children) {
      item.children = route.children
        .filter((child) => child.name !== 'notFound')
        .map((child) => transformChild(child, route.path))
    }

    return item
  }

  // 5. 过滤并转换路由
  const menuData = routes
    // 排除 notFound 通配路由
    .filter((route) => route.name !== 'notFound')
    // 仅包含有 children 的路由（构成菜单层级）
    .filter((route) => route.children && route.children.length > 0)
    .map(transformRoute)

  // 6. 包装并写入 authMenus.json
  const output = {
    code: 200,
    message: 'success',
    data: menuData,
  }

  const jsonStr = JSON.stringify(output, null, 2) + '\n'
  writeFileSync(outputPath, jsonStr, 'utf-8')

  console.log(`authMenus.json 已生成: ${outputPath}`)
  console.log(`共 ${menuData.length} 个菜单项`)
}

generateMenus()
