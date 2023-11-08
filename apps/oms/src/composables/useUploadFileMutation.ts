import { appQueryClient } from '@/configs/appQueryClient'
import httpClient from '@/httpClient'
import type { AxiosUseMutation } from '@/types/axiosUseMutation'
import { QueryKey } from '@/types/queryKey'
import { useMutation } from '@tanstack/vue-query'
import type { Media } from 'types'
import { ApiUrl } from 'types'

export const useUploadFileMutation: AxiosUseMutation<Media[], FormData> = (opt = {}) => {
  return useMutation({
    mutationFn: (formData) => httpClient.post(ApiUrl.UPLOAD, formData),
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
