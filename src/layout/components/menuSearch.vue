<template>
  <div class="search-content">
    <el-input
      ref="searchInputRef"
      v-model="menuSearchContent"
      type="text"
      clearable
      placeholder="搜索菜单 Search Menus"
      maxlength="20"
      class="search-input"
      @input="handleSearchMenu"
      @change="handleSearchMenu"
      @keyup.enter="handleSearchEnter"
    >
      <template #prefix>
        <el-icon class="search-input__icon"><Search /></el-icon>
      </template>
    </el-input>
    <div
      v-loading="loading"
      element-loading-text="搜索中..."
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="res-list"
    >
      <div v-if="resList.length" class="re-content">
        <div v-for="item of resList" :key="item.path" class="res-item" @click="handleToPage(item)">
          <span>
            <el-icon class="prefix-icon"><Link /></el-icon>
            {{ item.menuName }}
          </span>
          <Icon name="svg-enter" color="#999" class="enter-icon" />
        </div>
      </div>
      <div v-else class="no-res">没有找到匹配内容<br />No Result.</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import { useUserInfoStore } from '@/stores/userInfo'

const emits = defineEmits(['toDetail'])

const userInfo = useUserInfoStore()
const authMenus = userInfo.getFlatternMenus()
const loading = ref(false)
const menuSearchContent = ref('')
const resList = ref([] as any[])

const searchInputRef = ref()

onMounted(() => {
  nextTick(() => {
    searchInputRef.value.focus()
  })
})

const handleSearchEnter = () => {
  if (!menuSearchContent.value) {
    resList.value = []
    return
  }
  if (!menuSearchContent.value.trim().length) {
    resList.value = []
    return
  }
  loading.value = true
  const keyword = menuSearchContent.value && menuSearchContent.value.trim()
  resList.value = []
  for (const item of authMenus) {
    if (item.menuName.indexOf(keyword) !== -1) resList.value.push(item)
  }
  loading.value = false
}
const handleSearchMenu = (val: string) => {
  if (!val) {
    resList.value = []
    return
  }
  if (!val.trim().length) {
    resList.value = []
    return
  }
  loading.value = true
  const keyword = val && val.trim()
  const res: any[] = []
  for (const item of authMenus) {
    if (item.menuName.indexOf(keyword) !== -1) res.push(item)
  }
  setTimeout(() => {
    resList.value = res
    loading.value = false
  }, 300)
  
}

const handleToPage = (data: anyObj) => {
  emits('toDetail', data)
}
</script>

<style lang="scss" scoped>
.search-content {
  .search-input {
    height: 50px;
    font-size: 16px;
    .search-input__icon {
      font-size: 25px;
      color: var(--el-color-primary);
    }
  }
  .res-list {
    margin-top: 10px;
    .re-content {
      height: 300px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 0;
      }
      .res-item {
        display: flex;
        align-items: center;
        height: 50px;
        margin: 10px 0;
        border: 1px solid var(--el-color-info-light-9);
        border-radius: 5px;
        font-size: 16px;
        box-shadow: 0 3px 8px var(--el-color-info-light-7);
        cursor: pointer;
        &:hover {
          background-color: var(--el-color-primary-light-3);
          border: 1px solid var(--el-color-primary-light-3);
          box-shadow: 0 3px 8px var(--el-color-primary-light-3);
        }
        &:hover span {
          color: #fff;
        }
        &:hover .enter-icon {
          color: #fff !important;
        }
        span {
          flex: 4;
          display: flex;
          align-items: center;
          padding-left: 15px;
          .prefix-icon {
            margin-right: 10px;
          }
        }
        .enter-icon {
          flex: 1;
          font-size: 16px;
          color: #999;
        }
      }
    }
    .no-res {
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 16px;
      color: #666;
    }
  }
}
</style>
