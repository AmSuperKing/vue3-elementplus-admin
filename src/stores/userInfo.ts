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
  const permissions = ref<string[]>([])

  async function setUserInfo(userInfo: UserInfo) {
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
    // 此处为mock需要，根据实际自行调整
    const token = getToken()
    const requestMethod = token.indexOf('admin') > -1 ? userApi.getUserInfo : userApi.getOtherUserInfo
    const response = await requestMethod(userName.value)
    if (+response.code === 200) {
      userName.value = response.data.userName
      userNameCn.value = response.data.userNameCn
      return Promise.resolve(response.data as UserInfo)
    }
  }

  async function getAuthMenus(): Promise<MenuRoute[]> {
    // 此处为mock需要，根据实际自行调整
    const token = getToken()
    const requestMethod = token.indexOf('admin') > -1 ? userApi.getUserAuthMenu : userApi.getNormalUserAuthMenu
    const response = await requestMethod()
    if (+response.code === 200) {
      authMenus.value = response.data
      return Promise.resolve(response.data as MenuRoute[])
    }
    return []
  }

  async function initUserData() {
    const [userInfoResult, menusResult] = await Promise.allSettled([
      getUserInfo(),
      getAuthMenus()
    ]);

    // 处理用户信息：仅在 fulfilled 且有值时设置
    if (userInfoResult.status === 'fulfilled' && userInfoResult.value) {
      setUserInfo(userInfoResult.value);
    }

    // 处理权限菜单：仅在 fulfilled 时设置
    if (menusResult.status === 'fulfilled') {
      setAuthMenus(menusResult.value);
    }
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
}, { persist: true })
