<!-- TableExample.vue -->
<template>
  <div style="padding: 20px;">
    <h2>📊 多维表格组件示例</h2>

    <!-- 控制面板 -->
    <div style="margin-bottom: 16px; display: flex; gap: 16px; align-items: center;">
      <label>
        <input type="checkbox" v-model="selectable" /> 开启选择列
      </label>
      <label v-if="selectable">
        <input type="radio" v-model="selectMode" value="radio" /> 单选
      </label>
      <label v-if="selectable">
        <input type="radio" v-model="selectMode" value="checkbox" /> 多选
      </label>
      <span v-if="selectable" style="color: #666;">
        已选中: {{ selectedRowKeys.length }} 条 (Keys: {{ selectedRowKeys.join(', ') }})
      </span>
      <button v-if="selectable" @click="selectedRowKeys = []" style="margin-left: auto;">
        清空选择
      </button>
    </div>

    <MultiTable
      :columns="columns"
      :data="tableData"
      :selectable="selectable"
      :selectMode="selectMode"
      headerCellBg="#fafafa"
      :stripe="true"
      click-row-to-select
      v-model:selectedRowKeys="selectedRowKeys"
      @selection-change="onSelectionChange"
      @sort-change="onSortChange"
      :selectable-props="(row: Record<string, unknown>) => { return row.id === 1 }"
      rowHoverBg="#f5f7fa"
      :highlightSlectedRow="false"
      showSummary
      summary="合计"
      showIndex
      size="small"
      :rowIndexFormat="(index: number, row:Record<string, unknown>) => `${index + 1}`.padStart(2, '0')"
      :headerRowStyle="(rowContextKey, idx) => { return {'--header-test': 'var(--test-class-info)'} }"
      :cell-text-ellipsis="false"
    >
      <template #header>表头插槽</template>
      <!-- 表头插槽 -->
      <template #header_purchaseNo="{ column }">
        <span style="color: #1890ff; font-weight: bold;">🔖 {{ column.title }}</span>
      </template>

      <template #header_operation="{ column }">
        <span style="color: #ff4d4f;">⚙️ {{ column.title }}</span>
      </template>

      <!-- 单元格插槽 -->
      <template #cell_purchaseNo="{ value, row }">
        <a href="javascript:;" style="color: #1890ff;" @click.stop="onPurchaseClick(row)">
          {{ value }}
        </a>
      </template>

      <template #cell_inDate="{ value }">
        <span style="color: #52c41a;">📅 {{ value }}</span>
      </template>

      <template #cell_goodPrice="{ value }">
        <span style="color: #f5222d; font-weight: bold;">¥ {{ Number(value).toFixed(2) }}</span>
      </template>

      <template #cell_goodGcoss="{ value }">
        <span :style="{ color: Number(value) >= 0 ? '#52c41a' : '#ff4d4f' }">
          {{ Number(value) >= 0 ? '+' : '' }}{{ value }}%
        </span>
      </template>

      <template #cell_name="{ value }">
        <div style="font-size: 12px; line-height: 1.6; color: red">
          <div>{{ value }}</div>
        </div>
      </template>

      <template #cell_commissionDetail_name="{ value }">
        <div style="font-size: 12px; line-height: 1.6; color: #52c41a">
          <div>{{ value }}</div>
        </div>
      </template>

      <template #cell_inputInvoiceStatusName="{ value }">
        <span :style="{
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          background: getStatusBg(value as string),
          color: getStatusColor(value as string),
        }">
          {{ value || '-' }}
        </span>
      </template>

      <template #cell_operation="{ row, index }">
        <div style="display: flex; gap: 8px; justify-content: center;">
          <button class="btn-link" @click.stop="onEdit(row as unknown as TableRow)">编辑</button>
          <button class="btn-link btn-danger" @click.stop="onDelete(row as unknown as TableRow, index)">删除</button>
        </div>
      </template>
    </MultiTable>
    <CusPagination
      v-model:current-page="page"
      v-model:page-size="size"
      :total="200"
      :page-sizes="[10, 20, 50, 100]"
      show-total
      show-sizes
      show-jumper
      background
      @current-change="onPageChange"
      @size-change="onSizeChange"
      @change="onChange"
      size="small"
      theme="#26d97a"
      class="mt-20"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MultiTable from './components/MultiTable/MultiTable.vue'
import type { ColumnConfig } from './components/MultiTable/types'
import CusPagination from './components/CusPagination/CusPagination.vue'

const selectable = ref(true)
const selectMode = ref<'radio' | 'checkbox'>('checkbox')
const selectedRowKeys = ref<(string | number)[]>([])

