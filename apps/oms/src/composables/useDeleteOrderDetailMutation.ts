import httpClient from '@/httpClient'
import type { AxiosUseMutation } from '@/types/axiosUseMutation'
import { useMutation } from '@tanstack/vue-query'
import { ApiUrl, type OrderDetail } from 'types'

export const useDeleteOrderDetailMutation: AxiosUseMutation<unknown, string> = (opt = {}) => {
  return useMutation({
    mutationFn: (id) => httpClient.delete(`${ApiUrl.ORDER_DETAILS}/${id}`),
    ...opt
  })
}
