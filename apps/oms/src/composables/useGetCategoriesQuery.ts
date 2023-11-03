import httpClient from '@/httpClient'
import type { AxiosUseQuery } from '@/types/axiosUseQuery'
import { QueryKey } from '@/types/queryKey'
import { type QueryResponse } from '@/types/queryResponse'
import { useQuery } from '@tanstack/vue-query'
import type { Category } from 'types'
import { ApiUrl } from 'types'
import { toValue } from 'vue'

export const useGetCategoriesQuery: AxiosUseQuery<object, QueryResponse<Category[]>> = (
  queryParams: any,
  opt = {}
) => {
  return useQuery({
    queryKey: [QueryKey.CATEGORIES, queryParams],
    queryFn: () => {
      return httpClient.get(ApiUrl.CATEGORIES, {
        params: toValue(queryParams)
      })
    },
    staleTime: 15 * 1000,
    ...opt
  })
}
