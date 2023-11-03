import httpClient from '@/httpClient'
import type { AxiosUseMutation } from '@/types/axiosUseMutation'
import { useMutation } from '@tanstack/vue-query'
import { ApiUrl } from 'types'

export const useDeleteCategoryMutation: AxiosUseMutation<unknown, string> = (opt = {}) => {
  return useMutation({
    mutationFn: (id) => httpClient.delete(`${ApiUrl.CATEGORIES}/${id}`),
    ...opt
  })
}
