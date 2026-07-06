<template>
  <div class="cus-pagination" :class="{ 'is-background': showBackground }" :style="userThemeConfig">
    <template v-for="layoutItem of pageLayout" :key="layoutItem">
      <!-- 总数显示 -->
      <span v-if="layoutItem === 'total' && (showTotal || $slots.total)" class="cus-pagination__total">
        <slot name="total" :total="total">共 {{ total }} 条</slot>
      </span>

      <!-- 每页条数选择器（自定义下拉） -->
      <div
        v-if="layoutItem === 'sizes' && (showSizes || $slots.sizes)"
        class="cus-pagination__sizes"
        v-click-outside="closeDropdown"
      >
        <slot name="sizes" :page-size="internalPageSize">
          <div
            class="size-selector"
            :class="{ 'is-open': dropdownVisible, 'is-disabled': disabled }"
            @click="toggleDropdown"
          >
            <span class="size-selector__value">{{ internalPageSize }}条/页</span>
            <span class="size-selector__arrow" :class="{ 'is-reverse': dropdownVisible }">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M831.872 340.864 512 652.672 192.128 340.864a30.59 30.59 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.59 30.59 0 0 0-42.752 0z"></path></svg>
            </span>
          </div>

          <Transition name="dropdown-fade">
            <ul v-show="dropdownVisible" class="size-dropdown">
              <li
                v-for="size in pageSizes"
                :key="size"
                class="size-dropdown__item"
                :class="{ 'is-active': internalPageSize === size }"
                @click.stop="handleSizeSelect(size)"
              >
                {{ size }}条/页
              </li>
            </ul>
          </Transition>
        </slot>
      </div>

      <!-- 上一页 -->
      <button
        v-if="layoutItem === 'prev'"
        class="cus-pagination__btn cus-pagination__prev"
        :disabled="internalCurrentPage <= 1 || disabled"
        @click="handlePrev"
      >
        <slot name="prev">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.59 30.59 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.59 30.59 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0"></path></svg>
        </slot>
      </button>

      <!-- 页码列表 -->
      <ul v-if="layoutItem === 'pager'" class="cus-pagination__pager">
        <!-- 第一页 -->
        <li
          v-if="showFirstLast || firstPager !== 1"
          class="cus-pagination__item"
          :class="{ active: internalCurrentPage === 1 }"
          @click="handlePageChange(1)"
        >
          1
        </li>

        <!-- 左省略号 -->
        <li v-if="firstPager > 2" class="cus-pagination__item cus-pagination__ellipsis">
          <slot name="left-ellipsis">...</slot>
        </li>

        <!-- 中间页码 -->
        <li
          v-for="pager in pagers"
          :key="pager"
          class="cus-pagination__item"
          :class="{ active: internalCurrentPage === pager }"
          @click="handlePageChange(pager)"
        >
          {{ pager }}
        </li>

        <!-- 右省略号 -->
        <li v-if="lastPager < totalPages - 1" class="cus-pagination__item cus-pagination__ellipsis">
          <slot name="right-ellipsis">...</slot>
        </li>

        <!-- 最后一页 -->
        <li
          v-if="showFirstLast || lastPager !== totalPages"
          class="cus-pagination__item"
          :class="{ active: internalCurrentPage === totalPages }"
          @click="handlePageChange(totalPages)"
        >
          {{ totalPages }}
        </li>
      </ul>

      <!-- 下一页 -->
      <button
        v-if="layoutItem === 'next'"
        class="cus-pagination__btn cus-pagination__next"
        :disabled="internalCurrentPage >= totalPages || disabled"
        @click="handleNext"
      >
        <slot name="next">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M340.864 149.312a30.59 30.59 0 0 0 0 42.752L652.736 512 340.864 831.872a30.59 30.59 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"></path></svg>
        </slot>
      </button>

      <!-- 跳转输入框 -->
      <div v-if="layoutItem === 'jumper' && (showJumper || $slots.jumper)" class="cus-pagination__jumper">
        <slot name="jumper" :current-page="internalCurrentPage">
          前往
          <input
            type="number"
            min="1"
            :max="totalPages"
            :value="jumpValue"
            :disabled="disabled"
            @keydown.enter="handleJump"
            @blur="handleJump"
          />
          页
        </slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type DirectiveBinding } from 'vue'
import { hexToRgba, rgbaToHex6 } from './colorUtils'

// ==================== Types ====================

