/**
 * 颜色亮度判断结果
 */
interface ColorBrightnessResult {
  /** 是否为暗色系 */
  dark: boolean;
  /** 是否为亮色系 */
  light: boolean;
}

/**
 * 解析颜色字符串为 RGB 分量 (0-255)
 * 支持格式: #RGB, #RRGGBB, rgb(r,g,b), rgba(r,g,b,a)
 */
function parseColor(color: string): [number, number, number] | null {
  const trimmed = color.trim().toLowerCase();

  // 匹配 Hex 格式: #RGB 或 #RRGGBB
  const hexMatch = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (hexMatch) {
    let hex = hexMatch[1]!;
    if (hex.length === 3) {
      hex = hex[0]! + hex[0]! + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
  }

  // 匹配 rgb() / rgba() 格式
  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*[\d.]+)?\s*\)$/
  );
  if (rgbMatch) {
    const r = Math.min(255, Math.max(0, Math.round(parseFloat(rgbMatch[1]!))));
    const g = Math.min(255, Math.max(0, Math.round(parseFloat(rgbMatch[2]!))));
    const b = Math.min(255, Math.max(0, Math.round(parseFloat(rgbMatch[3]!))));
    return [r, g, b];
  }

  return null;
}

/**
 * 计算 sRGB 通道的线性化值 (W3C WCAG 2.x 标准)
 * @see https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function linearize(channel: number): number {
  const sRGB = channel / 255;
  return sRGB <= 0.03928
    ? sRGB / 12.92
    : Math.pow((sRGB + 0.055) / 1.055, 2.4);
}

/**
 * 计算颜色的相对亮度 (0 ~ 1)
 * 0 = 纯黑, 1 = 纯白
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const rLin = linearize(r);
  const gLin = linearize(g);
  const bLin = linearize(b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * 判断颜色是暗色系还是亮色系
 *
 * @param color - 颜色值，支持 hex (#RGB/#RRGGBB)、rgb()、rgba() 格式
 * @param threshold - 亮度阈值，默认 0.179 (W3C 推荐用于对比度判断的中间值)
 * @returns { dark: boolean, light: boolean }
 *
 * @example
 * judgeColorBrightness('#000000')  // { dark: true, light: false }
 * judgeColorBrightness('#FFFFFF')  // { dark: false, light: true }
 * judgeColorBrightness('rgb(128, 128, 128)') // { dark: true, light: false }
 * judgeColorBrightness('rgba(255, 200, 50, 0.8)') // { dark: false, light: true }
 */
function judgeColorBrightness(
  color: string,
  threshold: number = 0.179
): ColorBrightnessResult {
  const rgb = parseColor(color);

  if (!rgb) {
    console.warn(`[judgeColorBrightness] 无法解析颜色: "${color}"，默认返回亮色`);
    return { dark: false, light: true };
  }

  const luminance = getRelativeLuminance(rgb[0], rgb[1], rgb[2]);
  const isLight = luminance > threshold;

  return {
    dark: !isLight,
    light: isLight,
  };
}

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

export {
  type ColorBrightnessResult,
  judgeColorBrightness,
  hexToRgba,
  rgbaToHex6
};
