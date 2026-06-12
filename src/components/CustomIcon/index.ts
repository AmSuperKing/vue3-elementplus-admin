// export interface ExpandedIcons {
//   [key: string]: any
// }
// const expandedIcons: ExpandedIcons = {}
// const expandedIconFiles = import.meta.glob('./*.vue')
// for (const key in expandedIconFiles) {
//   const filename = key.replace(/(\.\/|\.vue)/g, '')
//   expandedIcons[filename] = expandedIconFiles[key]
// }

// export default expandedIcons

import { defineAsyncComponent } from 'vue'
import type { App, Component } from 'vue'

// 定义异步组件加载器类型
type AsyncComponentLoader = () => Promise<Component>

interface ComponentMap {
  [key: string]: AsyncComponentLoader
}

// 使用正确的类型断言
const components: ComponentMap = import.meta.glob('./*.vue') as ComponentMap

export default function install(app: App) {
  for (const [key, value] of Object.entries(components)) {
    const name = key.replace(/(\.\/|\.vue)/g, '')
    app.component(name, defineAsyncComponent(value))
  }
}
