<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="400"
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        width="60px"
        align="center"
        fixed="left"
        label="选择"
      >
        <template #default="scope">
          <input
            :key="scope.row.id + '-' + new Date().getTime()"
            type="radio"
            name="radio"
            class="custom-radio-size"
            @click="radioClick(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        align="center"
        width="80"
        fixed="left"
      />
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
        fixed="left"
      />

      <el-table-column
        align="center"
        label="用户名"
      >
        <el-table-column
          prop="name"
          width="120"
          align="center"
        >
          <template #header>
            <el-input
              v-model.trim="searchInfo.name"
              clearable
              placeholder="搜索..."
              @change="search"
            />
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        align="center"
        label="账户余额"
      >
        <el-table-column align="center" width="120">
          <template #header>
            <el-input
              v-model.trim="searchInfo.money"
              clearable
              placeholder="搜索..."
              @change="search"
            />
          </template>
          <template #default="scope">￥{{ scope.row.money }}</template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="头像(查看大图)" align="center" width="120">
        <template #default="scope">
          <el-image
            class="table-td-thumb"
            :src="scope.row.thumb"
            :z-index="10"
            :preview-src-list="[scope.row.thumb]"
            preview-teleported
          />
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="地址"
      >
        <el-table-column
          align="center"
          prop="address"
          min-width="200"
        >
          <template #header>
            <el-input
              v-model.trim="searchInfo.address"
              clearable
              placeholder="搜索..."
              @change="search"
            />
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        align="center"
        label="状态"
      >
        <el-table-column align="center" width="120">
          <template #header>
            <el-select
              v-model="searchInfo.state"
              clearable
              placeholder="搜索..."
              style="width: 100%"
              @change="search"
            >
              <el-option label="成功" value="成功" />
              <el-option label="失败" value="失败" />
            </el-select>
          </template>
          <template #default="scope">
						<el-tag
							:type="scope.row.state === '成功' ? 'success' : scope.row.state === '失败' ? 'danger' : ''"
						>
							{{ scope.row.state }}
						</el-tag>
					</template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center"
        label="注册时间"
      >
        <el-table-column
          align="center"
          prop="date"
          width="180"
        >
          <template #header>
            <el-date-picker
              v-model="searchInfo.date"
              type="date"
              value-format="YYYY-MM-DD"
              clearable
              placeholder="搜索..."
              style="width: 100%"
              @change="search"
            />
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center" fixed="right">
        <template #default="scope">
          <el-button link type="primary" :icon="Edit" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button link type="danger" :icon="Delete" @click="handleDelete(scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-block">
      <el-pagination
        v-model:currentPage="pageData.currPage"
        v-model:page-size="pageData.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :total="pageData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'
import { tableApi } from '@/api/tableApi'

interface TableItem {
	id?: number;
	name?: string;
	money?: string;
	state?: string;
	date?: string;
	address?: string;
}

const tableData = ref<TableItem[]>([])
const searchInfo = reactive<TableItem>({})
const pageData = reactive({
  currPage: 1,
  pageSize: 10,
  total: 0
})
const selectedRow = ref<TableItem>({})
const multipleSelection = ref<TableItem[]>([])

onMounted(() => {
  search()
})

const search = () => {
  tableApi.getUserList().then(res => {
    if (res) {
      tableData.value = res.data.list
      pageData.total = res.data.total
    }
  }).catch(e => {
		ElMessage.error(e)
	})
}
const handleSizeChange = (val: number) => {
  pageData.pageSize = val
  search()
}
const handleCurrentChange = (val: number) => {
  pageData.currPage = val
  search()
}
const radioClick = (row: TableItem) => {
  selectedRow.value = row
}
const handleSelectionChange = (val: TableItem[]) => {
  multipleSelection.value = val
}

const handleEdit = (row: TableItem) => {
  console.log(row)
}
// 删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示',
    {
      confirmButtonText: '确 定',
      cancelButtonText: '取 消',
      type: 'warning'
    }
  )
		.then(() => {
			ElMessage.success('删除成功')
			tableData.value.splice(index, 1)
		})
		.catch(() => {})
}

</script>

<style lang="scss" scoped>
.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
.pagination-block {
  margin: 10px auto;
  text-align: center;
}
</style>
