import httpClient from '@/httpClient'
import type { AxiosUseQuery } from '@/types/axiosUseQuery'
import { QueryKey } from '@/types/queryKey'
import { type QueryResponse } from '@/types/queryResponse'
import { useQuery } from '@tanstack/vue-query'
import type { Category } from 'types'
import { ApiUrl } from 'types'

export const useGetCategoryQuery: AxiosUseQuery<
  { id: string; params: object },
  QueryResponse<Category>
> = ({ id, params }, opt = {}) => {
  return useQuery({
    queryKey: [QueryKey.CATEGORIES, { id: id.toString() }],
    queryFn: () =>
      httpClient.get(`${ApiUrl.CATEGORIES}/${id}`, {
        params
      }),
    staleTime: 15000,
    ...opt
  })
}
