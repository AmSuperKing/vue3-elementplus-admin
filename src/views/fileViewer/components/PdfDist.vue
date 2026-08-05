<!-- PdfViewer.vue -->
<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick, shallowRef  } from "vue";
import type { CSSProperties, ComponentPublicInstance } from "vue";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

type ComponentRef = Element | ComponentPublicInstance | null;

/* ================================================================
   1. Worker 配置
   ================================================================ */
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).href;

type Toolbar = "sidebar" | "zoom" | "zoomOut" | "zoomIn" | "scaleSelect" | "rotation" | "reset" | "pager" | "export";
interface ToolbarConfig {
  sidebar?: boolean;
  zoom?: boolean;
  zoomOut?: boolean;
  zoomIn?: boolean;
  scaleSelect?: boolean;
  rotation?: boolean;
  reset?: boolean;
  pager?: boolean;
  export?: boolean;
}

/* ================================================================
   2. Props & Emits
   ================================================================ */
const props = withDefaults(
  defineProps<{
    url?: string;
    fileData?: ArrayBuffer | Uint8Array;
    width?: number | string;
    height?: number | string;
    /** 主题模式：dark 暗色 / light 亮色 / system 跟随系统 */
    theme?: "dark" | "light" | "system";
    showToolbar?: boolean;
    toolbarConfig?: ToolbarConfig | Toolbar[];
    loadingTip?: string;
    emptyTip?: string;
    pageNumFormatter?: (pageNum: number) => string;
  }>(),
  { url: "", theme: "system", showToolbar: true, loadingTip: "加载中...", emptyTip: "暂无 PDF 文件" }
);

const emit = defineEmits<{
  (e: "loaded", totalPages: number): void;
  (e: "page-change", page: number): void;
  (e: "error", err: Error): void;
}>();

/* ================================================================
   3. 类型 & 常量
   ================================================================ */
const SCALE_MIN = 0.25;
const SCALE_MAX = 5.0;
const SCALE_STEP = 0.25;
const SCALE_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0, 4.0];
const THUMBNAIL_SCALE = 0.2;

/* ================================================================
   4. 响应式状态
   ================================================================ */
const pdfDoc = shallowRef<PDFDocumentProxy | null>(null);
const totalPages = ref(0);
const currentPage = ref(1);
const scale = ref(1.0);
const rotation = ref(0);
const loading = ref(false);
const showSidebar = ref(false);

const renderTasks = ref<Map<number, RenderTask>>(new Map());
const thumbRenderTasks = ref<Map<number, RenderTask>>(new Map());

const isDragging = ref(false);
const hasMoved = ref(false);
const dragStartPos = reactive({ x: 0, y: 0 });
const scrollStartPos = reactive({ x: 0, y: 0 });

const containerRef = ref<HTMLElement | null>(null);
const sidebarContentRef = ref<HTMLElement | null>(null);
const canvasRefs = ref<Map<number, HTMLCanvasElement>>(new Map());
const thumbCanvasRefs = ref<Map<number, HTMLCanvasElement>>(new Map());

const pageInput = ref("1");

let renderDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let wheelPageTimer: ReturnType<typeof setTimeout> | null = null;
let wheelZoomTimer: ReturnType<typeof setTimeout> | null = null;
let scrollRafId: number | null = null;

/* ================================================================
   4.1 主题系统
   ================================================================ */
const systemDark = ref(false);
let mediaQuery: MediaQueryList | null = null;

/** 最终解析出的主题（dark | light） */
const resolvedTheme = computed<"dark" | "light">(() => {
  if (props.theme === "system") return systemDark.value ? "dark" : "light";
  return props.theme;
});

function onSystemThemeChange(e: MediaQueryListEvent) {
  systemDark.value = e.matches;
}

/* ================================================================
   5. 计算属性
   ================================================================ */
