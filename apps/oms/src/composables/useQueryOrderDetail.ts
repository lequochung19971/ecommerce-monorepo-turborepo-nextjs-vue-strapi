import httpClient from '@/httpClient'
import type { AxiosUseQuery } from '@/types/axiosUseQuery'
import { QueryKey } from '@/types/queryKey'
import { type QueryResponse } from '@/types/queryResponse'
import { useQuery } from '@tanstack/vue-query'
import { ApiUrl, type OrderDetail } from 'types'

export const useQueryOrderDetail: AxiosUseQuery<
  { id: string; params: object },
  QueryResponse<OrderDetail>
> = ({ id, params }, opt = {}) => {
  return useQuery({
    queryKey: [QueryKey.ORDER_MANAGEMENT, { id }],
    queryFn: () =>
      httpClient.get(`${ApiUrl.ORDER_DETAILS}/${id}`, {
        params
      }),
    staleTime: 5000,
    ...opt
  })
}
