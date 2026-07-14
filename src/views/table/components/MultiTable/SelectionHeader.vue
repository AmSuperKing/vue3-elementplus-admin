<!-- SelectionHeader.vue -->
<template>
  <label
    v-if="selectMode === 'checkbox'"
    :class="[
      'custom-checkbox',
      { 'custom-checkbox-small': size === 'small' },
      { 'custom-checkbox-large': size === 'large' }
    ]"
    @click.stop
  >
    <input
      type="checkbox"
      :checked="isAllSelected"
      :indeterminate.prop="isIndeterminate"
      @change="$emit('toggleSelectAll')"
    />
    <span class="checkmark"></span>
  </label>
  <!-- radio 模式下表头不渲染选择控件 -->
</template>

<script setup lang="ts">
defineProps<{
  /** 控件尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 选择模式 */
  selectMode: 'radio' | 'checkbox'
  /** 是否全选 */
  isAllSelected: boolean
  /** 是否半选（ indeterminate 状态） */
  isIndeterminate: boolean
}>()

defineEmits<{
  (e: 'toggleSelectAll'): void
}>()
</script>

<style scoped>
/* ====== 自定义 Checkbox ====== */
.custom-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  width: 18px;
  height: 18px;
  margin: 4px auto;
  overflow: hidden;
}
.custom-checkbox-large {
  width: 22px;
  height: 22px;
}
.custom-checkbox-small {
  width: 14px;
  height: 14px;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  z-index: 1;
  margin: 0;
}

.custom-checkbox .checkmark {
  width: 16px;
  height: 16px;
  border: 1px solid var(--table-selector-border-color, #d9d9d9);
  border-radius: 3px;
  background-color: var(--table-selector-color, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.custom-checkbox-large .checkmark {
  width: 20px;
  height: 20px;
}
.custom-checkbox-small .checkmark {
  width: 12px;
  height: 12px;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: var(--table-selector-checked-color, #1890ff);
  border-color: var(--table-selector-checked-color, #1890ff);
}

.custom-checkbox input:checked ~ .checkmark::after {
  content: '';
  display: inline-block;
  width: 5px;
  height: 9px;
  border-style: solid;
  border-color: #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}

/* 半选状态 */
.custom-checkbox input:indeterminate ~ .checkmark {
  background-color: var(--table-selector-checked-color, #1890ff);
  border-color: var(--table-selector-checked-color, #1890ff);
}

.custom-checkbox input:indeterminate ~ .checkmark::after {
  content: '';
  display: inline-block;
  width: 8px;
  height: 2px;
  background-color: #fff;
}

.custom-checkbox input:disabled,
.custom-checkbox input:disabled ~ .checkmark {
  background-color: #f5f7fa;
  cursor: not-allowed;
}

.custom-checkbox input:not(:disabled):hover ~ .checkmark {
  border-color: var(--table-selector-checked-color, #1890ff);
}
</style>
