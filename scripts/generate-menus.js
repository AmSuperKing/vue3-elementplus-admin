#!/usr/bin/env node
/**
 * generateAuthMenus.mjs
 *
 * 从 ../src/router/routes.ts 自动提取路由信息，生成 ../mock/authMenus.json
 *
 * 用法: node generateAuthMenus.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ========== 固定路径（相对于脚本所在目录）==========
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES_FILE = path.resolve(__dirname, '../src/router/routes.ts');
const OUTPUT_FILE = path.resolve(__dirname, '../public/mock/authMenus.json');

// ========== 解析 routes.ts ==========
function parseRoutesFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  let cleaned = content;

  // 移除 import 语句
  cleaned = cleaned.replace(/^import\s+.*$/gm, '');

  // 移除 export default
  cleaned = cleaned.replace(/^export\s+default\s+.*$/gm, '');

  // 移除 webpackChunkName 注释
  cleaned = cleaned.replace(/\/\*\s*webpackChunkName:\s*"[^"]*"\s*\*\//g, '');

  // 将动态 import 替换为占位字符串
  cleaned = cleaned.replace(
    /component:\s*\(\)\s*=>\s*import\s*\(\s*['"`][^'"`]*['"`]\s*\)/g,
    'component: "__DYNAMIC_IMPORT__"'
  );

  // 将 Layout 组件引用替换为字符串
  cleaned = cleaned.replace(/component:\s*Layout/g, 'component: "Layout"');

  // 移除行尾注释和单行注释
  cleaned = cleaned.replace(/\/\/.*$/gm, '');

  // 提取数组部分
  const arrayMatch = cleaned.match(/const\s+routes\s*=\s*(\[[\s\S]*\])/);
  if (!arrayMatch) {
    console.error('❌ 无法从文件中解析出 routes 数组');
    process.exit(1);
  }

  const arrayStr = arrayMatch[1];

  let routes;
  try {
    // eslint-disable-next-line no-new-func
    routes = new Function(`return ${arrayStr}`)();
  } catch (e) {
    console.error('❌ 解析 routes 数组失败:', e.message);
    console.error('尝试解析的内容前200字符:', arrayStr.substring(0, 200));
    process.exit(1);
  }

  return routes;
}

// ========== 转换逻辑 ==========
function transformRoutesToAuthMenus(routes) {
  const menuItems = [];

  for (const route of routes) {
    // 跳过纯重定向路由（没有 name 和 children）
    if (!route.name && !route.children) continue;

    // 跳过登录页
    if (route.name === 'login') continue;

    // 跳过 404 兜底路由
    if (route.name === 'notFound') continue;

    // 只处理有 children 的路由（菜单项）
    if (!route.children || route.children.length === 0) continue;

    // 构建父级菜单
    const menuItem = {
      path: route.path,
      name: route.name,
    };

    if (route.component === 'Layout') {
      menuItem.component = 'Layout';
    }

    if (route.redirect) {
      menuItem.redirect = route.redirect;
    }

    if (route.meta) {
      menuItem.meta = { ...route.meta };
    }

    // hidden 统一设为 false
    menuItem.hidden = false;

    // 构建子菜单
    menuItem.children = route.children
      .filter((child) => child.name !== undefined)
      .map((child) => {
        const childPath = route.path.endsWith('/')
          ? `${route.path}${child.path}`
          : `${route.path}/${child.path}`;

        const childItem = {
          path: childPath,
          name: child.name,
        };

        if (child.meta) {
          childItem.meta = { ...child.meta };
        }

        childItem.hidden = false;

        return childItem;
      });

    menuItems.push(menuItem);
  }

  return menuItems;
}

// ========== 输出 ==========
function generateOutput(menuItems) {
  return JSON.stringify(
    {
      code: 200,
      message: 'success',
      data: menuItems,
    },
    null,
    2
  );
}

// ========== 主流程 ==========
function main() {
  console.log('🔍 读取路由文件:', ROUTES_FILE);

  if (!fs.existsSync(ROUTES_FILE)) {
    console.error(`❌ 文件不存在: ${ROUTES_FILE}`);
    process.exit(1);
  }

  // 确保输出目录存在
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 已创建输出目录: ${outputDir}`);
  }

  // 1. 解析 routes.ts
  const routes = parseRoutesFile(ROUTES_FILE);
  console.log(`✅ 解析到 ${routes.length} 个顶层路由`);

  // 2. 转换为 authMenus 格式
  const menuItems = transformRoutesToAuthMenus(routes);
  console.log(`✅ 生成 ${menuItems.length} 个菜单项`);

  // 3. 输出统计
  for (const item of menuItems) {
    const childCount = item.children ? item.children.length : 0;
    console.log(
      `   📁 ${item.meta?.title || item.name} (${item.path}) - ${childCount} 个子菜单`
    );
  }

  // 4. 写入文件
  const jsonContent = generateOutput(menuItems);
  fs.writeFileSync(OUTPUT_FILE, jsonContent, 'utf-8');
  console.log(`\n🎉 已生成: ${OUTPUT_FILE}`);
}

main();
