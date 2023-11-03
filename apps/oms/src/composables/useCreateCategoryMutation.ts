import { appQueryClient } from '@/configs/appQueryClient'
import httpClient from '@/httpClient'
import type { AxiosUseMutation } from '@/types/axiosUseMutation'
import { QueryKey } from '@/types/queryKey'
import { useMutation } from '@tanstack/vue-query'
import type { CreateCategoryRequest, CreateOrderDetailRequest } from 'types'
import { ApiUrl } from 'types'

export const useCreateCategoryMutation: AxiosUseMutation<unknown, CreateCategoryRequest> = (
  opt = {}
) => {
  return useMutation({
    mutationFn: (newCategory) =>
      httpClient.post(ApiUrl.CATEGORIES, {
        data: newCategory
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
