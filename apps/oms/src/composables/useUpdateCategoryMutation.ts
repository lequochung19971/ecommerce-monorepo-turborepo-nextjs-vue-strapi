import { appQueryClient } from '@/configs/appQueryClient'
import httpClient from '@/httpClient'
import type { AxiosUseMutation } from '@/types/axiosUseMutation'
import { QueryKey } from '@/types/queryKey'
import { useMutation } from '@tanstack/vue-query'
import type { UpdateCategoryRequest } from 'types'
import { ApiUrl } from 'types'

export const useUpdateCategoryMutation: AxiosUseMutation<unknown, UpdateCategoryRequest> = (
  opt = {}
) => {
  return useMutation({
    mutationFn: (updatedCategory) =>
      httpClient.put(`${ApiUrl.CATEGORIES}/${updatedCategory.id}`, {
        data: updatedCategory
      }),
    ...opt,
    onSuccess: (data, variable, context) => {
      if (typeof opt.onSuccess === 'function') {
        opt.onSuccess?.(data, variable, context)
      }
      appQueryClient.invalidateQueries({
        queryKey: [QueryKey.CATEGORIES]
      })
    }
  })
}
