import type { UseQueryOptions, UseQueryReturnType } from '@tanstack/vue-query'
import type { AxiosError, AxiosResponse } from 'axios'

export type AxiosUseQuery<
  TArgs = any,
  TQueryFnData = unknown,
  TData = AxiosResponse<TQueryFnData>,
  TError = AxiosError
> = {
  (
    args: TArgs,
    opt?: UseQueryOptions<AxiosResponse<TQueryFnData>, TError, TData>
  ): UseQueryReturnType<TData, TError>
}
