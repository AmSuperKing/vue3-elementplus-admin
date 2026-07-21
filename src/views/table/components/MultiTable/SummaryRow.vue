<!-- SummaryRow.vue -->
<template>
  <tfoot v-if="showSummary" class="multi-table__summary-tfoot">
    <tr class="multi-table__summary-row">
      <td
        v-for="col in leafColumns"
        :key="'summary-' + col.dataIndex"
        :class="[
          'multi-table__td',
          'multi-table__summary-td',
          size === 'small' ? 'multi-table__td-small' : '',
          size === 'small' ? 'multi-table__summary-td-small' : '',
          size === 'large' ? 'multi-table__td-large' : '',
          size === 'large' ? 'multi-table__summary-td-large' : '',
          col.align ? `align-${col.align}` : '',
          col.fixed === 'left' ? 'is-fixed-left' : '',
          col.fixed === 'right' ? 'is-fixed-right' : '',
          col.dataIndex === lastColumnKey ? 'is-last-column' : '',
        ]"
        :style="getSummaryCellStyle(col)"
      >
        <div class="td-content">
          <slot
            :name="`summary_${col.dataIndex}`"
            :column="col"
            :value="summaryCells[getLeafColKey(col)]"
          >
            <span>{{ summaryCells[getLeafColKey(col)] }}</span>
          </slot>
        </div>
      </td>
    </tr>
  </tfoot>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { LeafColumn } from './types'
import { getLeafColKey } from './composables/useColumns'
import "./style.css"

defineProps<{
  showSummary: boolean
  size: 'small' | 'default' | 'large'
  leafColumns: LeafColumn[]
  lastColumnKey: string
  summaryCells: Record<string, string>
  getSummaryCellStyle: (col: LeafColumn) => CSSProperties
}>()
</script>
