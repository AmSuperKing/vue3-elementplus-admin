import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTagsListStore = defineStore(
  'tagsList',
  () => {
    // State - 使用 ref
    const list = ref<TagsItem[]>([])

    // Getters - 使用 computed
    const nameList = computed(() => {
      return list.value.map((item: TagsItem) => item.name)
    })

    // Actions - 使用普通函数
    function setTagsItem(data: TagsItem) {
      const isExist = list.value.find((item: TagsItem) => item.path === data.path)
      if (!isExist) list.value.push(data)
    }

    function closeTagsItem(index: number) {
      list.value.splice(index, 1)
    }

    function closeLeftTagsItem(index: number) {
      list.value = list.value.slice(index)
    }

    function closeRightTagsItem(index: number) {
      list.value = list.value.slice(0, index + 1)
    }

    function closeOtherTags(index: number) {
      list.value = list.value.slice(index, index + 1)
    }

    function clearTags() {
      list.value = []
    }

    return {
      list,
      nameList,
      setTagsItem,
      closeTagsItem,
      closeLeftTagsItem,
      closeRightTagsItem,
      closeOtherTags,
      clearTags,
    }
  },
  {
    persist: true,
  },
)
