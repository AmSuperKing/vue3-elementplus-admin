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
      const { code, data } = await userApi.getUserInfo('admin')
      if (+code === 200) {
        this.userName = data.userName
        this.userNameCn = data.userNameCn
        return Promise.resolve(data)
      }
    },
    async getAuthMenus() {
      const { code, data } = await userApi.getUserAuthMenu()
      console.log(data)
      if (+code === 200) {
        this.authMenus = data
        return Promise.resolve(data)
      }
    }
  },
})
