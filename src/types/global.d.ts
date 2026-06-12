interface MenuMeta {
  title: string
  icon?: string
}

interface MenuRoute {
  meta: MenuMeta
  menuName: string
  path: string
  menuPath?: string
  icon?: string
  hidden?: boolean
  children?: MenuRoute[]
  [key: string]: unknown
}

interface TagsItem {
  name: string
  path: string
  title: string
  [key: string]: unknown
}

interface PageData {
  pageNo?: number
  pageNum?: number
  pageSize?: number
}

interface UserInfo {
  userName: string
  userNameCn: string
  roles: string[]
  token: string
}

interface ApiResponse<T = unknown> {
  code: number
  data: T
  message?: string
}

// 为 vue3-cookies 添加类型声明
interface Cookies {
  config: (config: CookiesConfig) => void
  get: (keyName: string) => string
  set: (
    keyName: string,
    value: string,
    expireTimes?: string | number | Date,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite?: string,
  ) => VueCookiesManager
  remove: (keyName: string, path?: string, domain?: string) => boolean
  isKey: (keyName: string) => boolean
  keys: () => string[]
}

// 为 window 对象添加自定义属性类型声明
interface Window {
  Html2Canvas?: (element: HTMLElement, options?: Partial<{
    backgroundColor: string | null;
    foreignObjectRendering: boolean;
    removeContainer?: boolean;
    [key: string]: unknown;
  }>) => Promise<HTMLCanvasElement>
  katex?: import('katex')
}