const pdfViewerSize = computed(() => {
  const style: CSSProperties = {};
  if (props.width) {
    if (typeof props.width === "number") {
      style.width = `${props.width}px`;
    } else {
      style.width = props.width;
    }
  }
  if (props.height) {
    if (typeof props.height === "number") {
      style.height = `${props.height}px`;
    } else {
      style.height = props.height;
    }
  }
  return style;
});
const scalePercent = computed(() => Math.round(scale.value * 100));
const canZoomIn = computed(() => scale.value < SCALE_MAX);
const canZoomOut = computed(() => scale.value > SCALE_MIN);
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1));
const toolbarItems = computed(() => {
  if (Array.isArray(props.toolbarConfig)) {
    return {
      sidebar: props.toolbarConfig?.includes("sidebar") ?? true,
      zoom: props.toolbarConfig?.includes("zoom") ?? true,
      zoomOut: props.toolbarConfig?.includes("zoomOut") ?? true,
      zoomIn: props.toolbarConfig?.includes("zoomIn") ?? true,
      scaleSelect: props.toolbarConfig?.includes("scaleSelect") ?? true,
      rotation: props.toolbarConfig?.includes("rotation") ?? true,
      reset: props.toolbarConfig?.includes("reset") ?? true,
      pager: props.toolbarConfig?.includes("pager") ?? true,
      export: props.toolbarConfig?.includes("export") ?? true
    };
  } else {
    return {
      sidebar: props.toolbarConfig?.sidebar ?? true,
      zoom: props.toolbarConfig?.zoom ?? true,
      zoomOut: props.toolbarConfig?.zoomOut ?? true,
      zoomIn: props.toolbarConfig?.zoomIn ?? true,
      scaleSelect: props.toolbarConfig?.scaleSelect ?? true,
      rotation: props.toolbarConfig?.rotation ?? true,
      reset: props.toolbarConfig?.reset ?? true,
      pager: props.toolbarConfig?.pager ?? true,
      export: props.toolbarConfig?.export ?? true
    };
  }
});

/* ================================================================
   6. 加载 PDF
   ================================================================ */
async function loadPdf() {
  loading.value = true;
  try {
    cancelAllRenders();
    cancelAllThumbRenders();
    if (pdfDoc.value) {
      await pdfDoc.value.loadingTask.destroy().catch(() => {});
      pdfDoc.value = null;
    }

    let task: pdfjsLib.PDFDocumentLoadingTask;
    if (props.fileData) {
      task = pdfjsLib.getDocument({ data: props.fileData });
    } else if (props.url) {
      task = pdfjsLib.getDocument({
        url: props.url,
        cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@4/cmaps/",
        cMapPacked: true
      });
    } else {
      throw new Error("请提供 url 或 fileData");
    }

    pdfDoc.value = await task.promise;
    totalPages.value = pdfDoc.value.numPages;
    currentPage.value = 1;
    pageInput.value = "1";
    emit("loaded", totalPages.value);

    await nextTick();
    await renderAllPages();
    if (showSidebar.value) {
      await nextTick();
      await renderAllThumbnails();
    }
  } catch (err: unknown) {
    console.error("PDF 加载失败:", err);
    emit("error", err instanceof Error ? err : new Error(String(err)));
  } finally {
    loading.value = false;
  }
}

/* ================================================================
   7. 主页面渲染（含 cancel + 防抖）
   ================================================================ */
function cancelAllRenders() {
  renderTasks.value.forEach((t) => {
    try {
      t.cancel();
    } catch {}
  });
  renderTasks.value.clear();
}
function cancelPageRender(n: number) {
  const t = renderTasks.value.get(n);
  if (t) {
    try {
      t.cancel();
    } catch {}
    renderTasks.value.delete(n);
  }
}

