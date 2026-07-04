/**
 * HEX 颜色转 rgba
 * @param {string} hex - HEX 颜色值，如 '#1890ff'、'1890ff'、'#fff'
 * @param {number} alpha - 透明度，范围 0~1，默认 1
 * @returns {string} rgba 字符串，如 'rgba(24, 144, 255, 0.5)'
 */
function hexToRgba(hex: string, alpha: number = 1) {
  // 去除 # 前缀
  hex = hex.replace(/^#/, '');

  // 支持 3 位缩写（如 fff → ffffff）
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  // 支持 4 位缩写（如 fffa → ffffffaa）
  if (hex.length === 4) {
    hex = hex.split('').map(c => c + c).join('');
  }

  // 解析 RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // 如果 HEX 自带透明度（8位），则优先使用
  let a = alpha;
  if (hex.length === 8) {
    a = parseInt(hex.substring(6, 8), 16) / 255;
  }

  return `rgba(${r}, ${g}, ${b}, ${+a.toFixed(3)})`;
}

/**
 * RGBA 颜色转6位 HEX 颜色
 * @param {string} rgba 字符串，如 'rgba(24, 144, 255, 0.5)'
 * @param {string} bgHex 背景色，默认为 #ffffff
 * @returns {string} 6位 HEX 颜色，如 '#1890ff'
 * @throws {Error} 输入无效的 RGBA 颜色值
 */
function rgbaToHex6(rgba: string, bgHex: string = "#ffffff"): string {
  const match = rgba.match(
    /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+))?\s*\)/i
  );

  if (!match || match[1] === undefined || match[2] === undefined || match[3] === undefined) {
    throw new Error(`无效的 RGBA 颜色值: ${rgba}`);
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = match[4] !== undefined ? parseFloat(match[4]) : 1;

  // 解析背景色
  const bgR = parseInt(bgHex.slice(1, 3), 16);
  const bgG = parseInt(bgHex.slice(3, 5), 16);
  const bgB = parseInt(bgHex.slice(5, 7), 16);

  // Alpha 合成：foreground * alpha + background * (1 - alpha)
  const blend = (fg: number, bg: number) =>
    Math.round(fg * a + bg * (1 - a));

  const toHex = (n: number) =>
    Math.min(255, Math.max(0, n)).toString(16).padStart(2, "0");

  return `#${toHex(blend(r, bgR))}${toHex(blend(g, bgG))}${toHex(blend(b, bgB))}`;
}

export { hexToRgba, rgbaToHex6 };
