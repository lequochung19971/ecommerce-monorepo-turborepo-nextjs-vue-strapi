import type {
  UseMutationReturnType,
  VueMutationObserverOptions
} from '@tanstack/vue-query/build/lib/useMutation'
import type { AxiosResponse } from 'axios'

export type AxiosUseMutation<
  TData = unknown,
  TVariables = void,
  TError = unknown,
  TContext = unknown
> = {
  (
    opt?: VueMutationObserverOptions<AxiosResponse<TData>, TError, TVariables, TContext>
  ): UseMutationReturnType<AxiosResponse<TData>, TError, TVariables, TContext>
}
