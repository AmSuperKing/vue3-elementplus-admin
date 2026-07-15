<template>
  <div>
    <div class="header-search hidden-sm-and-down">
      <el-tooltip effect="dark" content="搜索菜单" placement="bottom">
        <div id="menu-search" class="search-input" @click="showMenuSearchDialog">
          <el-icon class="search-icon">
            <Search />
          </el-icon>
          <span class="search-placeholder">Search</span>
        </div>
      </el-tooltip>
    </div>

    <el-dialog v-model="menuSearchVisible" width="420px" draggable destroy-on-close :show-close="false">


      <div class="search-content pt-20">
        <el-input ref="searchInputRef" v-model="menuSearchContent" type="text" clearable placeholder="搜索菜单 Search Menus"
          maxlength="20" class="search-input" @input="handleSearchMenu" @change="handleSearchMenu"
          @keyup.enter="handleSearchEnter">
          <template #prefix>
            <el-icon class="search-input__icon">
              <Search />
            </el-icon>
          </template>
        </el-input>
        <div v-loading="loading" element-loading-text="搜索中..." element-loading-background="rgba(255, 255, 255, 0.8)"
          class="res-list">
          <div v-if="resList.length" class="re-content">
            <div v-for="item of resList" :key="item.path" class="res-item" @click="handleToPage(item)">
              <span>
                <el-icon class="prefix-icon">
                  <Link />
                </el-icon>
                {{ item.meta.title || item.name }}
              </span>
              <Icon name="svg-enter" color="#999" class="enter-icon" />
            </div>
          </div>
          <div v-else class="no-res">没有找到匹配内容<br />No Result.</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfo'

const emits = defineEmits<{
  toDetail: [data: MenuRoute]
}>()

const router = useRouter()

const menuSearchVisible = ref(false)
const userInfo = useUserInfoStore()
const authMenus = userInfo.getFlatternMenus()
const loading = ref(false)
const menuSearchContent = ref('')
const resList = ref<MenuRoute[]>([])
const searchInputRef = ref<HTMLInputElement>()

const showMenuSearchDialog = () => {
  menuSearchVisible.value = true
}

// 将关键字拆分为数组
const splitKeywords = (keyword: string) => {
  if (!keyword || !keyword.trim()) return [];

  const trimmedKeyword = keyword.trim();

  // 检查是否包含分隔符（空格、逗号、顿号等）
  const hasSeparator = /[\s,，、]/.test(trimmedKeyword);

  if (hasSeparator) {
    // 如果有分隔符，按分隔符拆分
    return trimmedKeyword.split(/[\s,，、]+/).filter((k) => k.length > 0);
  } else {
    // 如果没有分隔符，将每个字符作为独立关键字
    return trimmedKeyword.split("").filter((k) => k.length > 0);
  }
};

// 检查文本是否包含所有关键字（拆分匹配）
const matchAllKeywords = (text: string, keywords: string[]) => {
  if (!text || keywords.length === 0) return false;

  // 确保文本是字符串类型
  const textStr = String(text).trim();
  if (!textStr) return false;

  const lowerText = textStr.toLowerCase();

  // 所有关键字都必须匹配
  return keywords.every((keyword) => {
    const trimmedKeyword = keyword.trim().toLowerCase();
    return trimmedKeyword && lowerText.includes(trimmedKeyword);
  });
};

// 处理搜索匹配
const filterMenus = (keyword: string): MenuRoute[] => {
  if (!keyword || !keyword.trim()) {
    return []
  }

  let searchResults: MenuRoute[] = []

  if (!keyword || !keyword.trim()) {
      searchResults = [];
    }

    const keywords = splitKeywords(keyword);
    if (keywords.length === 0) {
      searchResults = [];
    }

    const results: MenuRoute[] = [];

    // 递归查找菜单 - 仅基于name属性匹配
    const searchInMenus = (menus: MenuRoute[]) => {
      if (!menus || !Array.isArray(menus)) return;

      for (const menu of menus) {
        if (((menu?.meta?.title && typeof menu?.meta.title === "string" && menu.meta.title.trim()) || (menu.name && typeof menu.name === "string" && menu.name.trim()))) {
          // 专门针对name属性进行匹配
          if (matchAllKeywords(menu.meta.title, keywords) || matchAllKeywords(menu.name as string, keywords)) {
            results.push(menu);
          }
        }

        // 继续搜索子菜单
        if (menu.children && Array.isArray(menu.children) && menu.children.length > 0) {
          searchInMenus(menu.children);
        }
      }
    };

    searchInMenus(authMenus);
    searchResults = results;

    return searchResults
}

const handleSearchEnter = () => {
  loading.value = true
  resList.value = filterMenus(menuSearchContent.value)
  loading.value = false
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const handleSearchMenu = (val: string) => {
  if (!val || !val.trim()) {
    resList.value = []
    return
  }

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    loading.value = true
    resList.value = filterMenus(val)
    console.log(resList.value)
    loading.value = false
  }, 300)
}

const handleToPage = (data: MenuRoute) => {
  emits('toDetail', data)
  menuSearchVisible.value = false
  router.push(data.path)
}

onMounted(() => {
  nextTick(() => {
    searchInputRef.value?.focus()
  })
})
</script>

<style lang="scss" scoped>
.header-search {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .search-input {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25px;
    width: 72px;
    padding: 2px 4px;
    color: var(--el-text-color-secondary);
    border-radius: 6px;
    border: 1px solid var(--el-color-primary);
    background-color: #fff;
    transition: color 0.5s;
    cursor: pointer;

    .search-icon {
      font-size: 16px;
      margin-right: 5px;
    }

    .search-placeholder {
      font-size: 13px;
      font-weight: 500;
    }

    &:hover {
      color: var(--el-color-primary);
    }
  }
}

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
          background-color: var(--el-color-primary);
          border: 1px solid var(--el-color-primary);
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