type LayoutItem = 'sizes' | 'prev' | 'pager' | 'next' | 'jumper' | '->' | 'total';
type Layout = LayoutItem[];

/**
 * 分页组件属性
 * @description 配置项
 * @param {number} [currentPage=1] 当前页码 current-page / v-model:current-page
 * @param {number} [pageSize=10] 每页条数 pageSize / v-model:page-size
 * @param {number} [total=0] 总数
 * @param {number[]} [pageSizes=[10, 20, 30, 50, 100]] 每页条数选项
 * @param {boolean} [showTotal=false] 是否显示总数
 * @param {boolean} [showSizes=false] 是否显示每页条数选择器
 * @param {boolean} [showJumper=false] 是否显示跳转输入框
 * @param {boolean} [showFirstLast=false] 是否显示第一页和最后一页
 * @param {boolean} [showBackground=false] 是否使用背景色
 * @param {string} [backgroundColor] 背景色
 * @param {boolean} [disabled=false] 是否禁用
 * @param {number} [pagerCount=7] 页码按钮的数量
 * @param {boolean} [hideOnSinglePage=false] 单页时是否隐藏分页器
 * @param {Layout} [layout=['prev', 'pager', 'next', 'sizes', 'jumper', 'total']] 布局配置
 * @param {string} [size='default'] 分页器大小
 * @param {string} [theme='default'] 主题
 * @param {string} [textColor] 文字颜色
 * @param {string} [borderColor] 边框颜色
 * @param {string} [hoverBg] 鼠标悬停背景色
 * @param {string} [activeColor] 激活颜色
 * @param {string} [activeBg] 激活背景色
 */
interface PaginationProps {
  currentPage?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
  showTotal?: boolean
  showSizes?: boolean
  showJumper?: boolean
  showFirstLast?: boolean
  showBackground?: boolean
  backgroundColor?: string
  disabled?: boolean
  pagerCount?: number
  hideOnSinglePage?: boolean
  layout?: Layout | string;
  size?: 'small' | 'default' | 'large'
  theme?: string
  textColor?: string
  borderColor?: string
  hoverBg?: string
  activeColor?: string
  activeBg?: string
}

// ==================== Props & Emits ====================
const props = withDefaults(defineProps<PaginationProps>(), {
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pageSizes: () => [10, 20, 30, 50, 100],
  showTotal: false,
  showSizes: false,
  showJumper: false,
  showFirstLast: false,
  showBackground: false,
  disabled: false,
  pagerCount: 7,
  hideOnSinglePage: false,
  size: 'default',
  theme: '#409eff',
})

const emit = defineEmits<{
  /** 当前页改变时触发 */
  (e: 'update:currentPage', val: number): void
  /** 每页条数改变时触发 */
  (e: 'update:pageSize', val: number): void
  /** 当前页改变时触发（兼容EP） */
  (e: 'current-change', val: number): void
  /** 每页条数改变时触发（兼容EP） */
  (e: 'size-change', val: number): void
  /** 当前页或每页条数改变后触发 */
  (e: 'change', currentPage: number, pageSize: number): void
}>()

// ==================== 内部状态 ====================
const internalCurrentPage = ref(props.currentPage)
const internalPageSize = ref(props.pageSize)
const jumpValue = ref<number | ''>('')
const dropdownVisible = ref(false)

// 同步外部 props 变化
watch(() => props.currentPage, (val) => { internalCurrentPage.value = val })
watch(() => props.pageSize, (val) => { internalPageSize.value = val })

// ==================== Computed ====================
const userThemeConfig = computed(() => {
  const sizeMap = {
    small: {
      '--page-height': '28px',
      '--page-radius': '4px',
      '--page-font-size': '12px',
    },
    default: {
      '--page-height': '32px',
      '--page-radius': '4px',
      '--page-font-size': '14px',
    },
    large: {
      '--page-height': '36px',
      '--page-radius': '6px',
      '--page-font-size': '16px',
    },
  }

  let styleVars: Record<string, string> = {
    '--page-primary': '#409eff',
    '--page-primary-light': '#ecf5ff',
    '--page-text': '#666',
    '--page-border': '#dcdfe6',
    '--page-hover-bg': '#f5f5f5',
    '--page-active-text-color': '#333',
    '--page-active-bg': '#409eff'
  }
  if (props.theme) {
    styleVars['--page-primary'] = props.theme
    styleVars['--page-primary-light'] = rgbaToHex6(hexToRgba(props.theme, 0.045))
    styleVars['--page-active-text-color'] = '#fff'
    styleVars['--page-active-bg'] = props.theme
  }
  if (props.showBackground) {
    styleVars['--page-bg'] = props.backgroundColor || 'var(--page-primary-light, #f4f4f5)'
  }
  if (props.size && sizeMap[props.size]) styleVars = { ...styleVars, ...sizeMap[props.size] }
  if (props.textColor) styleVars['--page-text'] = props.textColor
  if (props.borderColor) styleVars['--page-border'] = props.borderColor
  if (props.hoverBg) styleVars['--page-hover-bg'] = props.hoverBg

  if (props.activeColor) styleVars['--page-active-text-color'] = props.activeColor
  if (props.activeBg) styleVars['--page-active-bg'] = props.activeBg

  return styleVars
})


