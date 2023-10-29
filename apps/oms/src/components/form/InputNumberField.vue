<script setup lang="ts">
import { Field, useField } from 'vee-validate'
import { type HTMLAttributes, type LabelHTMLAttributes } from 'vue'
import type { BaseFieldProps } from './baseFieldProps'
import ReadOnlyText from './ReadOnlyText.vue'
import type { InputNumberProps } from 'primevue/inputnumber'
interface InputNumberFieldProps extends /* @vue-ignore */ InputNumberProps, BaseFieldProps {
  label?: string
  name: string
  labelProps?: LabelHTMLAttributes
  containerProps?: HTMLAttributes
}
const props = defineProps<InputNumberFieldProps>()
const { value, errorMessage } = useField<string>(props.name)
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
      <label v-bind="props.labelProps" class="mb-2">{{ props.label }}</label>
      <InputNumber
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
