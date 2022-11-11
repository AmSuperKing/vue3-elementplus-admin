<template>
  <div class="header">
    <div id="collapse-btn" class="collapse-btn" @click="collapseChage">
      <el-icon v-if="!sidebar.collapse" class="collapse-btn-icon" :size="22">
        <Fold />
      </el-icon>
      <el-icon v-else class="collapse-btn-icon" :size="22">
        <Expand />
      </el-icon>
    </div>

    <div class="logo hidden-md-and-down">{{ settings.pageTitle }}</div>
    <div class="header-right">
      <div class="right-content">

        <div class="btn-bell hidden-sm-and-down">
          <el-tooltip effect="dark" :content="message ? `有${message}条未读消息` : `消息中心`" placement="bottom">
            <el-icon :color="variablesList.textColor" @click="handleBellClick"><Bell /></el-icon>
          </el-tooltip>
          <span v-if="message" class="btn-bell-badge" />
        </div>

        <Screenfull id="screenfull" class="screenfull-btn hidden-sm-and-down" />

        <div class="header-search hidden-sm-and-down">
          <el-tooltip effect="dark" content="搜索菜单" placement="bottom">
            <div id="menu-search" class="search-input" @click="showMenuSearchDialog">
              <el-icon class="search-icon"><Search /></el-icon>
              <span class="search-placeholder">Search</span>
            </div>
          </el-tooltip>
        </div>

        <div class="user-avator hidden-sm-and-down">
          <img src="../../assets/images/avatar.png" />
        </div>
        <el-dropdown id="user-setting" class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userInfo.userName || '尊敬的用户' }}
            <el-icon :color="variablesList.textColor"><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="user">我的设置</el-dropdown-item>
              <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <el-dialog v-model="menuSearchVisible" width="420px" draggable destroy-on-close :show-close="false">
      <MenuSearch style="margin-top: -25px" @toDetail="handleToDetailPage" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/userInfo'
import { useSidebarStore } from '@/stores/sidebar'
import { settings } from '@/settings'
import variables from '@/styles/variables.module.scss'
import MenuSearch from './menuSearch.vue'
import Screenfull from '@/components/Screenfull/index.vue'

const userInfo = useUserInfoStore()
const sidebar = useSidebarStore()
const variablesList = computed(() => variables)

const message = 2

// 侧边栏折叠
const collapseChage = () => {
  sidebar.toggleCollappse()
}
const menuSearchVisible = ref(false)

onMounted(() => {
  if (document.body.clientWidth < 1500) {
    collapseChage()
  }
})

// 用户名下拉菜单选择事件
const router = useRouter()
const handleCommand = (command: string) => {
  if (command === 'loginout') {
    userInfo.resetInfo()
    router.push('/login')
  } else if (command === 'user') {
    router.push('/userWork/userCenter')
  }
}

const handleBellClick = () => {
  ElMessage.info('developing...')
}

const showMenuSearchDialog = () => {
  menuSearchVisible.value = true
}

const handleToDetailPage = (data: anyObj) => {
  menuSearchVisible.value = false
  router.push(data.menuPath)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 24px;
  color: $headerText;
  border-bottom: 1px solid $subMenuBorder;
  .logo {
    float: left;
    width: 250px;
    line-height: 70px;
    font-weight: bold;
  }
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 66px;
  &:hover {
    background-color: var(--el-color-primary-light-9);
  }
  &:hover .collapse-btn-icon {
    color: $headerText;
  }
  .collapse-btn-icon {
    vertical-align: middle;
    color: $menuText;
  }
}

.header-right {
  position: absolute;
  top: 0;
  right: 0;
  padding-right: 15px;
  .right-content {
    position: relative;
    display: flex;
    height: 70px;
    align-items: center;
  }
}

.btn-bell {
  position: relative;
  width: 24px;
  height: 24px;
  margin-right: 15px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
  .btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #ff3232;
    color: $textColor;
  }
}

.screenfull-btn {
  display: inline-block;
  margin-right: 15px;
  font-size: 18px;
  color: $menuText;
  &:hover {
    color: $headerText;
  }
}

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
    color: var(--el-color-primary);
    border-radius: 8px;
    border: 1px solid var(--el-color-primary);
    background-color: var(--el-color-info-light-9);
    transition: color 0.5s;
    cursor: pointer;
    &:hover .search-placeholder {
      font-weight: 800;
    }
    .search-icon {
      font-size: 16px;
      margin-right: 5px;
    }
    .search-placeholder {
      font-size: 13px;
      font-weight: 500;
    }
  }
}

.user-avator {
  margin-left: 20px;
  & img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

.user-name {
  margin-left: 10px;
}
.el-dropdown-link {
  color: $textColor;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
