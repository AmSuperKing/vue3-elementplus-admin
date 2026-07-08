<template>
  <div
    ref="scrollbarRef"
    :id="id"
    :class="['cus-scrollbar', className]"
  >
    <div
      ref="wrapRef"
      :class="[
        'cus-scrollbar__wrap',
        wrapClass,
        { 'cus-scrollbar__wrap--hidden-default': !native },
      ]"
      :style="wrapStyle"
      @scroll="handleScroll"
    >
      <component
        :is="tag"
        :class="['cus-scrollbar__view', viewClass]"
        :style="viewStyle"
      >
        <slot />
      </component>
    </div>

    <template v-if="!native">
      <Bar
        :always="always"
        :min-size="minSize"
        :vertical="true"
      />
      <Bar
        :always="always"
        :min-size="minSize"
        :vertical="false"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Bar from './Bar.vue'
import { useScrollbar } from './useScrollbar'
import type { ScrollbarProps, ScrollbarEmits } from './types'
import "./scrollbar.scss"

const props = withDefaults(
  defineProps<ScrollbarProps>(),
  {
    native: false,
    noresize: false,
    always: false,
    minSize: 20,
    tag: 'div',
    distance: 0
  }
)

const emit = defineEmits<ScrollbarEmits>()

const className = computed(() => props.class)

const {
  scrollbarRef,
  wrapRef,
  wrapStyle,
  handleScroll,
  scrollTo,
  setScrollTop,
  setScrollLeft,
  update,
} = useScrollbar(
  props,
  emit
)

defineExpose({
  wrapRef,
  scrollTo,
  setScrollTop,
  setScrollLeft,
  update,
})
</script>
