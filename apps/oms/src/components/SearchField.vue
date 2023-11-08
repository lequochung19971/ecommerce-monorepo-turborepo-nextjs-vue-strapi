<script setup lang="ts">
import { throttle } from 'lodash'
const props = withDefaults(
  defineProps<{
    modelValue?: string
    wait?: number
    className?: string
  }>(),
  {
    wait: 250,
    className: ''
  }
)
const emit = defineEmits<{
  (e: 'search', event: Event): void
  (e: 'update:modelValue', event: string): void
}>()

const handleOnInputThrottle = throttle((e) => {
  emit('search', e)
  emit('update:modelValue', e.target.value)
}, props.wait)
</script>
<template>
  <span :class="['p-input-icon-left', props.className]">
    <i class="pi pi-search"></i>
    <InputText placeholder="Search" @input="handleOnInputThrottle" />
  </span>
</template>

<style scoped></style>