async function renderPage(pageNum: number) {
  if (!pdfDoc.value) return;
  const canvas = canvasRefs.value.get(pageNum);
  if (!canvas) return;
  cancelPageRender(pageNum);

  try {
    const page = await pdfDoc.value.getPage(pageNum);
    const vp = page.getViewport({ scale: scale.value, rotation: rotation.value });
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = vp.width * dpr;
    canvas.height = vp.height * dpr;
    canvas.style.width = `${vp.width}px`;
    canvas.style.height = `${vp.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rt = page.render({ canvas, canvasContext: ctx, viewport: vp });
    renderTasks.value.set(pageNum, rt);

    try {
      await rt.promise;
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "RenderingCancelledException") return;
      throw e;
    }
    renderTasks.value.delete(pageNum);
  } catch (e: unknown) {
    if (e instanceof Error && e.name === "RenderingCancelledException") return;
    console.error(`第 ${pageNum} 页渲染失败:`, e);
  }
}

function renderAllPages(): Promise<void> {
  return new Promise((resolve) => {
    if (renderDebounceTimer) clearTimeout(renderDebounceTimer);
    renderDebounceTimer = setTimeout(async () => {
      renderDebounceTimer = null;
      if (!pdfDoc.value) {
        resolve();
        return;
      }
      const jobs: Promise<void>[] = [];
      for (let i = 1; i <= totalPages.value; i++) jobs.push(renderPage(i));
      await Promise.all(jobs);
      resolve();
    }, 150);
  });
}

/* ================================================================
   8. 缩略图渲染
   ================================================================ */
function cancelAllThumbRenders() {
  thumbRenderTasks.value.forEach((t) => {
    try {
      t.cancel();
    } catch {}
  });
  thumbRenderTasks.value.clear();
}
function cancelThumbRender(n: number) {
  const t = thumbRenderTasks.value.get(n);
  if (t) {
    try {
      t.cancel();
    } catch {}
    thumbRenderTasks.value.delete(n);
  }
}

async function renderThumbnail(pageNum: number) {
  if (!pdfDoc.value) return;
  const canvas = thumbCanvasRefs.value.get(pageNum);
  if (!canvas) return;
  cancelThumbRender(pageNum);

  try {
    const page = await pdfDoc.value.getPage(pageNum);
    const vp = page.getViewport({ scale: THUMBNAIL_SCALE, rotation: rotation.value });
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = vp.width * dpr;
    canvas.height = vp.height * dpr;
    canvas.style.width = `${vp.width}px`;
    canvas.style.height = `${vp.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rt = page.render({ canvas, canvasContext: ctx, viewport: vp });
    thumbRenderTasks.value.set(pageNum, rt);
    try {
      await rt.promise;
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "RenderingCancelledException") return;
      throw e;
    }
    thumbRenderTasks.value.delete(pageNum);
  } catch (e: unknown) {
    if (e instanceof Error && e.name === "RenderingCancelledException") return;
  }
}

async function renderAllThumbnails() {
  if (!pdfDoc.value) return;
  for (let i = 1; i <= totalPages.value; i++) {
    if (!showSidebar.value) break;
    await renderThumbnail(i);
  }
}

/* ================================================================
   9. 缩放
   ================================================================ */
function zoomIn() {
  setScale(Math.min(Math.round((scale.value + SCALE_STEP) * 100) / 100, SCALE_MAX));
}
function zoomOut() {
  setScale(Math.max(Math.round((scale.value - SCALE_STEP) * 100) / 100, SCALE_MIN));
}

function setScale(newScale: number) {
  if (newScale === scale.value) return;
  const c = containerRef.value;
  if (c) {
    const rx = (c.scrollLeft + c.clientWidth / 2) / (c.scrollWidth || 1);
    const ry = (c.scrollTop + c.clientHeight / 2) / (c.scrollHeight || 1);
    scale.value = newScale;
    nextTick(() => {
      renderAllPages().then(() => {
        nextTick(() => {
          c.scrollLeft = rx * c.scrollWidth - c.clientWidth / 2;
          c.scrollTop = ry * c.scrollHeight - c.clientHeight / 2;
        });
      });
    });
  } else {
    scale.value = newScale;
    nextTick(() => renderAllPages());
  }
}

function onSelectScale(v: number) {
  setScale(v);
}

/* ================================================================
   10. 滚轮处理
   ================================================================ */
function handleWheel(e: WheelEvent) {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
    const ns = Math.min(Math.max(Math.round((scale.value + delta) * 100) / 100, SCALE_MIN), SCALE_MAX);
    if (wheelZoomTimer) clearTimeout(wheelZoomTimer);
    wheelZoomTimer = setTimeout(() => setScale(ns), 80);
    return;
  }

  const c = containerRef.value;
  if (!c) return;
  const overflowsVertically = c.scrollHeight > c.clientHeight + 2;

  if (!overflowsVertically && Math.abs(e.deltaY) > 0) {
    e.preventDefault();
    if (!wheelPageTimer) {
      wheelPageTimer = setTimeout(() => {
        wheelPageTimer = null;
      }, 400);
      if (e.deltaY > 0) nextPage();
      else prevPage();
    }
  }
}

/* ================================================================
   11. 鼠标拖动
   ================================================================ */