const totalPages = computed(() => Math.max(1, Math.ceil(props.total / internalPageSize.value)))

// 计算需要显示的页码数组
const pagers = computed(() => {
  const total = totalPages.value
  const current = internalCurrentPage.value
  const count = props.pagerCount

  // 如果总页数 <= pagerCount，全部显示
  if (total <= count) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  // 半窗口大小
  const half = Math.floor((count - 2) / 2)
  let start = current - half
  let end = current + half

  // 调整边界：保证中间区域始终有 (count-2) 个页码
  if (start < 2) {
    start = 2
    end = start + count - 3
  }
  if (end > total - 1) {
    end = total - 1
    start = end - (count - 3)
  }

  const pages: number[] = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

/** 提取边界页码 */
const firstPager = computed(() => pagers.value[0] ?? 1)
const lastPager = computed(() => pagers.value[pagers.value.length - 1] ?? totalPages.value)

const VALID_LAYOUT_ITEMS: readonly LayoutItem[] = [
  'sizes', 'prev', 'pager', 'next', 'jumper', 'total'
] as const;
const DEFAUKT_LAYOUT: Layout = ['prev', 'pager', 'next', 'sizes', 'jumper', 'total'];

function parseLayout(input: string): Layout {
  const items = input
    .split(',')
    .map(s => s.trim())
    .filter(Boolean) as LayoutItem[];

  // 校验每个元素是否合法
  for (const item of items) {
    if (!VALID_LAYOUT_ITEMS.includes(item)) {
      return DEFAUKT_LAYOUT
    }
  }

  // 校验是否重复
  if (new Set(items).size !== items.length) {
    const duplicates = items.filter(
      (item, index) => items.indexOf(item) !== index
    );
    return [...new Set(duplicates)]
  }

  return items;
}

function resolveLayout(layout: PaginationProps['layout']): Layout {
  if (!layout) {
    return DEFAUKT_LAYOUT; // 默认值
  }
  if (typeof layout === 'string') {
    return parseLayout(layout);
  }
  return layout;
}

const pageLayout = computed(() => resolveLayout(props.layout))

// ==================== 事件处理Handlers ====================
function setPage(page: number) {
  const clamped = Math.min(Math.max(1, page), totalPages.value)
  if (clamped === internalCurrentPage.value) return

  internalCurrentPage.value = clamped
  emit('update:currentPage', clamped)
  emit('current-change', clamped)
  emit('change', clamped, internalPageSize.value)
}

function handlePrev() {
  if (props.disabled) return
  setPage(internalCurrentPage.value - 1)
}

function handleNext() {
  if (props.disabled) return
  setPage(internalCurrentPage.value + 1)
}

function handlePageChange(page: number) {
  if (props.disabled) return
  setPage(page)
}

function toggleDropdown() {
  if (props.disabled) return
  dropdownVisible.value = !dropdownVisible.value
}

function closeDropdown() {
  dropdownVisible.value = false
}

function handleSizeSelect(size: number) {
  internalPageSize.value = size
  dropdownVisible.value = false

  emit('update:pageSize', size)
  emit('size-change', size)

  // 重新计算当前页，确保不超出范围
  const newTotalPages = Math.max(1, Math.ceil(props.total / size))
  const newPage = Math.min(internalCurrentPage.value, newTotalPages)
  if (newPage !== internalCurrentPage.value) {
    setPage(newPage)
  } else {
    emit('change', internalCurrentPage.value, size)
  }
}

function handleJump(e: Event) {
  if (props.disabled) return
  const target = e.target as HTMLInputElement
  const val = parseInt(target.value, 10)
  if (!isNaN(val)) {
    setPage(val)
  }
  jumpValue.value = ''
}

// ==================== Click Outside Directive ====================
const clickOutsideMap = new WeakMap<HTMLElement, (e: MouseEvent) => void>()
const vClickOutside = {
  mounted(el: HTMLElement, binding: DirectiveBinding<() => void>) {
    const handler = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) binding.value()
    }
    clickOutsideMap.set(el, handler)
    document.addEventListener('click', handler)
  },
  unmounted(el: HTMLElement) {
    const handler = clickOutsideMap.get(el)
    if (handler) {
      document.removeEventListener('click', handler)
      clickOutsideMap.delete(el)
    }
  },
}
</script>

