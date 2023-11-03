import httpClient from '@/httpClient'
import type { AxiosUseQuery } from '@/types/axiosUseQuery'
import { QueryKey } from '@/types/queryKey'
import { type QueryResponse } from '@/types/queryResponse'
import { useQuery } from '@tanstack/vue-query'
import { ApiUrl, type OrderDetail } from 'types'
import { toValue } from 'vue'

export const useGetOrderDetailsQuery: AxiosUseQuery<object, QueryResponse<OrderDetail[]>> = (
  queryParams: any,
  opt = {}
) => {
  return useQuery({
    queryKey: [QueryKey.ORDER_DETAILS, queryParams],
    queryFn: () => {
      return httpClient.get(ApiUrl.ORDER_DETAILS, {
        params: toValue(queryParams)
      })
    },
    staleTime: 15 * 1000,
    ...opt
  })
}
