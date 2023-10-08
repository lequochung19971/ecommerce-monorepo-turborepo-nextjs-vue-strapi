<script setup lang="ts">
import type { InputTextProps } from 'primevue/inputtext'
import { Field } from 'vee-validate'
import { type HTMLAttributes, type LabelHTMLAttributes } from 'vue'
import type { BaseFieldProps } from './baseFieldProps'
interface InputTextFieldProps extends /* @vue-ignore */ InputTextProps, BaseFieldProps {
  label?: string
  name: string
  labelProps?: LabelHTMLAttributes
  containerProps?: HTMLAttributes
}
const props = defineProps<InputTextFieldProps>()
</script>

<template>
  <div v-bind="props.containerProps" class="flex flex-col">
    <Field :name="props.name" #="{ field, errorMessage }">
      <label v-bind="props.labelProps" class="mb-2">{{ props.label }}</label>
      <InputText
        v-bind="{
          ...$attrs,
          ...props,
          ...field
        }"
        :class="{
          'p-invalid': !!errorMessage
        }"
      />
      <small class="p-error" id="text-error">{{ errorMessage }}</small>
    </Field>
  </div>
</template>

<style scoped></style>
