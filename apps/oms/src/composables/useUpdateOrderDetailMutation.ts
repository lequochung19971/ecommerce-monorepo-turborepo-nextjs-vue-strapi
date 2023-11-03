import { appQueryClient } from '@/configs/appQueryClient'
import httpClient from '@/httpClient'
import type { AxiosUseMutation } from '@/types/axiosUseMutation'
import { QueryKey } from '@/types/queryKey'
import { useMutation } from '@tanstack/vue-query'
import { ApiUrl, type OrderDetail } from 'types'

export const useUpdateOrderDetailMutation: AxiosUseMutation<unknown, Partial<OrderDetail>> = (
  opt = {}
) => {
  return useMutation({
    mutationFn: (updatedOrderDetail) =>
      httpClient.put(`${ApiUrl.ORDER_DETAILS}/${updatedOrderDetail.id}`, {
        data: updatedOrderDetail
      }),
    ...opt,
    onSuccess: (data, variable, context) => {
      if (typeof opt.onSuccess === 'function') {
        opt.onSuccess?.(data, variable, context)
      }
      appQueryClient.invalidateQueries({
        queryKey: [QueryKey.ORDER_DETAILS]
      })
    }
  })
}
