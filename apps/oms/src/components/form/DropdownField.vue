<script setup lang="ts">
import type { DropdownProps, DropdownSlots } from 'primevue/dropdown'
import { useField } from 'vee-validate'
import { type HTMLAttributes, type LabelHTMLAttributes, useAttrs, computed } from 'vue'
import type { BaseFieldProps } from './baseFieldProps'
import ReadOnlyText from './ReadOnlyText.vue'
interface DropdownFieldProps extends /* @vue-ignore */ DropdownProps, BaseFieldProps {
  labelProps?: LabelHTMLAttributes
  containerProps?: HTMLAttributes
}
const props = defineProps<DropdownFieldProps>()
defineSlots<DropdownSlots>()
const { options } = useAttrs() as DropdownProps
const { value, errorMessage } = useField(props.name)
const textReadOnly = computed(() => options?.find((o) => o.value === value.value)?.label ?? '')
</script>

<template>
  <template v-if="props.readOnly">
    <ReadOnlyText
      :text="textReadOnly"
      :label="props.label"
      :labelProps="props.labelProps"
      :containerProps="props.containerProps"
    />
  </template>
  <div v-else v-bind="props.containerProps" class="flex flex-col">
    <label v-bind="props.labelProps" class="mb-2">{{ props.label }}</label>
    <Dropdown
      v-bind="$attrs"
      v-model="value"
      :class="{
        'p-invalid': !!errorMessage
      }"
    />
    <small class="p-error" id="text-error">{{ errorMessage }}</small>
  </div>
</template>

<style scoped></style>