function handleMouseDown(e: MouseEvent) {
  if (e.button !== 0) return;
  const t = e.target as HTMLElement;
  if (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "BUTTON" || t.closest("button") || t.closest("select")) return;

  isDragging.value = true;
  hasMoved.value = false;
  dragStartPos.x = e.clientX;
  dragStartPos.y = e.clientY;
  if (containerRef.value) {
    scrollStartPos.x = containerRef.value.scrollLeft;
    scrollStartPos.y = containerRef.value.scrollTop;
  }
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) return;
  const dx = e.clientX - dragStartPos.x;
  const dy = e.clientY - dragStartPos.y;
  if (!hasMoved.value && Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
  hasMoved.value = true;
  const c = containerRef.value;
  if (!c) return;
  c.scrollLeft = scrollStartPos.x - dx;
  c.scrollTop = scrollStartPos.y - dy;
}

function onMouseUp() {
  isDragging.value = false;
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
}

/* ================================================================
   12. 页码导航
   ================================================================ */
function goToPage(page: number) {
  const target = Math.max(1, Math.min(page, totalPages.value));
  currentPage.value = target;
  pageInput.value = String(target);
  emit("page-change", target);

  const canvas = canvasRefs.value.get(target);
  if (canvas && containerRef.value) {
    const cr = containerRef.value.getBoundingClientRect();
    const cvr = canvas.getBoundingClientRect();
    containerRef.value.scrollTo({
      top: cvr.top - cr.top + containerRef.value.scrollTop - 16,
      behavior: "smooth"
    });
  }
  scrollToThumb(target);
}

function prevPage() {
  if (currentPage.value > 1) goToPage(currentPage.value - 1);
}
function nextPage() {
  if (currentPage.value < totalPages.value) goToPage(currentPage.value + 1);
}

function handlePageInput() {
  const n = parseInt(pageInput.value, 10);
  if (!isNaN(n)) goToPage(n);
}

function handleScroll() {
  if (scrollRafId) return;
  scrollRafId = requestAnimationFrame(() => {
    scrollRafId = null;
    const c = containerRef.value;
    if (!c) return;
    const cy = c.getBoundingClientRect().top + c.clientHeight / 2;
    let best = currentPage.value,
      bestD = Infinity;
    canvasRefs.value.forEach((cv, pn) => {
      const r = cv.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - cy);
      if (d < bestD) {
        bestD = d;
        best = pn;
      }
    });
    if (best !== currentPage.value) {
      currentPage.value = best;
      pageInput.value = String(best);
      emit("page-change", best);
      scrollToThumb(best);
    }
  });
}

/* ================================================================
   13. 侧边栏
   ================================================================ */
function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
  if (showSidebar.value) {
    nextTick(() => {
      renderAllThumbnails();
      scrollToThumb(currentPage.value);
    });
  } else {
    cancelAllThumbRenders();
  }
}