<style scoped>
/* ========== CSS Variables (Theme Tokens) ========== */
.cus-pagination {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: var(--page-font-size);
  color: var(--page-text);
  user-select: none;
}

/* ========== Total ========== */
.cus-pagination__total {
  margin-right: 8px;
}

/* ========== Custom Size Selector ========== */
.cus-pagination__sizes {
  position: relative;
  display: inline-block;
}

.size-selector {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: var(--page-height);
  padding: 0 8px;
  border: 1px solid var(--page-border);
  border-radius: var(--page-radius);
  font-size: var(--page-font-size);
  color: var(--page-text);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  background: var(--page-bg);
}
.size-selector:hover:not(.is-disabled) {
  border-color: var(--page-primary);
  color: var(--page-primary);
}
.size-selector.is-open {
  border-color: var(--page-primary);
  color: var(--page-primary);
}
.size-selector.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.size-selector__arrow {
  width: 12px;
  height: 12px;
  font-size: 12px;
  transition: transform 0.2s;
}
.size-selector__arrow.is-reverse {
  transform: rotate(180deg);
}

/* ========== Dropdown Panel ========== */
.size-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 10;
  min-width: 100%;
  margin: 0;
  padding: 6px 0;
  list-style: none;
  background: var(--page-bg, #fff);
  border: 1px solid var(--page-border);
  border-radius: var(--page-radius);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.size-dropdown__item {
  padding: 0 12px;
  line-height: 32px;
  font-size: var(--page-font-size);
  color: var(--page-text);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}
.size-dropdown__item:hover {
  background: var(--page-hover-bg);
}
.size-dropdown__item.is-active {
  color: var(--page-primary);
  font-weight: 700;
}

/* ========== Dropdown Transition ========== */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ========== Prev / Next Buttons ========== */
.cus-pagination__btn {
  min-width: var(--page-height);
  height: var(--page-height);
  padding: 0 6px;
  border: 1px solid var(--page-border);
  border-radius: var(--page-radius);
  background: var(--page-bg);;
  cursor: pointer;
  font-size: var(--page-font-size);
  line-height: var(--page-height);
  transition: all 0.2s;
  color: var(--page-text);
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.cus-pagination__btn:hover:not(:disabled) {
  color: var(--page-primary);
  border-color: var(--page-primary);
}
.cus-pagination__btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* ========== Pager List ========== */
.cus-pagination__pager {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 4px;
}
.cus-pagination__item {
  min-width: var(--page-height);
  height: var(--page-height);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--page-radius);
  cursor: pointer;
  transition: all 0.2s;
  padding: 0 4px;
}
.cus-pagination__item:hover:not(.active):not(.cus-pagination__ellipsis) {
  color: var(--page-primary);
}
.cus-pagination__item.active {
  color: var(--page-active-text-color);
  background-color: var(--page-active-bg);
  font-weight: 700;
}
.cus-pagination__ellipsis {
  cursor: default;
  letter-spacing: 2px;
}

/* ========== Background Mode ========== */
.cus-pagination.is-background .cus-pagination__btn,
.cus-pagination.is-background .cus-pagination__item:not(.active):not(.cus-pagination__ellipsis) {
  background-color: var(--page-bg);;
  border-color: transparent;
}
.cus-pagination.is-background .cus-pagination__item.active {
  background-color: var(--page-active-bg);
  color: var(--page-active-text-color);
}

/* ========== Jumper ========== */
.cus-pagination__jumper {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
}
.cus-pagination__jumper input {
  width: 50px;
  height: var(--page-height);
  padding: 0 4px;
  border: 1px solid var(--page-border);
  border-radius: var(--page-radius);
  text-align: center;
  outline: none;
  font-size: 13px;
  -moz-appearance: textfield;
}
.cus-pagination__jumper input::-webkit-inner-spin-button,
.cus-pagination__jumper input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.cus-pagination__jumper input:focus {
  border-color: var(--page-primary);
}
</style>
