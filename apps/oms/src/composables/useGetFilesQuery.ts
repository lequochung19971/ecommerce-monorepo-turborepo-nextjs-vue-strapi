import httpClient from '@/httpClient'
import type { AxiosUseQuery } from '@/types/axiosUseQuery'
import { QueryKey } from '@/types/queryKey'
import { useQuery } from '@tanstack/vue-query'
import type { Media } from 'types'
import { ApiUrl } from 'types'

export const useGetFilesQuery: AxiosUseQuery<unknown, Media[]> = (
  _queryParams: unknown,
  opt = {}
) => {
  return useQuery({
    queryKey: [QueryKey.FILES],
    queryFn: () => {
      return httpClient.get(ApiUrl.FILES)
    },
    staleTime: 15 * 1000,
    ...opt
  })
}
