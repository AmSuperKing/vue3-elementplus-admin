import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'

const $cookies = useCookies().cookies

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
      data ? $cookies.set('is_mobile', '1') : $cookies.set('is_mobile', '0')
    },
  },
})
