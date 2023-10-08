import type { UseQueryOptions, UseQueryReturnType } from '@tanstack/vue-query'
import type { AxiosError, AxiosResponse } from 'axios'

export type AxiosUseQuery<TArgs = any, TData = unknown, TError = AxiosError> = {
  (
    args: TArgs,
    opt?: UseQueryOptions<AxiosResponse<TData>, TError, AxiosResponse<TData>>
  ): UseQueryReturnType<AxiosResponse<TData>, TError>
}
