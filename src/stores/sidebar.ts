import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCookies } from 'vue3-cookies'

const $cookies = useCookies().cookies

export const useSidebarStore = defineStore('sidebar', () => {
  const collapse = ref($cookies.get('collapse') ? !!+$cookies.get('collapse') : false)

  function setCollapse(data: boolean) {
    collapse.value = data
    data ? $cookies.set('collapse', '1') : $cookies.set('collapse', '0')
  }

  function toggleCollappse() {
    collapse.value = !collapse.value
  }

  return { collapse, setCollapse, toggleCollappse }
})
