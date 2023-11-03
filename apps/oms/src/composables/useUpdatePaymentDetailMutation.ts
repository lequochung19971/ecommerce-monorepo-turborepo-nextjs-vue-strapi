import { appQueryClient } from '@/configs/appQueryClient'
import httpClient from '@/httpClient'
import type { AxiosUseMutation } from '@/types/axiosUseMutation'
import { QueryKey } from '@/types/queryKey'
import { useMutation } from '@tanstack/vue-query'
import type { PaymentDetail } from 'types'
import { ApiUrl } from 'types'

export const useUpdatePaymentDetailMutation: AxiosUseMutation<unknown, Partial<PaymentDetail>> = (
  opt = {}
) => {
  return useMutation({
    mutationFn: (data) =>
      httpClient.put(`${ApiUrl.PAYMENT_DETAILS}/${data.id}`, {
        data: data
      }),
    ...opt,
    onSuccess: (data, variable, context) => {
      if (typeof opt.onSuccess === 'function') {
        opt.onSuccess?.(data, variable, context)
      }
      appQueryClient.invalidateQueries({
        queryKey: [QueryKey.PAYMENT_DETAILS]
      })
    }
  })
}
