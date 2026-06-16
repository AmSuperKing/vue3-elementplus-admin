/* eslint-disable no-restricted-globals */
import * as XLSX from 'xlsx';

/**
 * @typedef {Object} CellData
 * @property {string} text - 单元格文本内容
 * @property {[number, number]} [merge] - 合并单元格的行列跨度 [行跨度, 列跨度]
 */

/**
 * @typedef {Object} RowData
 * @property {Record<number, CellData>} cells - 行中的单元格数据，键为列索引
 */

/**
 * @typedef {Object} SheetData
 * @property {string} name - 工作表名称
 * @property {Record<number, RowData>} rows - 行数据，键为行索引
 * @property {string[]} merges - 合并单元格范围数组
 * @property {number} maxRow - 最大行索引
 */

/**
 * @typedef {Object} WorkerMessage
 * @property {ArrayBuffer} buffer - Excel 文件的 ArrayBuffer
 * @property {string} fileName - 文件名
 */

/**
 * @typedef {Object} SuccessResponse
 * @property {'success'} type - 响应类型
 * @property {SheetData[]} data - 解析后的工作表数据
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {'error'} type - 响应类型
 * @property {string} message - 错误信息
 */

/**
 * @typedef {SuccessResponse | ErrorResponse} WorkerResponse
 */

/**
 * Web Worker 消息处理函数
 * @param {MessageEvent<WorkerMessage>} e - 消息事件对象
 */
self.onmessage = function (e) {
  const { buffer, fileName } = e.data;
  try {
    // 在 Worker 中解析基础数据
    const workbook = XLSX.read(new Uint8Array(buffer), {
      type: 'array',
      cellStyles: false, // Worker 中不解析样式，提升速度
      cellNF: false,
      cellHTML: false
    });

    // 将 Workbook 转换为 x-data-spreadsheet 需要的数据格式
    /** @type {SheetData[]} */
    const jsonData = [];
    workbook.SheetNames.forEach((name) => {
      const ws = workbook.Sheets[name];
      const aoa = XLSX.utils.sheet_to_json(ws, { raw: false, header: 1 });
      /** @type {Record<number, RowData>} */
      const rows = {};
      let maxRow = 0;

      aoa.forEach((rowArr, rIdx) => {
        /** @type {Record<number, CellData>} */
        const cells = {};
        rowArr.forEach((cellVal, cIdx) => {
          cells[cIdx] = { text: cellVal === undefined ? '' : String(cellVal) };
        });
        rows[rIdx] = { cells };
        if (rIdx > maxRow) maxRow = rIdx;
      });

      // 处理合并单元格
      /** @type {string[]} */
      const merges = [];
      if (ws['!merges']) {
        ws['!merges'].forEach((merge) => {
          const cell = rows[merge.s.r]?.cells[merge.s.c];
          if (cell) {
            cell.merge = [merge.e.r - merge.s.r, merge.e.c - merge.s.c];
          }
          merges.push(XLSX.utils.encode_range(merge));
        });
      }

      jsonData.push({
        name,
        rows,
        merges,
        maxRow,
      });
    });

    /** @type {SuccessResponse} */
    const response = { type: 'success', data: jsonData };
    self.postMessage(response);
  } catch (err) {
    /** @type {Error} */
    const error = err;
    /** @type {ErrorResponse} */
    const response = { type: 'error', message: error.message };
    self.postMessage(response);
  }
};