const columns: ColumnConfig[] = [
  { dataIndex: 'name', title: '名目', width: 100, fixed: 'left', },
  { dataIndex: 'purchaseNo', title: '采购单号', fixed: 'left', width: 150 },
  { dataIndex: 'inDate', title: '入库日期', width: 120, resizable: true, sortable: true },
  { dataIndex: 'supplierName', title: '供应商名称', width: 180, resizable: true, fixed: 'left', },
  { dataIndex: 'orderSourceName', title: '采购订单来源', width: 90, resizable: true },
  { dataIndex: 'goodsSourceTypeName', title: '产品来源', width: 80, resizable: true },
  {
    dataIndex: 'goodsDetail',
    title: '产品信息',
    resizable: true,
    align: 'center',
    children: [
      { dataIndex: 'goodsSourceTypeName', title: '产品来源', resizable: true, align: 'center' },
      { dataIndex: 'goodNo', title: '产品编码', resizable: true },
      { dataIndex: 'goodArea', title: '销售城市', resizable: true },
      { dataIndex: 'goodPrice', title: '价格', resizable: true, sortable: true },
      { dataIndex: 'goodGcoss', title: '利润', resizable: true, sortable: true },
    ]
  },
  {
    dataIndex: 'commissionDetail',
    title: '业务费信息',
    width: 500,
    resizable: true,
    align: 'right',
    children: [
      { dataIndex: 'name', title: '费用名称', resizable: true, align: 'center' },
      { dataIndex: 'baseCommission', title: '基础费', resizable: true, sortable: true },
      { dataIndex: 'extraCommission', title: '提成费', resizable: true, sortable: true },
    ]
  },
  { dataIndex: 'totalGrossProfitAmount', title: '采购总毛利', width: 150, resizable: true, sortable: true },
  { dataIndex: 'salesmanName', title: '采购员', width: 80, resizable: true },
  { dataIndex: 'totalPurchaseAmount', title: '采购总金额', width: 150, resizable: true, sortable: true },
  { dataIndex: 'paidAmount', title: '已付金额', width: 100, resizable: true, sortable: true },
  { dataIndex: 'inputInvoiceStatusName', title: '进项票状态', width: 100, resizable: true },
  { dataIndex: 'inputInvoiceDate', title: '进项票日期', width: 120, resizable: true, sortable: true },
  { dataIndex: 'operation', title: '操作', fixed: 'right', width: 150, align: 'center' },
]

const tableData = ref<TableRow[]>([

])

const mockData = [
  {
    id: 1,
    name: '采购单',
    purchaseNo: 'PO20260001',
    inDate: '2026-06-01',
    supplierName: '深圳市恒达科技有限公司',
    orderSourceName: 'ERP系统',
    goodsDetail: {
      goodsSourceTypeName: '自产',
      goodNo: 'G-10001',
      goodArea: '深圳',
      goodPrice: 1280.5,
      goodGcoss: 15.5,
    },
    commissionDetail: [
      {
        extraCommission: '220.00',
        baseCommission: '540.00',
        name: '基础费'
      },
      {
        extraCommission: '20.00',
        baseCommission: '40.00',
        name: '运费'
      },
      {
        baseCommission: '560.00',
        extraCommission: '260.00',
        name: '提成费'
      }
    ],
    totalGrossProfitAmount: '19,840.00',
    salesmanName: '张三',
    totalPurchaseAmount: '128,000.00',
    paidAmount: '64,000.00',
    inputInvoiceStatusName: '已收票',
    inputInvoiceDate: '2026-06-05',
  },
  {
    id: 2,
    name: '贸易单',
    purchaseNo: 'PO20260002',
    inDate: '2026-06-03',
    supplierName: '广州华联贸易有限公司',
    orderSourceName: '手动录入',
    goodsDetail: {
      goodsSourceTypeName: '外采',
      goodNo: 'G-20035',
      goodArea: '广州',
      goodPrice: 3560.0,
      goodGcoss: -2.3,
    },
    commissionDetail: [
      {
        extraCommission: '180.00',
        baseCommission: '810.00',
        name: '基础费'
      },
      {
        extraCommission: '180.00',
        baseCommission: '410.00',
        name: '提成费'
      }
    ],
    totalGrossProfitAmount: '-8,280.00',
    salesmanName: '李四',
    totalPurchaseAmount: '356,000.00',
    paidAmount: '356,000.00',
    inputInvoiceStatusName: '未收票',
    inputInvoiceDate: '-',
  },
]

for (let i = 0; i < 100; i++) {
  tableData.value.push({
    ...mockData[i % mockData.length],
    id: i + 1,
  })
}

function onSelectionChange(selectedRows: TableRow[], keys: (string | number)[]) {
  console.log('选中行变化:', selectedRows, keys)
}

function onSortChange(dataIndex: string, order: 'asc' | 'desc' | null) {
  console.log('排序变化:', dataIndex, order)
}

interface TableRow {
  id?: number
  purchaseNo?: string
  [key: string]: unknown
}

function onPurchaseClick(row: TableRow) {
  alert(`查看采购单: ${row.purchaseNo}`)
}

function onEdit(row: TableRow) {
  alert(`编辑: ${row.purchaseNo}`)
}

function onDelete(row: TableRow, index: number) {
  if (confirm(`确认删除 ${row.purchaseNo}？`)) {
    tableData.value.splice(index, 1)
    selectedRowKeys.value = selectedRowKeys.value.filter(k => k !== row.id)
  }
}

function getStatusBg(status: string): string {
  switch (status) {
    case '已收票': return '#f6ffed'
    case '未收票': return '#fff2f0'
    case '收票中': return '#fffbe6'
    default: return '#f5f5f5'
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case '已收票': return '#52c41a'
    case '未收票': return '#ff4d4f'
    case '收票中': return '#faad14'
    default: return '#999'
  }
}


const page = ref(1)
const size = ref(10)

const onPageChange = (val: number) => console.log('current-change:', val)
const onSizeChange = (val: number) => console.log('size-change:', val)
const onChange = (cp: number, ps: number) => console.log('change:', cp, ps)
</script>

<style scoped>
.btn-link {
  border: none;
  background: none;
  color: #1890ff;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 13px;
}

.btn-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

.btn-danger {
  color: #ff4d4f;
}

.btn-danger:hover {
  color: #ff7875;
}
</style>
