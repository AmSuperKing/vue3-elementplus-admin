import { defineStore } from 'pinia'
// import { resetRouter } from '@/router'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { userApi } from '@/api/userApi'
import { flattern } from '@/utils/common'

export const useUserInfoStore = defineStore('userInfo', {
  state: () => {
    return {
      token: getToken(),
      userName: '',
      userNameCn: '',
      roles: <anyObj[]>[],
      authMenus: <anyObj[]>[],
    }
  },
  getters: {},
  actions: {
    setUserInfo(userInfo: anyObj) {
      this.userName = userInfo.userName
      this.userNameCn = userInfo.userNameCn
      this.roles = userInfo.roles
      this.token = userInfo.token
      setToken(userInfo.token)
    },
    setUserName(userInfo: anyObj) {
      this.userName = userInfo.userName
      this.userNameCn = userInfo.userNameCn
    },
    setAuthMenus(menus: anyObj[]) {
      this.authMenus = menus
    },
    getFlatternMenus() {
      return flattern(this.authMenus)
    },
    resetInfo() {
      removeToken()
      this.token = ''
      this.userName = ''
      this.userNameCn = ''
      this.roles = []
      this.authMenus = []
      // resetRouter()
    },
    async getUserInfo() {
      const { code, data } = await userApi.getUserInfo(this.userName)
      if (+code === 200) {
        this.userName = data.userInfo.userName
        this.userNameCn = data.userInfo.userNameCn
        return Promise.resolve(data)
      }
    },
    async getAuthMenus() {
      const { code, data } = await userApi.getUserAuthMenu()
      if (+code === 200) {
        this.authMenus = data.authMenus
        return Promise.resolve(data.authMenus)
      }
    }
  },
})
