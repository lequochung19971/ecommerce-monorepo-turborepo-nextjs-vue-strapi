<script setup lang="ts">
import Card, { type CardSlots } from 'primevue/card'
import type { Media } from 'types'

const VITE_API_URL = import.meta.env.VITE_API_URL

const props = defineProps<Media>()
defineSlots<Pick<CardSlots, 'footer'>>()
</script>

<template>
  <Card
    :pt="{
      body: '!p-4',
      title: '!leading-3 overflow-hidden text-ellipsis'
    }"
  >
    <template #header>
      <div class="h-36 flex justify-center bg-gray-dee rounded-t-md">
        <img
          class="h-full"
          :src="`${VITE_API_URL}${props.url}`"
          :alt="`${VITE_API_URL}${props.alternativeText}`"
        />
      </div>
    </template>
    <template #title>
      <span class="text-base font-bold" :title="props.name">
        {{ props.name }}
      </span>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Card>
</template>

<style scoped></style>
