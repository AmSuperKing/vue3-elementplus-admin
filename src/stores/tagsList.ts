import { defineStore } from 'pinia'

export const useTagsListStore = defineStore('tagsList', {
  state: () => {
    return {
      list: <TagsItem[]>[],
    }
  },
  persist: true,
  getters: {
    nameList: (state) => {
      return state.list.map((item) => item.name)
    },
  },
  actions: {
    setTagsItem(data: TagsItem) {
      const isExist = this.list.find((item) => item.path === data.path)
      if (!isExist) this.list.push(data)
    },
    closeTagsItem(index: number) {
      this.list.splice(index, 1)
    },
    closeLeftTagsItem(index: number) {
      this.list = this.list.slice(index)
    },
    closeRightTagsItem(index: number) {
      this.list = this.list.slice(0, index + 1)
    },
    closeOtherTags(index: number) {
      this.list = this.list.slice(index, index + 1)
    },
    clearTags() {
      this.list = []
    },
  },
})
