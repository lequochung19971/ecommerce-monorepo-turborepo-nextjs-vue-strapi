<script setup lang="ts">
import type { LabelHTMLAttributes, HTMLAttributes } from 'vue'

type ReadOnlyTextProps = {
  label?: string
  text?: string | number
  labelProps?: LabelHTMLAttributes
  containerProps?: HTMLAttributes
  textProps?: HTMLAttributes
}
const props = defineProps<ReadOnlyTextProps>()
</script>
<template>
  <div v-bind="props.containerProps" class="flex flex-col">
    <label v-bind="props.labelProps" class="mb-2">{{ props.label }}</label>
    <span class="opacity-80" v-bind="props.textProps"> {{ props.text || '--' }}</span>
  </div>
</template>

<style scoped></style>
