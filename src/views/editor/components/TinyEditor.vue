<template>
  <div class="editor-container">
    <div ref="editorRef" class="editor-content" />
  </div>
</template>

<script setup lang="ts">
import FluentEditor, {
  FULL_TOOLBAR,
  generateToolbarTip,
  generateTableUp,
  CollaborationModule,
} from '@opentiny/fluent-editor';
import '@opentiny/fluent-editor/style.css'
import type { Range } from '@opentiny/fluent-editor'

// emoji 表情
import data from '@emoji-mart/data';
import { computePosition } from '@floating-ui/dom';
import type { EmojiMartData } from '@emoji-mart/data';
import { Picker } from 'emoji-mart';

// table 表格
import {
  defaultCustomSelect,
  TableMenuContextmenu,
  TableSelection,
  TableUp,
  TableResizeLine,
  TableResizeScale
} from 'quill-table-up';
import 'quill-table-up/index.css';
import 'quill-table-up/table-creator.css';

// toolbar-tip 工具栏提示
import QuillToolbarTip from 'quill-toolbar-tip';
import 'quill-toolbar-tip/dist/index.css';

// formula 可编辑公式
import type { MathliveModule } from '@opentiny/fluent-editor';
import 'mathlive';
import 'mathlive/static.css';
import 'mathlive/fonts.css';

// markdown 操作
import MarkdownShortcuts from 'quill-markdown-shortcuts';

// mind-map 思维导图
import SimpleMindMap from 'simple-mind-map';
import Drag from 'simple-mind-map/src/plugins/Drag.js';
import Export from 'simple-mind-map/src/plugins/Export.js';
import Themes from 'simple-mind-map-plugin-themes';
import nodeIconList from 'simple-mind-map/src/svg/icons';

// flow-chart 流程图
import LogicFlow from '@logicflow/core';
import { DndPanel, SelectionSelect, Snapshot } from '@logicflow/extension';

// syntax 语法高亮
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// screenshot 截屏
import Html2Canvas from 'html2canvas';
window.Html2Canvas = Html2Canvas;

// 公式
import katex from 'katex';
import 'katex/dist/katex.min.css';
window.katex = katex;
import { onMounted, ref, watch } from 'vue'

// Props 和 Emits 定义
const props = withDefaults(defineProps<{
  modelValue: string
  options?: Record<string, unknown>
}>(), {
  options: () => ({ theme: 'snow' }),
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// 编辑器实例和容器引用
let editor: FluentEditor
const editorRef = ref<HTMLElement>()
const isInitialized = ref(false)
// 初始化语言
const lang = ref('zh-CN');

// 监听 v-model 值的变化（外部值变化时更新编辑器）
watch(
  () => props.modelValue,
  (newValue) => {
    if (isInitialized.value && editor && newValue !== editor.root.innerHTML) {
      // 如果是 HTML 字符串，需要通过 Delta 格式设置内容
      // 不推荐用 editor.root.innerHTML = html 的方式设置内容
      const delta = editor.clipboard.convert({ html: newValue })
      editor.setContents(delta, 'silent')
    }
  },
)

const initEditor = async () => {
  if (editorRef.value) {
    // 注册 Quill 模块
    FluentEditor.register(
      { 'modules/toolbar-tip': generateToolbarTip(QuillToolbarTip) },
      true
    );
    FluentEditor.register({ 'modules/table-up': generateTableUp(TableUp) }, true);
    FluentEditor.register('modules/markdownShortcuts', MarkdownShortcuts);
    FluentEditor.register(
      'modules/collaborative-editing',
      CollaborationModule,
      true
    );
    editor = new FluentEditor(editorRef.value, {
      theme: 'snow',
      modules: {
        toolbar: {
          container: [...FULL_TOOLBAR, ['mind-map', 'flow-chart']],
          handlers: {
            formula() {
              const mathlive = this.quill.getModule('mathlive') as MathliveModule;
              mathlive.createDialog('e=mc^2');
            },
          },
        },
        file: true,
        markdownShortcuts: true,
        syntax: {
          hljs,
        },
        counter: false,
        mathlive: true,
        emoji: {
          emojiData: data as EmojiMartData,
          EmojiPicker: Picker,
          emojiPickerPosition: computePosition,
        },
        i18n: {
          locale: lang.value,
        },
        'toolbar-tip': {
          defaultTooltipOptions: {
            tipHoverable: false,
          },
        },
        'table-up': {
          customSelect: defaultCustomSelect,
          modules: [{ module: TableSelection }, { module: TableMenuContextmenu }, { module: TableResizeLine }, { module: TableResizeScale }],
        },
        'mind-map': {
          deps: {
            SimpleMindMap,
            Themes,
            Drag,
            Export,
            nodeIconList,
          },
        },
        'flow-chart': {
          deps: {
            LogicFlow,
            DndPanel,
            SelectionSelect,
            Snapshot,
          },
        },
        'uploader': {
          mimetypes: {
            file: [
              'application/msword', // .doc
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
              'application/vnd.ms-excel', // .xls
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
              'application/pdf',
              'application/vnd.ms-powerpoint', // .ppt
              'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
              'application/mspowerpoint', // .ppt
              '.txt',
              '.zip',
              '.rar',
              '.7z',
              '.gz',
            ],
            image: ['image/*', '.png', '.jpg', '.jpeg', '.gif', '.webp'],
            video: ['video/*', '.mp4', '.webm', '.ogg', '.avi', '.mkv'],
          },
          maxSize: {
            file: 50 * 1024 * 1024, // 50 MB
            image: 20 * 1024 * 1024, // 20 MB
            video: 100 * 1024 * 1024, // 100 MB
          },
          multiple: {
            file: false,
            image: true,
            video: false,
          },
          handler: async (range: Range, files: File[]) => {
            console.log('Upload started:', range, files);

            // 模拟上传过程
            const uploadPromises = files.map(async (file: File) => {
              try {
                // 这里替换为你的实际上传逻辑
                // 例如：
                // const formData = new FormData();
                // formData.append('file', file);
                // const response = await fetch('/api/upload', {
                //   method: 'POST',
                //   body: formData
                // });
                // const data = await response.json();
                // return data.url;
                console.log('Upload progress:', file);
                // 可自行实现上传逻辑，添加进度条弹窗

                // 模拟延迟
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (file.type.startsWith('image')) return 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg';
                else if (file.type.startsWith('video')) return 'https://9ffb3b32-43a2-4043-ad81-41f21f4f7c36.mdnplay.dev/shared-assets/videos/flower.webm';
                else return 'https://mock.com/upload/' + new Date().getTime() + '.' + file.name.split('.').pop();
              } catch (error) {
                console.error('Upload error:', error);
                return false; // 上传失败时返回 false
              }
            });

            return await Promise.all(uploadPromises);
          },
          success(file: File, range: Range) {
            console.log('Upload success:', file, range);
          },
          fail(file: File, range: Range) {
            console.log('Upload failed:', file, range);
            // 上传失败：服务错误、网络错误、文件类型错误、文件大小错误等
          },
        }
      },
      ...props.options,
    });

    // 编辑器内容变化时触发 update:modelValue
    editor.on('text-change', () => {
      const html = editor.root.innerHTML
      emit('update:modelValue', html)
    })

    // 初始化编辑器内容
    if (props.modelValue) {
      const delta = editor.clipboard.convert({ html: props.modelValue })
      editor.setContents(delta, 'silent')
    }

    isInitialized.value = true
  }
}

// 初始化编辑器
onMounted(() => {
  initEditor()
})
</script>

<style lang="scss" scoped>
.editor-container {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
