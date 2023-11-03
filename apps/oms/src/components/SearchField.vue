<script setup lang="ts">
import { throttle } from 'lodash'
const props = withDefaults(
  defineProps<{
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
}>()

const handleOnInputThrottle = throttle((e) => emit('search', e), props.wait)
</script>
<template>
  <span :class="['p-input-icon-left', props.className]">
    <i class="pi pi-search"></i>
    <InputText placeholder="Search" @input="handleOnInputThrottle" />
  </span>
</template>

<style scoped></style>
