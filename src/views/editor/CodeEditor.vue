<template>
  <div>
    <div class="plugins-tips">
      vue-codemirror6：vue3版本的代码编辑器，详细配置参考文档。 访问地址：
      <el-link type="primary" href="https://www.npmjs.com/package/vue-codemirror6"
        target="_blank">vue-codemirror6</el-link>
    </div>
    <CodeMirror v-model="codeText" basic :dark="true" :lang="lang" :phrases="phrases" :tab-size="2"
      :extensions="extensions" class="code-editor" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import CodeMirror from 'vue-codemirror6';
import { html } from '@codemirror/lang-html';
import type { LanguageSupport } from '@codemirror/language';
import type { Extension } from '@codemirror/state'
import { oneDark } from "@codemirror/theme-one-dark";
import { indentUnit } from "@codemirror/language";
import { keymap } from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";

const codeText = ref<string>('');

/**
 * CodeMirror Language
 *
 * @see {@link https://codemirror.net/6/docs/ref/#language | @codemirror/language}
 */
const lang: LanguageSupport = html();

const extensions: Extension[] = [
  oneDark,
  indentUnit.of("  "),
  keymap.of([...defaultKeymap, indentWithTab])
];


/**
 * Internationalization Config.
 * Must be reactive when used in combination with vue-i18n.
 *
 * @see {@link https://codemirror.net/6/examples/translate/ | Example: Internationalization}
 */
const phrases: Record<string, string> = {
  // @codemirror/view
  'Control character': '控制字符',

  // @codemirror/commands
  'Selection deleted': '已删除选中内容',

  // @codemirror/language
  'Folded lines': '已折叠的行',
  'Unfolded lines': '已展开的行',
  to: '至',
  'folded code': '已折叠的代码',
  unfold: '展开',
  'Fold line': '折叠行',
  'Unfold line': '展开行',

  // @codemirror/search
  'Go to line': '跳转到行',
  go: '前往',
  Find: '查找',
  Replace: '替换',
  next: '▼',
  previous: '▲',
  all: '全部',
  'match case': '区分大小写',
  'by word': '全词匹配',
  regexp: '正则表达式',
  replace: '替换',
  'replace all': '全部替换',
  close: '关闭',
  'current match': '当前匹配',
  'replaced $ matches': '已替换 $ 处匹配',
  'replaced match on line $': '已替换第 $ 行的匹配',
  'on line': '位于第',

  // @codemirror/autocomplete
  Completions: '自动补全',

  // @codemirror/lint
  Diagnostics: '诊断信息',
  'No diagnostics': '无诊断信息',
};
</script>


<style lang="scss" scoped>
.plugins-tips {
  margin-bottom: 15px;
  padding: 20px;
  background-color: #e7ecf3;
  color: #444;
}

:deep(.code-editor .cm-editor) {
  min-height: 500px;
}
</style>
