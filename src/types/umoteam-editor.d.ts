declare module '@umoteam/editor' {
  import { DefineComponent } from 'vue'

  export interface UmoEditorProps {
    editorKey?: string
    locale?: 'zh-CN' | 'en-US' | string
    theme?: 'light' | 'dark' | string
    skin?: string
    height?: string | number
    fullscreenZIndex?: number
    dicts?: {
      fonts?: Array<{
        label: string | { en_US: string; zh_CN: string }
        value: string | null
      }>
      colors?: string[]
      lineHeights?: Array<{
        label: string | { en_US: string; zh_CN: string }
        value: number
        default?: boolean
      }>
      symbols?: Array<{
        label: string | { en_US: string; zh_CN: string }
        items: string
      }>
      emojis?: Array<{
        label: string | { en_US: string; zh_CN: string }
        items: string
      }>
      pageSizes?: Array<{
        label: string
        width: number
        height: number
        default?: boolean
      }>
    }
    toolbar?: {
      showSaveLabel?: boolean
      defaultMode?: 'ribbon' | 'simple' | string
      menus?: string[]
    }
    page?: {
      layouts?: string[]
      defaultMargin?: {
        left: number
        right: number
        top: number
        bottom: number
      }
      defaultOrientation?: 'portrait' | 'landscape'
      defaultBackground?: string
    }
    document?: {
      title?: string
      content?: string
    }
    save?: {
      enable?: boolean
      interval?: number
    }
    watermark?: {
      enabled?: boolean
      text?: string
      opacity?: number
      fontSize?: number
      color?: string
    }
    print?: {
      enable?: boolean
    }
    export?: {
      enable?: boolean
      types?: string[]
    }
    ai?: {
      enable?: boolean
      apiKey?: string
      baseURL?: string
      model?: string
    }
    extensions?: unknown[]
    readonly?: boolean
    disabled?: boolean
    placeholder?: string
    autofocus?: boolean | 'start' | 'end' | number
    editable?: boolean
    onReady?: (editor: unknown) => void
    onChange?: (content: string, editor: unknown) => void
    onSave?: (content: string, page: string, document: string) => boolean | Promise<boolean>
    onFileUpload?: (file: File) => { id: string; url: string } | Promise<{ id: string; url: string }>
    onFileDelete?: (id: string, url: string, type: string) => void
    onDestroy?: () => void
    onFocus?: (editor: unknown) => void
    onBlur?: (editor: unknown) => void
  }

  const UmoEditor: DefineComponent<UmoEditorProps>

  export { UmoEditor }

  export default UmoEditor
}
