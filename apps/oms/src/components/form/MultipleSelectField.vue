<script setup lang="ts">
import { Field, useField } from 'vee-validate'
import { type HTMLAttributes, type LabelHTMLAttributes, useAttrs, computed } from 'vue'
import type { BaseFieldProps } from './baseFieldProps'
import ReadOnlyText from './ReadOnlyText.vue'
import type { MultiSelectProps, MultiSelectSlots } from 'primevue/multiselect'
interface MultipleSelectFieldProps extends /* @vue-ignore */ MultiSelectProps, BaseFieldProps {
  labelProps?: LabelHTMLAttributes
  containerProps?: HTMLAttributes
}
const props = defineProps<MultipleSelectFieldProps>()
defineSlots<MultiSelectSlots>()
const { options } = useAttrs() as MultiSelectProps
const { value, errorMessage, handleChange, handleBlur } = useField(props.name)
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
    <Field :name="props.name" #="{ field, errorMessage }">
      <label v-bind="props.labelProps" class="mb-2">{{ props.label }}</label>
      <MultiSelect
        v-bind="$attrs"
        v-model="value"
        @blur="field.onBlur($event as unknown as Event)"
        :class="{
          'p-invalid': !!errorMessage
        }"
      />
      <small class="p-error" id="multiple-select-error">{{ errorMessage }}</small>
    </Field>
  </div>
</template>

<style scoped></style>
