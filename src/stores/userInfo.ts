import { defineStore } from 'pinia'
import { getToken, removeToken } from '@/utils/auth'
import { userApi } from '@/api/userApi'
import { flattern } from '@/utils/common'
import { ref } from 'vue'

export const useUserInfoStore = defineStore('userInfo', () => {
  const userName = ref('')
  const userNameCn = ref('')
  const roles = ref<string[]>([])
  const authMenus = ref<MenuRoute[]>([])

  async function setUserInfo(userInfo: UserInfo) {
    userName.value = userInfo.userName
    userNameCn.value = userInfo.userNameCn
    roles.value = userInfo.roles
  }

  function setUserName(userInfo: Pick<UserInfo, 'userName' | 'userNameCn'>) {
    userName.value = userInfo.userName
    userNameCn.value = userInfo.userNameCn
  }

  function setAuthMenus(menus: MenuRoute[]) {
    authMenus.value = menus
  }

  function getFlatternMenus(): MenuRoute[] {
    return flattern(authMenus.value) as MenuRoute[]
  }

  function resetInfo() {
    removeToken()
    userName.value = ''
    userNameCn.value = ''
    roles.value = []
    authMenus.value = []
  }

  async function getUserInfo() {
    const response = await userApi.getUserInfo(userName.value)
    if (+response.code === 200) {
      userName.value = response.data.userName
      userNameCn.value = response.data.userNameCn
      return Promise.resolve(response.data as UserInfo)
    }
  }

  async function getAuthMenus(): Promise<MenuRoute[]> {
    const response = await userApi.getUserAuthMenu()
    if (+response.code === 200) {
      authMenus.value = response.data
      return Promise.resolve(response.data as MenuRoute[])
    }
    return []
  }

  function initUserData() {
    getUserInfo().then((userInfo) => {
      if (userInfo) setUserInfo(userInfo)
    })
    getAuthMenus().then((menus) => {
      setAuthMenus(menus)
    })
  }

  return {
    userName,
    userNameCn,
    roles,
    authMenus,
    setUserInfo,
    setUserName,
    setAuthMenus,
    getFlatternMenus,
    resetInfo,
    getUserInfo,
    getAuthMenus,
    initUserData,
  }
})
