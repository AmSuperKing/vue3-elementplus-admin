<!-- SelectionCell.vue -->
<template>
  <!-- 多选模式 -->
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
      :checked="isSelected"
      :disabled="disabled"
      @change="$emit('toggle')"
    />
    <span class="checkmark"></span>
  </label>

  <!-- 单选模式 -->
  <label
    v-else
    :class="[
      'custom-radio',
      { 'custom-radio-small': size === 'small' },
      { 'custom-radio-large': size === 'large' }
    ]"
    @click.stop
  >
    <input
      type="radio"
      :name="radioName"
      :disabled="disabled"
      :checked="isSelected"
      @change="$emit('toggle')"
    />
    <span class="radiomark"></span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  /** 控件尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 选择模式 */
  selectMode: 'radio' | 'checkbox'
  /** 当前行是否被选中 */
  isSelected: boolean
  /** 当前行是否禁用选择 (由 selectableProps 计算得出) */
  disabled?: boolean
  /** Radio 模式下的 name 属性，用于保证同组互斥 (通常传入 tableId) */
  radioName?: string
}>()

defineEmits<{
  (e: 'toggle'): void
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
.custom-checkbox-large { width: 22px; height: 22px; }
.custom-checkbox-small { width: 14px; height: 14px; }

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
.custom-checkbox-large .checkmark { width: 20px; height: 20px; }
.custom-checkbox-small .checkmark { width: 12px; height: 12px; }

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

.custom-checkbox input:disabled,
.custom-checkbox input:disabled ~ .checkmark {
  background-color: #f5f7fa;
  cursor: not-allowed;
}

.custom-checkbox input:not(:disabled):hover ~ .checkmark {
  border-color: var(--table-selector-checked-color, #1890ff);
}

/* ====== 自定义 Radio ====== */
.custom-radio {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  width: 18px;
  height: 18px;
  margin: 4px auto;
}
.custom-radio-large { width: 22px; height: 22px; }
.custom-radio-small { width: 14px; height: 14px; }

.custom-radio input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  z-index: 1;
  margin: 0;
}

.custom-radio .radiomark {
  width: 16px;
  height: 16px;
  border: 1px solid var(--table-selector-border-color, #d9d9d9);
  border-radius: 50%;
  background-color: var(--table-selector-color, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.custom-radio-large .radiomark { width: 20px; height: 20px; }
.custom-radio-small .radiomark { width: 12px; height: 12px; }

.custom-radio input:checked ~ .radiomark {
  border-color: var(--table-selector-checked-color, #1890ff);
}

.custom-radio input:checked ~ .radiomark::after {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--table-selector-checked-color, #1890ff);
}
.custom-radio-large input:checked ~ .radiomark::after { width: 10px; height: 10px; }
.custom-radio-small input:checked ~ .radiomark::after { width: 6px; height: 6px; }

.custom-radio input:disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
}

.custom-radio input:not(:disabled):hover ~ .radiomark {
  border-color: var(--table-selector-checked-color, #1890ff);
}
</style>
