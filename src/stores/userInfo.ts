import { defineStore } from 'pinia'
import { removeToken } from '@/utils/auth'
import { userApi } from '@/api/userApi'
import { flattern } from '@/utils/common'
import { ref } from 'vue'

export const useUserInfoStore = defineStore('userInfo', () => {
  const userName = ref('')
  const userNameCn = ref('')
  const roles = ref<string[]>([])
  const authMenus = ref<MenuRoute[]>([])
  const permissions = ref<string[]>([])

  async function setUserInfo(userInfo: UserInfo) {
    console.log('setUserInfo', userInfo)
    userName.value = userInfo.userName
    userNameCn.value = userInfo.userNameCn
    roles.value = userInfo.roles
    permissions.value = userInfo.permissions as string[]
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
    const requestMethod = userName.value === 'admin' ? userApi.getUserInfo : userApi.getOtherUserInfo
    const response = await requestMethod(userName.value)
    if (+response.code === 200) {
      userName.value = response.data.userName
      userNameCn.value = response.data.userNameCn
      return Promise.resolve(response.data as UserInfo)
    }
  }

  async function getAuthMenus(): Promise<MenuRoute[]> {
    const requestMethod = userName.value === 'admin' ? userApi.getUserAuthMenu : userApi.getNormalUserAuthMenu
    const response = await requestMethod()
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
    permissions,
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
