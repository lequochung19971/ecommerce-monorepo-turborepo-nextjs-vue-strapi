import httpClient from '@/httpClient'
import type { AxiosUseQuery } from '@/types/axiosUseQuery'
import { QueryKey } from '@/types/queryKey'
import { useQuery } from '@tanstack/vue-query'
import type { User } from 'types'
import { ApiUrl } from 'types'
import { toValue } from 'vue'

export const useUsersQuery: AxiosUseQuery<object, User[]> = (queryParams: object, opt = {}) => {
  return useQuery({
    queryKey: [QueryKey.USER, queryParams],
    queryFn: () =>
      httpClient.get(ApiUrl.USERS, {
        params: toValue(queryParams)
      }),
    staleTime: 15000,
    ...opt
  })
}
