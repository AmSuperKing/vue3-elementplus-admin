<template>
  <div class="container">
    <section class="usage-text">
      在 <b><i> 'src/components/icon'</i></b> 中封装了 <b>Icon</b> 组件，<br>
      并全局注册，只需在所需的地方直接使用并传入图标名称，大小，颜色;<br>
      无论 @element-plus/icons-vue 还是自定义额外拓展的 svg 图标,<br>
      使用 @element-plus/icons-vue 时需以 <b><i>el-icon-</i></b> 为前缀或者直接首字母大写的图标名称
      使用 svg 图标资源需以 <b><i>svg-</i></b> 为前缀，svg 资源文件存放在 <b><i>'src/assets/icons/svg'</i></b><br><br>
      <b>example: </b><br>
      <Icon name="svg-chart" size="15px" color="#00aadf"></Icon>
      <pre>&lt;Icon name="svg-chart" size="15px" color="#00aadf"&gt;&lt/Icon&gt;</pre>
    </section>

    <div class="grid">
      <div
        v-for="item of expandedIcons"
        :key="item"
        class="icon-item"
        @click="handleClipboard(generateIconCode(item))"
      >
        <Icon :name="'svg-' + item" size="25px" color="#999"></Icon>
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import clipboard from '@/utils/clipboard'

const expandedIcons = ref<string[]>([])

onMounted(() => {
  getIconList()
})

const getIconList = () => {
  const expandedIconFiles = import.meta.glob('../../assets/icons/svg/*.svg')

  for (const key in expandedIconFiles) {
    const filename = key.replace(/(\.\.\/\.\.\/assets\/icons\/svg\/|\.svg)/g, '')
    expandedIcons.value.push(filename)
  }
}

const generateIconCode = (symbol: string) => {
  return `<Icon name="svg-${symbol}" size="25px" color="#999"></Icon>`
}

const handleClipboard = (text: string) => {
  clipboard(text)
}

</script>

<style lang="scss" scoped>
.container {
  padding: 10px;
  font-family: Monaco, Menlo, Consolas, Courier New, monospace;
  .usage-text {
    padding: 10px;
    line-height: 18px;
    font-size: 15px;
    color: #909399;
    border-radius: 5px;
    background-color: #f5f5f5;
  }
}
.grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  margin-top: 15px;
  border-left: 1px solid #909399;
  border-top: 1px solid #909399;
  .icon-item {
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-right: 1px solid #909399;
    border-bottom: 1px solid #909399;
    cursor: pointer;
    span {
      margin-top: 10px;
      font-size: 14px;
    }
  }
}
</style>