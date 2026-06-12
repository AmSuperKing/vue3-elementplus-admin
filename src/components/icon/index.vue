<script lang="ts">
import { createVNode, resolveComponent, defineComponent, computed, type ExtractPropTypes } from 'vue'
import type { CSSProperties } from 'vue'
import svg from '@/components/Icon/svg/index.vue'
import { isExternal } from '@/utils/common'

// 定义 props 选项对象，以便提取类型
const iconProps = {
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: '18px',
  },
  color: {
    type: String,
    default: 'inherit',
  },
}

export default defineComponent({
  name: 'Icon',
  props: iconProps,
  setup(props: ExtractPropTypes<typeof iconProps>) {
    const iconStyle = computed((): CSSProperties => {
      const { size, color } = props
      // 优化：防止 size 为空或非字符串导致 replace 报错
      const s = size ? `${size.replace('px', '')}px` : '18px'
      return {
        fontSize: s,
        color: color,
      }
    })

    // 注意：在 setup 中直接根据 props 返回不同的渲染函数是可行的，
    // 但需确保 props.name 在组件挂载时已存在。
    // 由于 props 是响应式的，如果 name 动态变化，这种写法可能不会重新评估条件。
    // 更稳健的做法是在 render 函数内部判断，或者使用 computed 包裹整个 vnode 逻辑。
    // 此处仅修复类型报错，保留原有逻辑结构。

    const iconName = props.name || ''

    if (iconName.indexOf('el-icon-') === 0) {
      return () => createVNode('el-icon', { class: 'icon el-icon', style: iconStyle.value }, [createVNode(resolveComponent(iconName))])
    } else if (iconName.indexOf('svg-') === 0 || isExternal(iconName)) {
      return () => createVNode(svg, { name: iconName, size: props.size, color: props.color, class: 'icon el-icon' })
    } else {
      return () => createVNode(resolveComponent(iconName), { class: 'icon el-icon', style: iconStyle.value })
    }
  },
})
</script>
