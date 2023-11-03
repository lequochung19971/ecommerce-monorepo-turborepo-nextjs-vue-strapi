<script setup lang="ts">
import { useField } from 'vee-validate'
import { type HTMLAttributes, type LabelHTMLAttributes } from 'vue'
import type { BaseFieldProps } from './baseFieldProps'
type EditorFieldProps = BaseFieldProps & {
  labelProps?: LabelHTMLAttributes
  containerProps?: HTMLAttributes
}
const props = defineProps<EditorFieldProps>()
const { value, errorMessage } = useField<string>(props.name)
</script>
<template>
  <div v-bind="props.containerProps" class="flex flex-col">
    <label v-bind="props.labelProps" class="mb-2">{{ props.label }}</label>
    <Editor v-model="value" v-bind="$attrs" />
    <small class="p-error" id="editor-error">{{ errorMessage }}</small>
  </div>
</template>

<style scoped></style>
