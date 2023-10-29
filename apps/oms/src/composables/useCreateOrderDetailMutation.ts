import { appQueryClient } from '@/configs/appQueryClient'
import httpClient from '@/httpClient'
import type { AxiosUseMutation } from '@/types/axiosUseMutation'
import { QueryKey } from '@/types/queryKey'
import { useMutation } from '@tanstack/vue-query'
import type { CreateOrderDetailRequest } from 'types'
import { ApiUrl } from 'types'

export const useCreateOrderDetailMutation: AxiosUseMutation<unknown, CreateOrderDetailRequest> = (
  opt = {}
) => {
  return useMutation({
    mutationFn: (updatedOrderDetail) => httpClient.post(ApiUrl.ORDER_DETAILS, updatedOrderDetail),
    ...opt,
    onSuccess: (data, variable, context) => {
      if (typeof opt.onSuccess === 'function') {
        opt.onSuccess?.(data, variable, context)
      }
      appQueryClient.invalidateQueries({
        queryKey: [QueryKey.ORDER_DETAIL]
      })
    }
  })
}
