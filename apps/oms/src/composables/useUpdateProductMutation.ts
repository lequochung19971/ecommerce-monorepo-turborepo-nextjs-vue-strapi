import { appQueryClient } from '@/configs/appQueryClient'
import httpClient from '@/httpClient'
import type { AxiosUseMutation } from '@/types/axiosUseMutation'
import { QueryKey } from '@/types/queryKey'
import { useMutation } from '@tanstack/vue-query'
import type { UpdateProductRequest } from 'types'
import { ApiUrl } from 'types'

export const useUpdateProductMutation: AxiosUseMutation<unknown, UpdateProductRequest> = (
  opt = {}
) => {
  return useMutation({
    mutationFn: (updatedData) =>
      httpClient.put(`${ApiUrl.PRODUCTS}/${updatedData.id}`, {
        data: updatedData
      }),
    ...opt,
    onSuccess: (data, variable, context) => {
      if (typeof opt.onSuccess === 'function') {
        opt.onSuccess?.(data, variable, context)
      }
      appQueryClient.invalidateQueries({
        queryKey: [QueryKey.PRODUCTS]
      })
    }
  })
}
