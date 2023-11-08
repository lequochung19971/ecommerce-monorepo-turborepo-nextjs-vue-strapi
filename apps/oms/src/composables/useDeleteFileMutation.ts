import { appQueryClient } from '@/configs/appQueryClient'
import httpClient from '@/httpClient'
import type { AxiosUseMutation } from '@/types/axiosUseMutation'
import { QueryKey } from '@/types/queryKey'
import { useMutation } from '@tanstack/vue-query'
import { ApiUrl } from 'types'

export const useDeleteFileMutation: AxiosUseMutation<unknown, string | number> = (opt = {}) => {
  return useMutation({
    mutationFn: (id) => httpClient.delete(`${ApiUrl.FILES}/${id}`),
    ...opt,
    onSuccess: (data, variable, context) => {
      if (typeof opt.onSuccess === 'function') {
        opt.onSuccess?.(data, variable, context)
      }
      appQueryClient.invalidateQueries({
        queryKey: [QueryKey.FILES]
      })
    }
  })
}
