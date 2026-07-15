<template>
  <div class="user-menu">
    <div class="user-avator hidden-sm-and-down">
      <img :src="userAvator" />
    </div>
    <el-dropdown id="user-setting" class="user-name" trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
        {{ userInfo.userNameCn || '尊敬的用户' }}
        <el-icon :color="variablesList.textColor">
          <CaretBottom />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="user">我的设置</el-dropdown-item>
          <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfo'
import variables from '@/assets/styles/variables.module.scss'
import userAvator from '@/assets/imgs/avatar.png'

type DropdownCommand = 'user' | 'loginout'

const router = useRouter()
const userInfo = useUserInfoStore()
const variablesList = computed(() => variables)

const handleCommand = (command: DropdownCommand) => {
  if (command === 'loginout') {
    userInfo.resetInfo()
    router.push('/login')
  } else if (command === 'user') {
    router.push('/userWork/userCenter')
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.user-menu {
  display: flex;
  align-items: center;
  height: 100%;
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
  max-width: 120px;
  overflow: hidden;
  color: $textColor;
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}
</style>
