import httpClient from '@/httpClient'
import type { AxiosUseQuery } from '@/types/axiosUseQuery'
import { QueryKey } from '@/types/queryKey'
import { type QueryResponse } from '@/types/queryResponse'
import { useQuery } from '@tanstack/vue-query'
import type { Product } from 'types'
import { ApiUrl } from 'types'

export const useGetProductQuery: AxiosUseQuery<
  { id: string; params: object },
  QueryResponse<Product>
> = ({ id, params }, opt = {}) => {
  return useQuery({
    queryKey: [QueryKey.PRODUCTS, id.toString()],
    queryFn: () =>
      httpClient.get(`${ApiUrl.PRODUCTS}/${id}`, {
        params
      }),
    staleTime: 15000,
    ...opt
  })
}
