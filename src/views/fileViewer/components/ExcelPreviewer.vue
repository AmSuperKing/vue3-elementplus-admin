<template>
  <div class="excel-preview-wrapper">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <span>{{ loadingText }}</span>
    </div>
    <!-- 错误状态 -->
    <div v-if="errorMsg" class="error-overlay">
      <span>{{ errorMsg }}</span>
    </div>
    <!-- 渲染容器 -->
    <div ref="containerRef" class="spreadsheet-container"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import Spreadsheet from 'x-data-spreadsheet';
import ExcelJS from 'exceljs';
import 'x-data-spreadsheet/dist/xspreadsheet.css';

const zhCN = {
  toolbar: {
    undo: '撤销',
    redo: '恢复',
    print: '打印',
    paintformat: '格式刷',
    clearformat: '清除格式',
    format: '数据格式',
    fontName: '字体',
    fontSize: '字号',
    fontBold: '加粗',
    fontItalic: '倾斜',
    underline: '下划线',
    strike: '删除线',
    color: '字体颜色',
    bgcolor: '填充颜色',
    border: '边框',
    merge: '合并单元格',
    align: '水平对齐',
    valign: '垂直对齐',
    textwrap: '自动换行',
    freeze: '冻结',
    autofilter: '自动筛选',
    formula: '函数',
    more: '更多',
  },
  contextmenu: {
    copy: '复制',
    cut: '剪切',
    paste: '粘贴',
    pasteValue: '粘贴数据',
    pasteFormat: '粘贴格式',
    hide: '隐藏',
    insertRow: '插入行',
    insertColumn: '插入列',
    deleteSheet: '删除',
    deleteRow: '删除行',
    deleteColumn: '删除列',
    deleteCell: '删除',
    deleteCellText: '删除数据',
    validation: '数据验证',
    cellprintable: '可打印',
    cellnonprintable: '不可打印',
    celleditable: '可编辑',
    cellnoneditable: '不可编辑',
  },
  print: {
    size: '纸张大小',
    orientation: '方向',
    orientations: ['横向', '纵向'],
  },
  format: {
    normal: '正常',
    text: '文本',
    number: '数值',
    percent: '百分比',
    rmb: '人民币',
    usd: '美元',
    eur: '欧元',
    date: '短日期',
    time: '时间',
    datetime: '长日期',
    duration: '持续时间',
  },
  formula: {
    sum: '求和',
    average: '求平均值',
    max: '求最大值',
    min: '求最小值',
    concat: '字符拼接',
    _if: '条件判断',
    and: '和',
    or: '或',
  },
  validation: {
    required: '此值必填',
    notMatch: '此值不匹配验证规则',
    between: '此值应在 {} 和 {} 之间',
    notBetween: '此值不应在 {} 和 {} 之间',
    notIn: '此值不在列表中',
    equal: '此值应该等于 {}',
    notEqual: '此值不应该等于 {}',
    lessThan: '此值应该小于 {}',
    lessThanEqual: '此值应该小于等于 {}',
    greaterThan: '此值应该大于 {}',
    greaterThanEqual: '此值应该大于等于 {}',
  },
  error: {
    pasteForMergedCell: '无法对合并的单元格执行此操作',
  },
  calendar: {
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  },
  button: {
    next: '下一步',
    cancel: '取消',
    remove: '删除',
    save: '保存',
    ok: '确认',
  },
  sort: {
    desc: '降序',
    asc: '升序',
  },
  filter: {
    empty: '空白',
  },
  dataValidation: {
    mode: '模式',
    range: '单元区间',
    criteria: '条件',
    modeType: {
      cell: '单元格',
      column: '列模式',
      row: '行模式',
    },
    type: {
      list: '列表',
      number: '数字',
      date: '日期',
      phone: '手机号',
      email: '电子邮件',
    },
    operator: {
      be: '在区间',
      nbe: '不在区间',
      lt: '小于',
      lte: '小于等于',
      gt: '大于',
      gte: '大于等于',
      eq: '等于',
      neq: '不等于',
    },
  },
};

// 定义样式接口
interface CellStyle {
  font?: {
    name: string;
    size: number;
    bold?: boolean;
    color?: string;
  };
  color?: string;
  bgcolor?: string;
  align?: string;
  valign?: string;
}

// 初始化中文
Spreadsheet.locale('zh-cn', zhCN);

const props = defineProps({
  file: { type: Object as () => File | Blob, required: true }, // 传入 File 或 Blob 对象
});

const containerRef = ref<HTMLDivElement | null>(null);
const loading = ref(false);
const loadingText = ref('正在解析文件...');
const errorMsg = ref('');
let spreadsheetInstance: Spreadsheet | null = null;
let worker: Worker | null = null;

