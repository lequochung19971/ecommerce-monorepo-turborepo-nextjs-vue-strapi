import httpClient from '@/httpClient'
import type { AxiosUseQuery } from '@/types/axiosUseQuery'
import { QueryKey } from '@/types/queryKey'
import { type QueryResponse } from '@/types/queryResponse'
import { useQuery } from '@tanstack/vue-query'
import { ApiUrl, type OrderDetail } from 'types'

export const useQueryOrderDetails: AxiosUseQuery<object, QueryResponse<OrderDetail[]>> = (
  queryParams: object,
  opt = {}
) => {
  return useQuery({
    queryKey: [QueryKey.ORDER_MANAGEMENT, queryParams],
    queryFn: () =>
      httpClient.get(ApiUrl.ORDER_DETAILS, {
        params: queryParams
      }),
    staleTime: 5000,
    ...opt
  })
}
