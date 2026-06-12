// simple-mind-map 及其相关插件的类型声明

declare module 'simple-mind-map' {
  export interface MindMapOptions {
    el: HTMLElement;
    data?: Record<string, unknown>;
    theme?: string;
    layout?: string;
    [key: string]: unknown;
  }

  export interface NodeData {
    id?: string;
    text?: string;
    children?: NodeData[];
    [key: string]: unknown;
  }

  export class SimpleMindMap {
    constructor(options: MindMapOptions);

    setData(data: NodeData): void;
    getData(): NodeData;
    render(): void;
    destroy(): void;

    on(event: string, callback: (...args: unknown[]) => void): void;
    off(event: string, callback: (...args: unknown[]) => void): void;
    emit(event: string, ...args: unknown[]): void;

    execCommand(command: string, ...args: unknown[]): void;

    getThemeList(): Array<{ name: string; config: Record<string, unknown> }>;
    setTheme(themeName: string): void;

    getLayoutList(): Array<{ name: string; value: string }>;
    setLayout(layoutName: string): void;

    export(type: string, options?: Record<string, unknown>): Promise<Blob | string>;

    [key: string]: unknown;
  }

  export default SimpleMindMap;
}

declare module 'simple-mind-map/src/plugins/Drag.js' {
  import { SimpleMindMap } from 'simple-mind-map';

  const Drag: {
    install(mindMap: SimpleMindMap): void;
  };

  export default Drag;
}

declare module 'simple-mind-map/src/plugins/Export.js' {
  import { SimpleMindMap } from 'simple-mind-map';

  const Export: {
    install(mindMap: SimpleMindMap): void;
  };

  export default Export;
}

declare module 'simple-mind-map-plugin-themes' {
  export interface ThemeConfig {
    name: string;
    config: Record<string, unknown>;
  }

  const Themes: ThemeConfig[];

  export default Themes;
}

declare module 'simple-mind-map/src/svg/icons' {
  export interface IconItem {
    name: string;
    icon: string;
  }

  const nodeIconList: IconItem[];

  export default nodeIconList;
}
