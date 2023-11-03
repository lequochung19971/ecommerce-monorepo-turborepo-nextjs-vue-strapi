<script setup lang="ts">
import type { InputTextEmits, InputTextProps, InputTextSlots } from 'primevue/inputtext'
import { Field, useField } from 'vee-validate'
import { useAttrs, type HTMLAttributes, type LabelHTMLAttributes, watch } from 'vue'
import type { BaseFieldProps } from './baseFieldProps'
import ReadOnlyText from './ReadOnlyText.vue'
interface InputTextFieldProps extends /* @vue-ignore */ InputTextProps, BaseFieldProps {
  label?: string
  name: string
  labelProps?: LabelHTMLAttributes
  containerProps?: HTMLAttributes
}

type ToDefinedEmit<
  T extends Record<keyof T, (...args: any) => void>,
  K extends keyof T = keyof T
> = (e: K, ...args: Parameters<T[K]>) => void

const props = defineProps<InputTextFieldProps>()
// const emits = defineEmits<ToDefinedEmit<InputTextEmits>>()
defineSlots<InputTextSlots>()
const attrs = useAttrs()
const { value } = useField<string>(props.name)
</script>

<template>
  <template v-if="props.readOnly">
    <ReadOnlyText
      :text="value"
      :label="props.label"
      :labelProps="props.labelProps"
      :containerProps="props.containerProps"
    ></ReadOnlyText>
  </template>
  <div v-else v-bind="props.containerProps" class="flex flex-col">
    <Field :name="props.name" #="{ field, errorMessage }">
      <label v-bind="props.labelProps" class="mb-2"
        >{{ props.label }} {{ attrs.required ? '*' : '' }}</label
      >
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
