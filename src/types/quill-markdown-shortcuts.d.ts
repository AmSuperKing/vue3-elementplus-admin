// src/types/quill-markdown-shortcuts.d.ts

declare module 'quill-markdown-shortcuts' {
  import type { Module, Quill } from 'quill';

  interface MarkdownShortcutsOptions {
    enabled?: boolean;
  }

  class MarkdownShortcuts implements Module {
    constructor(quill: Quill, options?: MarkdownShortcutsOptions);

    static register(): void;

    enable(enabled?: boolean): void;

    disable(): void;

    destroy(): void;
  }

  export default MarkdownShortcuts;
}