// 1. 初始化 Worker 并发送数据
const startParse = async () => {
  loading.value = true;
  errorMsg.value = '';
  loadingText.value = '正在读取基础数据...';

  const buffer = await props.file.arrayBuffer();

  worker = new Worker(new URL('../workers/excelParserWorker.js', import.meta.url), { type: 'module' });

  worker.onmessage = async (e) => {
    const { type, data, message } = e.data;
    if (type === 'success') {
      loadingText.value = '正在渲染...';
      await nextTick();
      // 拿到基础数据后，使用 ExcelJS 补充样式
      await applyStyles(data);
      initSpreadsheet(data);
      loading.value = false;
    } else if (type === 'error') {
      errorMsg.value = `解析失败: ${message}`;
      loading.value = false;
    }
  };
  worker.postMessage({ buffer, fileName: props.file instanceof File ? props.file.name : 'unknown.xlsx' });
};

// 定义 Sheet 数据接口
interface CellData {
  text?: string;
  [key: string]: unknown;
}

interface RowData {
  cells: Record<number, CellData>;
}

interface SheetData {
  maxRow?: number;
  rows?: RowData[];
}

// 2. 使用 ExcelJS 提取样式并合并到基础数据中
const applyStyles = async (sheetDataArray: SheetData[]) => {
  try {
    const workbook = new ExcelJS.Workbook();
    // 将 File 对象转换为 ArrayBuffer 以兼容 ExcelJS
    const arrayBuffer = await props.file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);

    workbook.worksheets.forEach((ws, index) => {
      const sheetData = sheetDataArray[index];
      if (!sheetData) return;

      ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        const rIdx = rowNumber - 1;
        if (!sheetData.rows) sheetData.rows = [];
        if (!sheetData.rows[rIdx]) sheetData.rows[rIdx] = { cells: {} };

        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const cIdx = colNumber - 1;
          const currentRow = sheetData.rows![rIdx];
          if (!currentRow) return;

          if (!currentRow.cells[cIdx]) {
            currentRow.cells[cIdx] = { text: '' };
          }

          // 提取并映射样式到 x-data-spreadsheet 格式
          const style: CellStyle = {};
          if (cell.font) {
            style.font = { name: cell.font.name || 'Arial', size: cell.font.size || 11 };
            if (cell.font.bold) style.font.bold = true;
            if (cell.font.color?.argb) style.color = `#${cell.font.color.argb.slice(2)}`;
          }
          if (cell.fill && typeof cell.fill === 'object' && 'fgColor' in cell.fill) {
            const fillWithFgColor = cell.fill as { fgColor?: { argb: string } };
            if (fillWithFgColor.fgColor?.argb) {
              style.bgcolor = `#${fillWithFgColor.fgColor.argb.slice(2)}`;
            }
          }
          if (cell.alignment) {
            style.align = cell.alignment.horizontal || 'left';
            style.valign = cell.alignment.vertical || 'middle';
          }

          Object.assign(currentRow.cells[cIdx], style);
        });
      });
    });
  } catch (err) {
    console.warn('样式解析降级，仅展示基础数据:', err);
  }
};

// 3. 初始化 x-data-spreadsheet 并应用动态行数
const initSpreadsheet = (sheetDataArray: Array<{ maxRow?: number; rows?: Record<string, unknown>[] }>) => {
  if (!containerRef.value) return;

  // 计算全局最大行数，动态设置
  let globalMaxRow = 20;
  sheetDataArray.forEach((s) => {
    if (s.maxRow !== undefined && s.maxRow > globalMaxRow) {
      globalMaxRow = s.maxRow;
    }
  });

  // 根据实际数据行数动态计算，最多显示200行，最少30行
  const dynamicRowLen = Math.min(Math.max(globalMaxRow + 1, 30), 200);

  spreadsheetInstance = new Spreadsheet(containerRef.value, {
    mode: 'read',          // 纯预览模式
    showToolbar: false,    // 隐藏编辑工具栏
    showGrid: true,
    showContextmenu: false,
    showBottomBar: true,
    view: {
      height: () => containerRef.value?.offsetHeight || 720,
      width: () => containerRef.value?.offsetWidth || 1080
    },
    row: { len: dynamicRowLen, height: 25 },
    col: { len: 26, width: 100, indexWidth: 60, minWidth: 60 },
    style: {
      bgcolor: '#ffffff',
      align: 'left' as const,
      valign: 'middle' as const,
      textwrap: false,
      strike: false,
      underline: false,
      color: '#000000',
      font: { name: 'Helvetica', size: 11, bold: false, italic: false },
    },
  });

  spreadsheetInstance.loadData(sheetDataArray);
};

onMounted(() => {
  if (props.file) startParse();
});

onBeforeUnmount(() => {
  if (worker) worker.terminate(); // 组件销毁时终止 Worker 防止内存泄漏
});
</script>

<style lang="scss" scoped>
.excel-preview-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid #e0e0e0;
  overflow: hidden;
}
.spreadsheet-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.loading-overlay, .error-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 10;
  font-size: 16px;
  color: #555;
}
.error-overlay { color: #d32f2f; }
</style>
