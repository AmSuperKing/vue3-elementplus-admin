<template>
	<div>
    <el-row :gutter="20" class="mgb20">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div class="grid-content grid-con-1">
            <el-icon class="grid-con-icon"><User /></el-icon>
            <div class="grid-cont-right">
              <div class="grid-num">5678</div>
              <div>用户访问量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div class="grid-content grid-con-2">
            <el-icon class="grid-con-icon"><ChatDotRound /></el-icon>
            <div class="grid-cont-right">
              <div class="grid-num">123</div>
              <div>系统消息</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div class="grid-content grid-con-3">
            <el-icon class="grid-con-icon"><Goods /></el-icon>
            <div class="grid-cont-right">
              <div class="grid-num">5684</div>
              <div>商品数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

		<el-row :gutter="20">
			<el-col :span="8">
				<el-card shadow="hover" style="height: 400px">
					<template #header>
						<div class="clearfix">
							<span>语言详情</span>
						</div>
					</template>
					Vue<el-progress :percentage="71.3" color="#42b983"></el-progress>
          TypeScript<el-progress :percentage="14.1" color="#f1e05a"></el-progress>
          SCSS<el-progress :percentage="8.7"></el-progress>
          HTML<el-progress :percentage="3.1" color="#f56c6c"></el-progress>
          JSON<el-progress :percentage="2.8" color="#626aef"></el-progress>
				</el-card>
			</el-col>
			<el-col :span="16">
				<el-card shadow="hover" style="height: 400px">
					<template #header>
						<div class="clearfix">
							<span>待办事项</span>
							<el-button style="float: right; padding: 3px 0" text>添加</el-button>
						</div>
					</template>

					<el-table :show-header="false" :data="todoList" style="width: 100%">
						<el-table-column width="40">
							<template #default="scope">
								<el-checkbox v-model="scope.row.status"></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column>
							<template #default="scope">
								<div
									class="todo-item"
									:class="{
										'todo-item-del': scope.row.status
									}"
								>
									{{ scope.row.title }}
								</div>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>

		<el-row :gutter="20">
			<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
				<el-card shadow="hover">
					<div id="barChart" class="schart"></div>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
				<el-card shadow="hover">
					<div id="lineChart" class="schart"></div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts" setup>
import { onActivated, onBeforeUnmount, onMounted, reactive } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const todoList = reactive([
	{
		title: '今天要修复100个bug',
		status: false
	},
	{
		title: '今天要修复100个bug',
		status: false
	},
	{
		title: '今天要写100行代码加几个bug吧',
		status: false
	},
	{
		title: '今天要修复100个bug',
		status: false
	},
	{
		title: '今天要修复100个bug',
		status: true
	},
	{
		title: '今天要写100行代码加几个bug吧',
		status: true
	}
])

var barChart:any
var lineChart:any

onMounted(() => {
  window.addEventListener('resize', resizeChart)
})

onActivated(() => {
  setTimeout(() => {
    initBarChart()
    initLineChart()
  }, 300)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  barChart.dispose()
  barChart = null
  lineChart.dispose()
  lineChart = null
})

const resizeChart = () => {
  barChart.resize()
}

const initBarChart = () => {
  if (barChart) return
  const barChartDom: HTMLElement | any = document.getElementById('barChart')
  if (!barChartDom) return
  const barChartOption: EChartsOption = {
    title: {
      text: 'Series Bar Chart',
      left: 'center'
    },
    legend: {
      top: '7%'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    dataset: {
      source: [
        ['product', '2015', '2016', '2017'],
        ['Matcha Latte', 43.3, 85.8, 93.7],
        ['Milk Tea', 83.1, 73.4, 55.1],
        ['Cheese Cocoa', 86.4, 65.2, 82.5],
        ['Walnut Brownie', 72.4, 53.9, 39.1]
      ]
    },
    xAxis: { type: 'category' },
    yAxis: { type: 'value' },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
      {
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            {
              offset: 1,
              color: '#00bb91'
            },
            {
              offset: 0,
              color: '#00aadc'
            }
          ]),
          borderRadius: [2, 2, 0, 0]
        }
      },
      {
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            {
              offset: 1,
              color: '#FF3F97'
            },
            {
              offset: 0,
              color: '#FFB773'
            }
          ]),
          borderRadius: [2, 2, 0, 0]
        }
      },
      {
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            {
              offset: 1,
              color: '#F6AA62'
            },
            {
              offset: 0,
              color: '#7CF2B9'
            }
          ]),
          borderRadius: [2, 2, 0, 0]
        }
      }
    ]
  }
  barChart = echarts.init(barChartDom)
  barChart.setOption(barChartOption)
}

const initLineChart = () => {
  if (lineChart) return
  const lineChartDom: HTMLElement | any = document.getElementById('lineChart')
  if (!lineChartDom) return
  const lineChartOption: EChartsOption = {
    title: {
      text: 'Stacked Area Chart',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
      top: '7%',
      type: 'scroll'
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        label: {
          show: true,
          position: 'top'
        },
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  }
  lineChart = echarts.init(lineChartDom)
  lineChart.setOption(lineChartOption)
}

</script>

<style scoped>
.el-row {
	margin-bottom: 20px;
}

.grid-content {
	display: flex;
	align-items: center;
	height: 100px;
}

.grid-cont-right {
	flex: 1;
	text-align: center;
	font-size: 14px;
	color: #999;
}

.grid-num {
	font-size: 30px;
	font-weight: bold;
}

.grid-con-icon {
	font-size: 50px;
	width: 100px;
	height: 100px;
	text-align: center;
	line-height: 100px;
	color: #fff;
}

.grid-con-1 .grid-con-icon {
	background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
	color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
	background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
	color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
	background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
	color: rgb(242, 94, 67);
}

.mgb20 {
	margin-bottom: 20px;
}

.todo-item {
	font-size: 14px;
}

.todo-item-del {
	text-decoration: line-through;
	color: #999;
}

.schart {
	width: 100%;
	height: 300px;
}
</style>
