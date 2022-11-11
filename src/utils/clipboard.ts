import { ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'

export default function copy2Clipboard(text: string) {
  const { toClipboard } = useClipboard()
  try {
    toClipboard(text)
    ElMessage.success('复制成功 Copy successfully')
  } catch (e) {
    ElMessage.error('复制失败 Copy failed' + e)
  }
}