function scrollToThumb(pn: number) {
  if (!showSidebar.value) return;
  nextTick(() => {
    const el = sidebarContentRef.value?.querySelector(`[data-thumb="${pn}"]`) as HTMLElement;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

/* ================================================================
   14. 旋转
   ================================================================ */
interface RotationParams {
  left?: boolean;
  right?: boolean;
  reset?: boolean;
}

/**
 * 设置旋转角度，支持向左旋转、向右旋转和重置。
 * 旋转操作完成后，会在下一个 DOM 更新周期后重新渲染所有页面和缩略图（如果侧边栏处于打开状态）。
 *
 * @param params - 旋转配置参数，默认为空对象。
 * @param params.left - 是否向左旋转 90 度。
 * @param params.right - 是否向右旋转 90 度。
 * @param params.reset - 是否重置旋转角度为 0 度。
 *
 * @example
 * // 向左旋转
 * setRotation({ left: true });
 *
 * @example
 * // 重置旋转
 * setRotation({ reset: true });
 */
function setRotation(params: RotationParams = {}) {
  const { left = false, right = false, reset = false } = params;
  const key = left ? "left" : right ? "right" : reset ? "reset" : "";
  switch (key) {
    case "left":
      rotation.value = (rotation.value - 90 + 360) % 360;
      break;
    case "right":
      rotation.value = (rotation.value + 90) % 360;
      break;
    case "reset":
      rotation.value = 0;
      break;
  }
  if (left || right || reset) {
    nextTick(() => {
      renderAllPages();
      if (showSidebar.value) renderAllThumbnails();
    });
  }
}

function resetView() {
  setScale(1.0);
  setRotation({ reset: true });
}

/* ================================================================
   15. 下载
   ================================================================ */
async function downloadPdf() {
  try {
    let blob: Blob;
    if (props.fileData) blob = new Blob([props.fileData as BlobPart], { type: "application/pdf" });
    else if (props.url) {
      const r = await fetch(props.url);
      blob = await r.blob();
    } else return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = extractFileName(props.url) || "document.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  } catch (e) {
    console.error("下载失败:", e);
  }
}

function extractFileName(u: string) {
  if (!u) return "";
  const m = u.match(/\/([^/?#]+\.pdf)/i);
  return m ? m[1] : "document.pdf";
}

/* ================================================================
   16. Canvas ref 管理
   ================================================================ */
function setCanvasRef(el: ComponentRef, pn: number) {
  if (el) {
    canvasRefs.value.set(pn, el as HTMLCanvasElement);
  } else {
    canvasRefs.value.delete(pn);
  }
}
function setThumbCanvasRef(el: ComponentRef, pn: number) {
  if (el) {
    thumbCanvasRefs.value.set(pn, el as HTMLCanvasElement);
  } else {
    thumbCanvasRefs.value.delete(pn);
  }
}

/* ================================================================
   17. 生命周期
   ================================================================ */
onMounted(async () => {
  // ── 主题：初始化系统偏好监听 ──
  mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  systemDark.value = mediaQuery.matches;
  mediaQuery.addEventListener("change", onSystemThemeChange);

  await nextTick();
  containerRef.value?.addEventListener("wheel", handleWheel as EventListener, { passive: false });
  loadPdf();
});

watch(
  () => [props.url, props.fileData],
  () => loadPdf()
);

onBeforeUnmount(async () => {
  // ── 主题：移除系统偏好监听 ──
  mediaQuery?.removeEventListener("change", onSystemThemeChange);

  cancelAllRenders();
  cancelAllThumbRenders();
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
  containerRef.value?.removeEventListener("wheel", handleWheel as EventListener);
  if (renderDebounceTimer) clearTimeout(renderDebounceTimer);
  if (wheelPageTimer) clearTimeout(wheelPageTimer);
  if (wheelZoomTimer) clearTimeout(wheelZoomTimer);
  if (scrollRafId) cancelAnimationFrame(scrollRafId);
  if (pdfDoc.value) await pdfDoc.value.loadingTask.destroy().catch(() => {});
});
</script>

<template>
  <!-- ★ 动态绑定 theme-dark / theme-light 类名 -->
  <div class="pdf-viewer" :class="`theme-${resolvedTheme}`" :style="pdfViewerSize">
    <!-- ==================== 工具栏 ==================== -->
    <slot
      name="toolbar"
      :toggleSidebar="toggleSidebar"
      :zoomOut="zoomOut"
      :zoomIn="zoomIn"
      :setScale="setScale"
      :scalePercent="scalePercent"
      :setRotation="setRotation"
      :resetView="resetView"
      :prevPage="prevPage"
      :nextPage="nextPage"
      :goToPage="goToPage"
      :downloadPdf="downloadPdf"
    >
      <div v-if="props.showToolbar" class="pdf-toolbar">
        <div class="toolbar-group">
          <button v-if="toolbarItems.sidebar" class="toolbar-btn" :class="{ 'is-active': showSidebar }" title="缩略图面板" @click="toggleSidebar">
            <!-- <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-12v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
            </svg> -->
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path
                d="M19.92 23H4.1A3.1 3.1 0 0 1 1 19.88V4.12A3.1 3.1 0 0 1 4.1 1H19.92A3.1 3.1 0 0 1 23 4.12v15.76A3.1 3.1 0 0 1 19.92 23zM4.1 3.2A0.91 0.91 0 0 0 3.18 4.12v15.76c0 0.51 0.4 0.92 0.92 0.92H19.92a0.91 0.91 0 0 0 0.92-0.92V4.12C20.84 3.61 20.44 3.2 19.92 3.2H4.1z"
                fill="currentColor"
              ></path>
              <path d="M8.77 22.45a1.08 1.08 0 0 1-1.1-1.1V2.61a1.08 1.08 0 0 1 1.1-1.1c0.62 0 1.1 0.48 1.1 1.1v18.74a1.08 1.08 0 0 1-1.1 1.1z" fill="currentColor"></path>
            </svg>
          </button>

          <div v-if="toolbarItems.sidebar" class="toolbar-divider"></div>

          <button v-if="toolbarItems.zoomOut || toolbarItems.zoom" class="toolbar-btn" :disabled="!canZoomOut" title="缩小" @click="zoomOut">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 13H5v-2h14v2z" /></svg>
          </button>

          <select v-if="toolbarItems.scaleSelect" class="scale-select" :value="scale" @change="onSelectScale(Number(($event.target as HTMLSelectElement).value))">
            <option v-for="o in SCALE_OPTIONS" :key="o" :value="o">{{ Math.round(o * 100) }}%</option>
            <option v-if="!SCALE_OPTIONS.includes(scale)" :value="scale" selected>{{ scalePercent }}%</option>
          </select>

          <button v-if="toolbarItems.zoomIn || toolbarItems.zoom" class="toolbar-btn" :disabled="!canZoomIn" title="放大" @click="zoomIn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
          </button>

          <!-- <span v-if="toolbarItems.zoomOut || toolbarItems.zoomIn || toolbarItems.zoom" class="toolbar-text">{{ scalePercent }}%</span> -->

          <div v-if="toolbarItems.scaleSelect || toolbarItems.zoomOut || toolbarItems.zoomIn || toolbarItems.zoom" class="toolbar-divider"></div>

          <button v-if="toolbarItems.rotation" class="toolbar-btn" title="逆时针旋转" @click="setRotation({ left: true })">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path
                d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"
              />
            </svg>
          </button>

          <button v-if="toolbarItems.rotation" class="toolbar-btn" title="顺时针旋转" @click="setRotation({ right: true })">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path
                d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"
              />
            </svg>
          </button>

          <div v-if="toolbarItems.rotation" class="toolbar-divider"></div>

          <button v-if="toolbarItems.reset" class="toolbar-btn" title="重置" @click="resetView">重置</button>
        </div>

        <div v-if="toolbarItems.pager" class="toolbar-group flex-jusify-center">
          <button class="toolbar-btn" :disabled="currentPage <= 1" title="上一页" @click="prevPage">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
          </button>
          <span class="page-info">
            <input v-model="pageInput" class="page-input" type="text" @keydown.enter="handlePageInput" @blur="handlePageInput" />
            <span class="page-separator">/</span>
            <span class="page-total">{{ totalPages }}</span>
          </span>
          <button class="toolbar-btn" :disabled="currentPage >= totalPages" title="下一页" @click="nextPage">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
          </button>
        </div>

        <div v-if="toolbarItems.export" class="toolbar-group flex-jusify-end">
          <button class="toolbar-btn download-btn" title="导出/下载" @click="downloadPdf">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg>
            <span class="btn-label">下载</span>
          </button>
        </div>
      </div>
    </slot>

    <!-- ==================== 主体 ==================== -->
    <div class="pdf-body">
      <transition name="sidebar">
        <aside v-if="showSidebar" class="pdf-sidebar">
          <div ref="sidebarContentRef" class="sidebar-scroll">
            <div v-for="pn in pageNumbers" :key="pn" :data-thumb="pn" class="thumb-item" :class="{ 'is-active': pn === currentPage }" @click="goToPage(pn)">
              <div class="thumb-canvas-box">
                <canvas :ref="(el) => setThumbCanvasRef(el, pn)"></canvas>
              </div>
              <span class="thumb-label">{{ pn }}</span>
            </div>
          </div>
        </aside>
      </transition>

      <div ref="containerRef" class="pdf-container" :class="{ 'is-dragging': isDragging }" @mousedown="handleMouseDown" @scroll="handleScroll">
        <slot name="loading" :loading="loading">
          <div v-if="loading" class="pdf-loading">
            <div class="loading-spinner"></div>
            <span>{{ props.loadingTip }}</span>
          </div>
        </slot>

        <div class="pdf-pages">
          <div v-for="pn in pageNumbers" :key="pn" class="pdf-page-wrapper" :class="{ 'is-current': pn === currentPage }">
            <canvas :ref="(el) => setCanvasRef(el, pn)"></canvas>

            <div class="page-number-label">
              <slot name="page-num" :pageNum="pn">
                {{ props.pageNumFormatter?.(pn) ?? pn }}
              </slot>
            </div>
          </div>
        </div>

        <slot name="empty" :loading="loading" :totalPages="totalPages">
          <div v-if="!loading && totalPages === 0" class="pdf-empty">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" class="empty-icon">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
            </svg>
            <p>{{ props.emptyTip }}</p>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ================================================================
   根容器 & 主题变量
   ================================================================ */
.pdf-viewer {
  /* ── 公共变量（不随主题变化） ── */
  --toolbar-h: 48px;
  --sidebar-w: 200px;
  --accent: #4a9eff;

  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* ── 过渡动画（主题切换时平滑过渡） ── */
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;
}

/* ── 暗色主题变量 ── */
.pdf-viewer.theme-dark {
  --viewer-bg: #525659;
  --viewer-border: #444;
  --toolbar-bg: #323639;
  --toolbar-fg: #f0f0f0;
  --btn-hover: rgba(255, 255, 255, 0.12);
  --btn-active: rgba(255, 255, 255, 0.2);
  --btn-disabled: rgba(255, 255, 255, 0.3);
  --input-bg: rgba(255, 255, 255, 0.08);
  --input-border: rgba(255, 255, 255, 0.2);
  --input-border-focus: rgba(255, 255, 255, 0.4);
  --select-option-bg: #3a3d41;
  --divider-color: rgba(255, 255, 255, 0.2);
  --text-muted: #999;
  --text-light: #ccc;
  --text-secondary: #aaa;
  --sidebar-bg: #3a3d41;
  --sidebar-border: rgba(255, 255, 255, 0.1);
  --thumb-hover-bg: rgba(255, 255, 255, 0.06);
  --thumb-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  --page-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  --scrollbar-track: #404346;
  --scrollbar-thumb: #6b6e71;
  --scrollbar-thumb-hover: #888;
  --sidebar-scrollbar-thumb: #6b6e71;
  --spinner-track: rgba(255, 255, 255, 0.15);
  --empty-icon-color: #bbb;

  background: var(--viewer-bg);
  border: 1px solid var(--viewer-border);
  color: var(--toolbar-fg);
}

/* ── 亮色主题变量 ── */
.pdf-viewer.theme-light {
  --viewer-bg: #e8eaed;
  --viewer-border: #d0d0d0;
  --toolbar-bg: #ffffff;
  --toolbar-fg: #333333;
  --btn-hover: rgba(0, 0, 0, 0.06);
  --btn-active: rgba(0, 0, 0, 0.12);
  --btn-disabled: rgba(0, 0, 0, 0.25);
  --input-bg: rgba(0, 0, 0, 0.04);
  --input-border: rgba(0, 0, 0, 0.15);
  --input-border-focus: rgba(0, 0, 0, 0.3);
  --select-option-bg: #ffffff;
  --divider-color: rgba(0, 0, 0, 0.12);
  --text-muted: #888;
  --text-light: #666;
  --text-secondary: #777;
  --sidebar-bg: #f0f2f5;
  --sidebar-border: rgba(0, 0, 0, 0.08);
  --thumb-hover-bg: rgba(0, 0, 0, 0.04);
  --thumb-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  --page-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  --scrollbar-track: #e0e0e0;
  --scrollbar-thumb: #b0b0b0;
  --scrollbar-thumb-hover: #999;
  --sidebar-scrollbar-thumb: #c0c0c0;
  --spinner-track: rgba(0, 0, 0, 0.1);
  --empty-icon-color: #ccc;

  background: var(--viewer-bg);
  border: 1px solid var(--viewer-border);
  color: var(--toolbar-fg);
}

/* ================================================================
   工具栏
   ================================================================ */
.pdf-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  /* height: var(--toolbar-h); */
  min-height: var(--toolbar-h);
  padding: 0 12px;
  background: var(--toolbar-bg);
  color: var(--toolbar-fg);
  user-select: none;
  flex-shrink: 0;
  gap: 8px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.toolbar-group {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--toolbar-fg);
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  font-size: 13px;
}
.toolbar-btn:hover:not(:disabled) {
  background: var(--btn-hover);
}
.toolbar-btn:active:not(:disabled) {
  background: var(--btn-active);
}
.toolbar-btn:disabled {
  color: var(--btn-disabled);
  cursor: not-allowed;
}

.toolbar-btn.is-active {
  background: rgba(74, 158, 255, 0.2);
  color: var(--accent);
}

.toolbar-text {
  font-size: 13px;
  min-width: 36px;
  text-align: center;
  color: var(--text-light);
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: var(--divider-color);
  margin: 0 4px;
}

.scale-select {
  height: 28px;
  padding: 0 4px;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--toolbar-fg);
  font-size: 13px;
  cursor: pointer;
  outline: none;
  transition:
    border-color 0.15s,
    background 0.3s ease,
    color 0.3s ease;
}
.scale-select:focus {
  border-color: var(--input-border-focus);
}
.scale-select option {
  background: var(--select-option-bg);
  color: var(--toolbar-fg);
}

.page-info {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 13px;
}

.page-input {
  width: 50px;
  height: 26px;
  text-align: center;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--toolbar-fg);
  font-size: 13px;
  outline: none;
  transition:
    border-color 0.15s,
    background 0.3s ease,
    color 0.3s ease;
}
.page-input:focus {
  border-color: var(--accent);
}

.page-separator {
  margin: 0 2px;
  color: var(--text-muted);
}
.page-total {
  color: var(--text-light);
}

.download-btn .btn-label {
  font-size: 13px;
}

/* ================================================================
   主体布局
   ================================================================ */
.pdf-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* ================================================================
   侧边栏
   ================================================================ */
.pdf-sidebar {
  width: var(--sidebar-w);
  min-width: var(--sidebar-w);
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  flex-shrink: 0;
  overflow: hidden;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.sidebar-scroll {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.sidebar-scroll::-webkit-scrollbar {
  width: 4px;
}
.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-scroll::-webkit-scrollbar-thumb {
  background: var(--sidebar-scrollbar-thumb);
  border-radius: 2px;
}
@-moz-document url-prefix() {
  .sidebar-scroll {
    scrollbar-width: thin;
    scrollbar-color: var(--sidebar-scrollbar-thumb) transparent;
  }
}

.thumb-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  border: 2px solid transparent;
  transition:
    border-color 0.15s,
    background 0.15s;
}
.thumb-item:hover {
  background: var(--thumb-hover-bg);
}
.thumb-item.is-active {
  border-color: var(--accent);
  background: rgba(74, 158, 255, 0.1);
}

.thumb-canvas-box {
  background: #fff;
  box-shadow: var(--thumb-shadow);
  border-radius: 2px;
  line-height: 0;
  overflow: hidden;
}
.thumb-canvas-box canvas {
  display: block;
}

.thumb-label {
  font-size: 11px;
  color: var(--text-muted);
  user-select: none;
}
.thumb-item.is-active .thumb-label {
  color: var(--accent);
  font-weight: 600;
}

/* 侧边栏过渡动画 */
.sidebar-enter-active {
  transition:
    width 0.25s ease,
    min-width 0.25s ease,
    opacity 0.2s ease;
}
.sidebar-leave-active {
  transition:
    width 0.2s ease,
    min-width 0.2s ease,
    opacity 0.15s ease;
}
.sidebar-enter-from,
.sidebar-leave-to {
  width: 0 !important;
  min-width: 0 !important;
  opacity: 0;
  border-right: none;
}

/* ================================================================
   PDF 内容区域
   ================================================================ */
.pdf-container {
  min-height: 120px;
  flex: 1;
  overflow: auto;
  position: relative;
  cursor: grab;
  transition: background-color 0.3s ease;
}
.pdf-container.is-dragging {
  cursor: grabbing;
}

.pdf-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.pdf-container::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}
.pdf-container::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
}
.pdf-container::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}

.pdf-pages {
  display: flex;
  flex-direction: column;
  width: max-content;
  min-width: 100%;
  padding: 16px;
  gap: 14px;
  min-height: 100%;
  box-sizing: border-box;
}

.pdf-page-wrapper {
  position: relative;
  box-shadow: var(--page-shadow);
  background: #fff;
  border-radius: 2px;
  transition: box-shadow 0.2s;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}
.pdf-page-wrapper.is-current {
  box-shadow:
    0 0 0 2px var(--accent),
    var(--page-shadow);
}
.pdf-page-wrapper canvas {
  display: block;
}

.page-number-label {
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: var(--text-secondary);
  user-select: none;
  z-index: 1;
  line-height: 1;
}

/* Loading */
.pdf-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-light);
  font-size: 14px;
  z-index: 10;
}
.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--spinner-track);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 空状态 */
.pdf-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
  font-size: 14px;
}
.pdf-empty .empty-icon {
  color: var(--empty-icon-color);
}

.flex-jusify-center {
  justify-content: center;
}
.flex-jusify-end {
  justify-content: flex-end;
}
</style>
