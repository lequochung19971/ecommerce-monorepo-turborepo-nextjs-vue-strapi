import { appQueryClient } from '@/configs/appQueryClient'
import httpClient from '@/httpClient'
import type { AxiosUseMutation } from '@/types/axiosUseMutation'
import { QueryKey } from '@/types/queryKey'
import { useMutation } from '@tanstack/vue-query'
import type { CreateProductRequest } from 'types'
import { ApiUrl } from 'types'

export const useCreateProductMutation: AxiosUseMutation<unknown, CreateProductRequest> = (
  opt = {}
) => {
  return useMutation({
    mutationFn: (newProduct) =>
      httpClient.post(ApiUrl.PRODUCTS, {
        data: newProduct
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
