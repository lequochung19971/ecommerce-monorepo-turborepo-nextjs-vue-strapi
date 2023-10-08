<script setup lang="ts">
import type { DropdownProps, DropdownSlots } from 'primevue/dropdown'
import { Field, useField } from 'vee-validate'
import { watch, type HTMLAttributes, type LabelHTMLAttributes } from 'vue'
import type { BaseFieldProps } from './baseFieldProps'
interface DropdownFieldProps extends /* @vue-ignore */ DropdownProps, BaseFieldProps {
  labelProps?: LabelHTMLAttributes
  containerProps?: HTMLAttributes
}
const props = defineProps<DropdownFieldProps>()
defineSlots<DropdownSlots>()
const { value, errorMessage } = useField(props.name)
watch(value, (v) => console.log(v))
</script>

<template>
  <div v-bind="props.containerProps" class="flex flex-col">
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
