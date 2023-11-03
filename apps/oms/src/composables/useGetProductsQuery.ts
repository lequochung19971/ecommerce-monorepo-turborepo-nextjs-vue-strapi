import httpClient from '@/httpClient'
import type { AxiosUseQuery } from '@/types/axiosUseQuery'
import { QueryKey } from '@/types/queryKey'
import { type QueryResponse } from '@/types/queryResponse'
import { useQuery } from '@tanstack/vue-query'
import type { Product } from 'types'
import { ApiUrl } from 'types'
import { toValue } from 'vue'

export const useGetProductsQuery: AxiosUseQuery<object, QueryResponse<Product[]>> = (
  queryParams: object,
  opt = {}
) => {
  return useQuery({
    queryKey: [QueryKey.PRODUCTS, queryParams],
    queryFn: () =>
      httpClient.get(ApiUrl.PRODUCTS, {
        params: toValue(queryParams)
      }),
    staleTime: 15000,
    ...opt
  })
}
