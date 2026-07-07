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
import { computed, type CSSProperties } from 'vue'
import Bar from './Bar.vue'
import { useScrollbar } from './useScrollbar'
import "./scrollbar.scss"

const props = withDefaults(
  defineProps<{
    height?: string | number
    maxHeight?: string | number
    native?: boolean
    wrapStyle?: CSSProperties
    wrapClass?: string | string[]
    viewStyle?: CSSProperties
    viewClass?: string | string[]
    noresize?: boolean
    always?: boolean
    minSize?: number
    id?: string
    class?: string
    tag?: string
  }>(),
  {
    native: false,
    noresize: false,
    always: false,
    minSize: 20,
    tag: 'div',
  }
)

const emit = defineEmits<{
  (e: 'scroll', payload: { scrollTop: number; scrollLeft: number }): void
}>()

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
  emit as (event: 'scroll', payload: { scrollTop: number; scrollLeft: number }) => void
)

defineExpose({
  wrapRef,
  scrollTo,
  setScrollTop,
  setScrollLeft,
  update,
})
</script>
