import type { App, Directive } from "vue";
import permission from "./permission";
import clickOutside from "./clickOutside"
import move from "./move";

//自定义指令
const directives: Record<string, Directive> = {
  permission, // 权限
  clickOutside, // 点击元素外部
  move, // 拖拽
};

//注册指令
const install = (app: App) => {
  Object.keys(directives).forEach((key) => {
    app.directive(key, directives[key] as Directive);
  });
};

export default {
  install
};
