<script lang="ts">
import { createVNode, resolveComponent, defineComponent, computed } from 'vue'
import type { CSSProperties } from 'vue'
import svg from '@/components/icon/svg/index.vue'
import { isExternal } from '@/utils/common'

export default defineComponent({
  name: 'Icon',
  props: {
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
      default: '#666666',
    },
  },
  setup(props) {
    const iconStyle = computed((): CSSProperties => {
      const { size, color } = props
      let s = `${size.replace('px', '')}px`
      return {
        fontSize: s,
        color: color,
      }
    })

    if (props.name.indexOf('el-icon-') === 0) {
      return () => createVNode('el-icon', { class: 'icon el-icon', style: iconStyle.value }, [createVNode(resolveComponent(props.name))])
    } else if (props.name.indexOf('svg-') === 0 || isExternal(props.name)) {
      return () => createVNode(svg, { name: props.name, size: props.size, color: props.color, class: 'icon el-icon' })
    } else {
      // return () => createVNode('i', { class: [props.name, 'icon'], style: iconStyle.value })
      return () => createVNode(resolveComponent(props.name), { class: 'icon el-icon', style: iconStyle.value })
    }
  },
})
</script>
