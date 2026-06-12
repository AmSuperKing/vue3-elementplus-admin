/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_PATH: string
  readonly VITE_AXIOS_BASE_URL: string
  readonly ENV: string
  readonly VITE_OUT_DIR: string
  // 其他环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
