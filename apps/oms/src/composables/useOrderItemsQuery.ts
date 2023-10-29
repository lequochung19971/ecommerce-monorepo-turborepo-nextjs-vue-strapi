import httpClient from '@/httpClient'
import type { AxiosUseQuery } from '@/types/axiosUseQuery'
import { QueryKey } from '@/types/queryKey'
import { type QueryResponse } from '@/types/queryResponse'
import { useQuery } from '@tanstack/vue-query'
import type { OrderItem } from 'types'
import { ApiUrl } from 'types'
import { toValue } from 'vue'

export const useOrderItemsQuery: AxiosUseQuery<object, QueryResponse<OrderItem[]>> = (
  queryParams: object,
  opt = {}
) => {
  return useQuery({
    queryKey: [QueryKey.ORDER_ITEM, queryParams],
    queryFn: () =>
      httpClient.get(ApiUrl.ORDER_ITEMS, {
        params: toValue(queryParams)
      }),
    staleTime: 15000,
    ...opt
  })
}
