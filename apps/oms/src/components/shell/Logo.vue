<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

interface Props extends /* @vue-ignore */ HTMLAttributes {}
const props = defineProps<Props>()
</script>
<template>
  <div v-bind="props" class="app-logo">
    <span>LOGO</span>
  </div>
</template>

<style lang="scss" scoped>
.app-logo {
  @apply h-fit flex justify-center items-center;
  span {
    @apply border-2 border-solid border-gray-800 py-1 px-4 text-xl;
  }
}
</style>
