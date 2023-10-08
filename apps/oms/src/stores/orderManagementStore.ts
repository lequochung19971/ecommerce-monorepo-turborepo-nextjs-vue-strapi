import { defineStore } from 'pinia'
import { StoreId } from '@/types/storeId'
import type { useQuery } from '@tanstack/vue-query'

export const useOrderManagementStore = defineStore(StoreId.ORDER_MANAGEMENT, () => {
  type A = Parameters<typeof useQuery>
  return {}
})
