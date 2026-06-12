// 为 @wangeditor/editor-for-vue 提供类型声明
// 由于该包的 package.json exports 配置问题，需要手动声明

declare module '@wangeditor/editor-for-vue' {
  import { DefineComponent, PropType } from 'vue'
  import type { IDomEditor, IEditorConfig, IToolbarConfig, SlateDescendant } from '@wangeditor/editor'

  export interface EditorProps {
    mode?: 'default' | 'simple'
    defaultContent?: SlateDescendant[]
    defaultHtml?: string
    defaultConfig?: Partial<IEditorConfig>
    modelValue?: string
  }

  export interface ToolbarProps {
    editor?: IDomEditor
    mode?: 'default' | 'simple'
    defaultConfig?: Partial<IToolbarConfig>
  }

  const Editor: DefineComponent<EditorProps>
  const Toolbar: DefineComponent<ToolbarProps>

  export { Editor, Toolbar }
}
