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
import type { App } from 'vue'
interface componentItem {
  [key: string]: any
}
const components: componentItem = import.meta.glob('./*.vue') // 异步方式
export default function install(app: App) {
  for (const [key, value] of Object.entries(components)) {
    const name = key.replace(/(\.\/|\.vue)/g, '')
    app.component(name, defineAsyncComponent(value))
  }
}
