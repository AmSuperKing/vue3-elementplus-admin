import { defineStore } from 'pinia'
import VueCookies from 'vue-cookies'

const $cookies: any = VueCookies

export const useSidebarStore = defineStore('sidebar', {
  state: () => {
    return {
      collapse: <boolean>$cookies.get('collapse') ? !!+$cookies.get('collapse') : false,
    }
  },
  getters: {},
  actions: {
    setCollapse(data: boolean) {
      this.collapse = data
      data ? $cookies.set('collapse', 1) : $cookies.set('collapse', 0)
    },
    toggleCollappse() {
      this.collapse = !this.collapse
    },
  },
})
