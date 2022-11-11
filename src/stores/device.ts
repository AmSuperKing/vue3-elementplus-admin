import { defineStore } from 'pinia'
import VueCookies from 'vue-cookies'

const $cookies: any = VueCookies

export const useDeviceStore = defineStore('device', {
  state: () => {
    return {
      isMobile: $cookies.get('is_mobile') ? !!+$cookies.get('is_mobile') : false,
    }
  },
  getters: {},
  actions: {
    setIsMobile(data: boolean) {
      this.isMobile = data
      data ? $cookies.set('is_mobile', 1) : $cookies.set('is_mobile', 0)
    },
  },
})
